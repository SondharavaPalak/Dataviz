from django.contrib import admin
from .models import DataAnalysis, AnalysisInsight, GeneratedGraph

@admin.register(DataAnalysis)
class DataAnalysisAdmin(admin.ModelAdmin):
    list_display = ('dataset_name', 'status', 'rows_count', 'columns_count', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('dataset_name',)
    readonly_fields = ('id', 'created_at', 'updated_at')

@admin.register(AnalysisInsight)
class AnalysisInsightAdmin(admin.ModelAdmin):
    list_display = ('analysis', 'insight_type', 'column_name', 'importance_score')
    list_filter = ('insight_type', 'importance_score')
    search_fields = ('description',)

@admin.register(GeneratedGraph)
class GeneratedGraphAdmin(admin.ModelAdmin):
    list_display = ('analysis', 'graph_type', 'title')
    list_filter = ('graph_type',)
    search_fields = ('title', 'description')
