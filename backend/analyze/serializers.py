from rest_framework import serializers
from .models import DataAnalysis, AnalysisInsight, GeneratedGraph

class AnalysisInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisInsight
        fields = '__all__'

class GeneratedGraphSerializer(serializers.ModelSerializer):
    graph_url = serializers.SerializerMethodField()

    class Meta:
        model = GeneratedGraph
        fields = '__all__'

    def get_graph_url(self, obj):
        if obj.file_path:
            # Ensure proper MEDIA_URL prefix
            from django.conf import settings
            return settings.MEDIA_URL + obj.file_path
        return None

class DataAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataAnalysis
        fields = '__all__'
  
class GraphSelectionSerializer(serializers.Serializer):
    graph_types = serializers.ListField(
        child=serializers.CharField(),
        help_text="List of graph types to generate, e.g. ['histogram', 'boxplot', 'correlation']",
    )
    columns = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of columns to apply selected graphs to",
    )
