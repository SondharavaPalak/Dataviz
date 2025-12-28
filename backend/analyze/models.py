from django.db import models
from django.contrib.auth.models import User
from accounts.models import Profile
import uuid

class DataAnalysis(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)
    dataset_name = models.CharField(max_length=255,blank=True,null=True)
    original_file = models.FileField(upload_to='datasets/original/',blank=True,null=True)
    cleaned_file = models.FileField(upload_to='datasets/cleaned/', null=True, blank=True)
    
    # Analysis results
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    rows_count = models.IntegerField(null=True, blank=True)
    columns_count = models.IntegerField(null=True, blank=True)
    missing_values_count = models.IntegerField(null=True, blank=True)
    duplicates_count = models.IntegerField(null=True, blank=True)
    outliers_count = models.IntegerField(null=True, blank=True)
    
    # Generated files
    report_pdf = models.FileField(upload_to='reports/pdf/', null=True, blank=True)
    report_html = models.FileField(upload_to='reports/html/', null=True, blank=True)
    graphs_zip = models.FileField(upload_to='reports/graphs/', null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processing_time = models.FloatField(null=True, blank=True)  # in seconds
    
    class Meta:
        ordering = ['-created_at']

class AnalysisInsight(models.Model):
    analysis = models.ForeignKey(DataAnalysis, on_delete=models.CASCADE, related_name='insights')
    insight_type = models.CharField(max_length=50,null=True, blank=True)  # 'correlation', 'outlier', 'trend', etc.
    column_name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    value = models.JSONField(null=True, blank=True)  # Store additional data
    importance_score = models.FloatField(default=0.0)
    
    class Meta:
        ordering = ['-importance_score']

class GeneratedGraph(models.Model):
    GRAPH_TYPES = [
        ('histogram', 'Histogram'),
        ('boxplot', 'Box Plot'),
        ('scatter', 'Scatter Plot'),
        ('correlation', 'Correlation Heatmap'),
        ('countplot', 'Count Plot'),
        ('pairplot', 'Pair Plot'),
        ('timeseries', 'Time Series'),
    ]
    
    analysis = models.ForeignKey(DataAnalysis, on_delete=models.CASCADE, related_name='graphs')
    graph_type = models.CharField(max_length=50, choices=GRAPH_TYPES)
    column_names = models.JSONField(blank=True,null=True)  # List of columns used
    file_path = models.CharField(max_length=500,blank=True)
    graph_file = models.FileField(upload_to="graphs/", blank=True, null=True)
    title = models.CharField(max_length=255,blank=True)
    description = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['graph_type', 'title']