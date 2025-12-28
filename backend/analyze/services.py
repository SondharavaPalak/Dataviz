import pandas as pd
import numpy as np
import matplotlib 
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')
import os
from scipy import stats
from django.conf import settings
from .models import AnalysisInsight, GeneratedGraph

class DataAnalysisService:
    def __init__(self, analysis_instance):
        self.analysis = analysis_instance
        self.df = None
        self.original_df = None
        self.insights = []
        self.graphs = []
        self.graphs_dir = os.path.join(settings.MEDIA_ROOT,"graphs")
        os.makedirs(self.graphs_dir, exist_ok=True)

    def load_data(self):
        """Load data from uploaded file"""
        file_path = self.analysis.original_file.path
        file_extension = os.path.splitext(file_path)[1].lower()
        
        try:
            if file_extension == '.csv':
                # Try different encodings and separators
                for encoding in ['utf-8', 'latin-1', 'cp1252']:
                    try:
                        for sep in [',', ';', '\t']:
                            try:
                                df = pd.read_csv(file_path, encoding=encoding, sep=sep)
                                if df.shape[1] > 1:  # Valid if more than 1 column
                                    self.df = df
                                    break
                            except:
                                continue
                        if self.df is not None:
                            break
                    except:
                        continue
                        
            elif file_extension in ['.xlsx', '.xls']:
                self.df = pd.read_excel(file_path)
                
            elif file_extension == '.json':
                self.df = pd.read_json(file_path)
                
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
            
            if self.df is None or self.df.empty:
                raise ValueError("Could not load data or file is empty")
                
            self.original_df = self.df.copy()
            return True
            
        except Exception as e:
            print(f"Error loading data: {str(e)}")
            return False
    
    def clean_data(self):
        """Automatic data cleaning"""
        if self.df is None:
            return False
        
        try:
            # Store original stats
            original_rows = len(self.df)
            
            # 1. Clean column names
            self.df.columns = self.df.columns.str.lower().str.replace(' ', '_').str.replace('[^a-zA-Z0-9_]', '', regex=True)
            
            # 2. Handle duplicates
            duplicates_count = self.df.duplicated().sum()
            self.df = self.df.drop_duplicates()
            
            # 3. Handle missing values
            missing_before = self.df.isnull().sum().sum()
            
            for column in self.df.columns:
                missing_pct = self.df[column].isnull().sum() / len(self.df)
                
                if missing_pct > 0.5:  # Drop columns with >50% missing
                    self.df = self.df.drop(column, axis=1)
                    continue
                
                if self.df[column].dtype in ['object', 'string']:
                    # Fill categorical with mode
                    mode_value = self.df[column].mode()
                    if not mode_value.empty:
                        self.df[column] = self.df[column].fillna(mode_value[0])
                    else:
                        self.df[column] = self.df[column].fillna('Unknown')
                        
                elif self.df[column].dtype in ['int64', 'float64']:
                    # Fill numerical with median
                    median_value = self.df[column].median()
                    self.df[column] = self.df[column].fillna(median_value)
            
            # 4. Data type conversion
            for column in self.df.columns:
                # Try to convert to datetime
                if self.df[column].dtype == 'object':
                    # Check if it's a date
                    try:
                        pd.to_datetime(self.df[column].dropna().head(100))
                        self.df[column] = pd.to_datetime(self.df[column], errors='ignore')
                    except:
                        # Check if it's numeric
                        try:
                            numeric_series = pd.to_numeric(self.df[column], errors='coerce')
                            if numeric_series.notna().sum() > len(self.df) * 0.8:  # >80% convertible
                                self.df[column] = numeric_series
                        except:
                            pass
                
                # Convert to categorical if few unique values
                if self.df[column].dtype == 'object':
                    unique_ratio = self.df[column].nunique() / len(self.df)
                    if unique_ratio < 0.1:  # Less than 10% unique values
                        self.df[column] = self.df[column].astype('category')
            
            # 5. Handle outliers (for numeric columns only)
            outliers_count = 0
            numeric_columns = self.df.select_dtypes(include=[np.number]).columns
            
            for column in numeric_columns:
                Q1 = self.df[column].quantile(0.25)
                Q3 = self.df[column].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                outliers = ((self.df[column] < lower_bound) | (self.df[column] > upper_bound))
                outliers_count += outliers.sum()
                
                # Cap outliers instead of removing
                self.df[column] = np.clip(self.df[column], lower_bound, upper_bound)
            
            # Update analysis stats
            self.analysis.rows_count = len(self.df)
            self.analysis.columns_count = len(self.df.columns)
            self.analysis.duplicates_count = duplicates_count
            self.analysis.missing_values_count = missing_before
            self.analysis.outliers_count = outliers_count
            self.analysis.save()
            
            return True
            
        except Exception as e:
            print(f"Error cleaning data: {str(e)}")
            return False
    
    def generate_insights(self):
        """Generate automatic insights"""
        if self.df is None:
            return
        
        insights = []
        
        # Dataset overview insights
        insights.append({
            'type': 'overview',
            'description': f"Dataset contains {len(self.df)} rows and {len(self.df.columns)} columns after cleaning.",
            'importance': 0.9
        })
        
        # Missing data insights
        if self.analysis.missing_values_count > 0:
            insights.append({
                'type': 'data_quality',
                'description': f"Found and handled {self.analysis.missing_values_count} missing values across the dataset.",
                'importance': 0.8
            })
        
        # Duplicates insights
        if self.analysis.duplicates_count > 0:
            insights.append({
                'type': 'data_quality',
                'description': f"Removed {self.analysis.duplicates_count} duplicate records.",
                'importance': 0.7
            })
        
        # Correlation insights
        numeric_df = self.df.select_dtypes(include=[np.number])
        if len(numeric_df.columns) > 1:
            corr_matrix = numeric_df.corr()
            
            # Find strongest correlations
            corr_pairs = []
            for i in range(len(corr_matrix.columns)):
                for j in range(i+1, len(corr_matrix.columns)):
                    corr_val = corr_matrix.iloc[i, j]
                    if abs(corr_val) > 0.7:  # Strong correlation
                        corr_pairs.append({
                            'col1': corr_matrix.columns[i],
                            'col2': corr_matrix.columns[j],
                            'correlation': corr_val
                        })
            
            for pair in sorted(corr_pairs, key=lambda x: abs(x['correlation']), reverse=True)[:5]:
                insights.append({
                    'type': 'correlation',
                    'column': f"{pair['col1']} vs {pair['col2']}",
                    'description': f"Strong {'positive' if pair['correlation'] > 0 else 'negative'} correlation ({pair['correlation']:.3f}) between {pair['col1']} and {pair['col2']}.",
                    'value': pair['correlation'],
                    'importance': abs(pair['correlation'])
                })
        
        # Distribution insights
        for column in numeric_df.columns:
            skewness = stats.skew(numeric_df[column].dropna())
            if abs(skewness) > 1:
                insights.append({
                    'type': 'distribution',
                    'column': column,
                    'description': f"Column '{column}' shows {'right' if skewness > 0 else 'left'} skewed distribution (skewness: {skewness:.3f}).",
                    'value': skewness,
                    'importance': min(abs(skewness) / 3, 1.0)
                })
        
        # Categorical insights
        categorical_columns = self.df.select_dtypes(include=['object', 'category']).columns
        for column in categorical_columns:
            value_counts = self.df[column].value_counts()
            if len(value_counts) > 0:
                most_common = value_counts.index[0]
                percentage = (value_counts.iloc[0] / len(self.df)) * 100
                
                insights.append({
                    'type': 'categorical',
                    'column': column,
                    'description': f"Most common value in '{column}' is '{most_common}' ({percentage:.1f}% of data).",
                    'value': {'value': most_common, 'percentage': percentage},
                    'importance': 0.6
                })
        
        # Save insights to database
        for insight in insights:
            AnalysisInsight.objects.create(
                analysis=self.analysis,
                insight_type=insight['type'],
                column_name=insight.get('column'),
                description=insight['description'],
                value=insight.get('value'),
                importance_score=insight['importance']
            )
    
    def generate_graphs(self):
        """
        Generate only user-selected graphs.
        selected_graphs: list of graph types e.g. ["histogram", "boxplot", "correlation"]
        """
        if self.df is None:
            return

        plt.style.use('default')
        sns.set_palette("husl")

        numeric_columns = self.df.select_dtypes(include=[np.number]).columns
        categorical_columns = self.df.select_dtypes(include=['object', 'category']).columns
        datetime_columns = self.df.select_dtypes(include=['datetime64']).columns

        # Generate overview
        self._create_overview_graph()

        for col in numeric_columns:
            self._create_histogram(col)

        for col in numeric_columns:
            self._create_boxplot(col)

        for col in categorical_columns[:5]:
            self._create_countplot(col)

        # Correlation
        if len(numeric_columns) > 1:
            self._create_correlation_heatmap(numeric_columns)
        
        #scatter matrix
        if len(numeric_columns) > 1:
            self._create_scatter_matrix(numeric_columns)

        # Time series
        if len(datetime_columns) > 0 and len(numeric_columns) > 0:
            self._create_timeseries(datetime_columns[0], numeric_columns[0])
    
    def _create_overview_graph(self):
        """Create dataset overview visualization"""
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        fig.suptitle('Dataset Overview', fontsize=16, fontweight='bold')
        
        # Data types distribution
        dtype_counts = self.df.dtypes.value_counts()
        axes[0, 0].pie(dtype_counts.values, labels=dtype_counts.index, autopct='%1.1f%%')
        axes[0, 0].set_title('Data Types Distribution')
        
        # Missing values heatmap
        if self.df.isnull().sum().sum() > 0:
            sns.heatmap(self.df.isnull(), ax=axes[0, 1], cbar=True, yticklabels=False)
            axes[0, 1].set_title('Missing Values Pattern')
        else:
            axes[0, 1].text(0.5, 0.5, 'No Missing Values', ha='center', va='center', transform=axes[0, 1].transAxes)
            axes[0, 1].set_title('Missing Values Pattern')
        
        # Column info
        info_text = f"Rows: {len(self.df)}\nColumns: {len(self.df.columns)}\nMemory Usage: {self.df.memory_usage(deep=True).sum() / 1024**2:.2f} MB"
        axes[1, 0].text(0.1, 0.5, info_text, transform=axes[1, 0].transAxes, fontsize=12, verticalalignment='center')
        axes[1, 0].set_title('Dataset Statistics')
        axes[1, 0].axis('off')
        
        # Numeric vs Categorical columns
        numeric_count = len(self.df.select_dtypes(include=[np.number]).columns)
        categorical_count = len(self.df.select_dtypes(include=['object', 'category']).columns)
        datetime_count = len(self.df.select_dtypes(include=['datetime64']).columns)
        
        column_types = ['Numeric', 'Categorical', 'Datetime']
        counts = [numeric_count, categorical_count, datetime_count]
        axes[1, 1].bar(column_types, counts, color=['skyblue', 'lightcoral', 'lightgreen'])
        axes[1, 1].set_title('Column Types Distribution')
        axes[1, 1].set_ylabel('Count')
        
        plt.tight_layout()
        file_path = os.path.join(self.graphs_dir, f'dataset_overview.png')
        plt.savefig(file_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        GeneratedGraph.objects.create(
            analysis=self.analysis,
            graph_type='overview',
            column_names=['all'],
            file_path=file_path,
            title='Dataset Overview',
            description='Overview of the dataset structure and basic statistics'
        )
    def _create_scatter_matrix(self, numeric_columns):
        """Create scatter matrix (pairplot) for numeric columns"""
        try:
            if len(numeric_columns) > 1:
                plt.figure()
                sns.set(style="ticks", color_codes=True)

                # Use seaborn pairplot
                pairplot = sns.pairplot(self.df[numeric_columns], diag_kind="hist", plot_kws={'alpha': 0.6})

                pairplot.fig.suptitle('Scatter Matrix of Numeric Variables', y=1.02, fontsize=16, fontweight='bold')
                file_path = os.path.join(self.graphs_dir, 'scatter_matrix.png')
                plt.savefig(file_path, dpi=300, bbox_inches='tight')
                plt.close()

                GeneratedGraph.objects.create(
                    analysis=self.analysis,
                    graph_type='scatter',
                    column_names=list(numeric_columns),
                    file_path=file_path,
                    title='Scatter Matrix',
                    description='Pairwise relationships between numeric variables'
                )
        except Exception as e:
            print(f"Error creating scatter matrix: {str(e)}")
            plt.close('all')

    def _create_histogram(self, column):
        """Create histogram for numeric column"""
        try:
            plt.figure(figsize=(10, 6))
            
            data = self.df[column].dropna()
            plt.hist(data, bins=30, alpha=0.7, color='skyblue', edgecolor='black')
            plt.axvline(data.mean(), color='red', linestyle='--', label=f'Mean: {data.mean():.2f}')
            plt.axvline(data.median(), color='green', linestyle='--', label=f'Median: {data.median():.2f}')
            
            plt.title(f'Distribution of {column}', fontsize=14, fontweight='bold')
            plt.xlabel(column)
            plt.ylabel('Frequency')
            plt.legend()
            plt.grid(True, alpha=0.3)
            
            file_path = os.path.join(self.graphs_dir, f'histogram_{column}.png')
            plt.savefig(file_path, dpi=300, bbox_inches='tight')
            plt.close()

            if not os.path.exists(file_path):
                raise Exception(f"Failed to save graph at {file_path}")
            
            GeneratedGraph.objects.create(
                analysis=self.analysis,
                graph_type='histogram',
                column_names=[column],
                file_path=file_path,
                title=f'Histogram - {column}',
                description=f'Distribution analysis of {column}'
            )
        except Exception as e:
            print(f"Error creating histogram for {column}: {str(e)}")
            plt.close()

    def _create_boxplot(self, column):
        """Create boxplot for numeric column"""
        plt.figure(figsize=(8, 6))
        
        box_plot = plt.boxplot(self.df[column].dropna(), patch_artist=True)
        box_plot['boxes'][0].set_facecolor('lightblue')
        
        plt.title(f'Box Plot of {column}', fontsize=14, fontweight='bold')
        plt.ylabel(column)
        plt.grid(True, alpha=0.3)
        
        file_path = os.path.join(self.graphs_dir, f'boxplot_{column}.png')
        plt.savefig(file_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        GeneratedGraph.objects.create(
            analysis=self.analysis,
            graph_type='boxplot',
            column_names=[column],
            file_path=file_path,
            title=f'Box Plot - {column}',
            description=f'Outlier analysis of {column}'
        )
    
    def _create_countplot(self, column):
        """Create count plot for categorical column"""
        plt.figure(figsize=(12, 6))
        
        value_counts = self.df[column].value_counts().head(10)  # Top 10 categories
        
        plt.bar(range(len(value_counts)), value_counts.values, color='lightcoral')
        plt.title(f'Count Plot of {column}', fontsize=14, fontweight='bold')
        plt.xlabel(column)
        plt.ylabel('Count')
        plt.xticks(range(len(value_counts)), value_counts.index, rotation=45, ha='right')
        plt.grid(True, alpha=0.3)
        
        plt.tight_layout()
        
        file_path = os.path.join(self.graphs_dir, f'countplot_{column}.png')
        plt.savefig(file_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        GeneratedGraph.objects.create(
            analysis=self.analysis,
            graph_type='countplot',
            column_names=[column],
            file_path=file_path,
            title=f'Count Plot - {column}',
            description=f'Frequency analysis of {column} categories'
        )
    
    def _create_correlation_heatmap(self, numeric_columns):
        """Create correlation heatmap"""
        plt.figure(figsize=(12, 10))
        
        correlation_matrix = self.df[numeric_columns].corr()
        
        mask = np.triu(np.ones_like(correlation_matrix, dtype=bool))
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0,
                    square=True, mask=mask, cbar_kws={'label': 'Correlation Coefficient'})
        
        plt.title('Correlation Heatmap', fontsize=14, fontweight='bold')
        plt.tight_layout()
        
        file_path = os.path.join(self.graphs_dir, 'correlation_heatmap.png')
        plt.savefig(file_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        GeneratedGraph.objects.create(
            analysis=self.analysis,
            graph_type='correlation',
            column_names=list(numeric_columns),
            file_path=file_path,
            title='Correlation Heatmap',
            description='Correlation analysis between numeric variables'
        )
    
    

    def _create_timeseries(self, date_col, value_col):
        """Create time series plot"""
        plt.figure(figsize=(14, 6))
        
        # Sort by date
        df_sorted = self.df.sort_values(date_col)
        
        plt.plot(df_sorted[date_col], df_sorted[value_col], linewidth=2, color='navy')
        plt.title(f'Time Series: {value_col} over {date_col}', fontsize=14, fontweight='bold')
        plt.xlabel(date_col)
        plt.ylabel(value_col)
        plt.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        
        plt.tight_layout()
        
        file_path = os.path.join(self.graphs_dir, f'timeseries_{date_col}_{value_col}.png')
        plt.savefig(file_path, dpi=300, bbox_inches='tight')
        plt.close()
        
        GeneratedGraph.objects.create(
            analysis=self.analysis,
            graph_type='timeseries',
            column_names=[date_col, value_col],
            file_path=file_path,
            title=f'Time Series - {value_col}',
            description=f'Temporal analysis of {value_col} over time'
        )
    
    def save_cleaned_data(self):
        """Save cleaned dataset"""
        if self.df is None:
            return False
        
        try:
            # Save as CSV
            cleaned_filename = f"cleaned_{self.analysis.dataset_name}_{self.analysis.id}.csv"
            cleaned_path = os.path.join(settings.MEDIA_ROOT, 'datasets', 'cleaned', cleaned_filename)
            os.makedirs(os.path.dirname(cleaned_path), exist_ok=True)
            
            self.df.to_csv(cleaned_path, index=False)
            
            # Update model
            self.analysis.cleaned_file.name = f'datasets/cleaned/{cleaned_filename}'
            self.analysis.save()
            
            return True
        except Exception as e:
            print(f"Error saving cleaned data: {str(e)}")
            return False

    def generate_html_report(self):
        """Generate comprehensive HTML report"""
        try:
            insights = AnalysisInsight.objects.filter(analysis=self.analysis).order_by('-importance_score')
            graphs = GeneratedGraph.objects.filter(analysis=self.analysis)
            
            # Basic statistics
            numeric_df = self.df.select_dtypes(include=[np.number])
            categorical_df = self.df.select_dtypes(include=['object', 'category'])
            
            html_content = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Analysis Report - {self.analysis.dataset_name}</title>
                <style>
                    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }}
                    .container {{ max-width: 1200px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }}
                    h1 {{ color: #2c3e50; text-align: center; margin-bottom: 30px; }}
                    h2 {{ color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; }}
                    h3 {{ color: #2c3e50; }}
                    .summary {{ background-color: #ecf0f1; padding: 20px; border-radius: 8px; margin-bottom: 30px; }}
                    .stat-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }}
                    .stat-card {{ background-color: #3498db; color: white; padding: 20px; border-radius: 8px; text-align: center; }}
                    .stat-number {{ font-size: 2em; font-weight: bold; }}
                    .stat-label {{ font-size: 0.9em; opacity: 0.9; }}
                    .insight {{ background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 10px 0; }}
                    .insight-type {{ font-weight: bold; color: #856404; text-transform: uppercase; font-size: 0.8em; }}
                    .graph {{ text-align: center; margin: 30px 0; }}
                    .graph img {{ max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; }}
                    table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                    th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
                    th {{ background-color: #f2f2f2; font-weight: bold; }}
                    .footer {{ text-align: center; margin-top: 50px; color: #7f8c8d; font-size: 0.9em; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Data Analysis Report</h1>
                    <h2>{self.analysis.dataset_name}</h2>
                    
                    <div class="summary">
                        <h3>Executive Summary</h3>
                        <p>This report provides a comprehensive analysis of the dataset '{self.analysis.dataset_name}'. 
                        The analysis includes data cleaning, exploratory data analysis, statistical insights, and visualizations.</p>
                        
                        <div class="stat-grid">
                            <div class="stat-card">
                                <div class="stat-number">{len(self.df)}</div>
                                <div class="stat-label">Total Rows</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">{len(self.df.columns)}</div>
                                <div class="stat-label">Total Columns</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">{len(numeric_df.columns)}</div>
                                <div class="stat-label">Numeric Columns</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">{len(categorical_df.columns)}</div>
                                <div class="stat-label">Categorical Columns</div>
                            </div>
                        </div>
                    </div>
                    
                    <h2>Data Quality Assessment</h2>
                    <table>
                        <tr><th>Metric</th><th>Value</th></tr>
                        <tr><td>Missing Values Handled</td><td>{self.analysis.missing_values_count or 0}</td></tr>
                        <tr><td>Duplicate Records Removed</td><td>{self.analysis.duplicates_count or 0}</td></tr>
                        <tr><td>Outliers Detected & Handled</td><td>{self.analysis.outliers_count or 0}</td></tr>
                        <tr><td>Processing Time</td><td>{self.analysis.processing_time or 0:.2f} seconds</td></tr>
                    </table>
                    
                    <h2>Key Insights</h2>
            """
            
            for insight in insights[:10]:  # Top 10 insights
                html_content += f"""
                    <div class="insight">
                        <div class="insight-type">{insight.insight_type}</div>
                        <p>{insight.description}</p>
                    </div>
                """
            
            # Add descriptive statistics
            if len(numeric_df.columns) > 0:
                html_content += """
                    <h2>Descriptive Statistics</h2>
                    <table>
                        <tr><th>Column</th><th>Mean</th><th>Median</th><th>Std Dev</th><th>Min</th><th>Max</th></tr>
                """
                
                for col in numeric_df.columns:
                    stats = numeric_df[col].describe()
                    html_content += f"""
                        <tr>
                            <td>{col}</td>
                            <td>{stats['mean']:.2f}</td>
                            <td>{stats['50%']:.2f}</td>
                            <td>{stats['std']:.2f}</td>
                            <td>{stats['min']:.2f}</td>
                            <td>{stats['max']:.2f}</td>
                        </tr>
                    """
                
                html_content += "</table>"

            html_content += f"""
                    <div class="footer">
                        <p>Report generated on {self.analysis.created_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
                        <p>Data Analysis System - Automated Report Generation</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            # Save HTML report
            html_filename = f"report_{self.analysis.id}.html"
            html_path = os.path.join(settings.MEDIA_ROOT, 'reports', 'html')
            os.makedirs(html_path, exist_ok=True)
            html_path = os.path.join(html_path, html_filename)
            
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            self.analysis.report_html.name = f'reports/html/{html_filename}'
            self.analysis.save()
            
            return True
            
        except Exception as e:
            print(f"Error generating HTML report: {str(e)}")
            return False