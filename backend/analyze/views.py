from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.http import HttpResponse
from django.core.files.storage import default_storage
from django.conf import settings
import os
import time
import traceback
from .models import DataAnalysis, AnalysisInsight, GeneratedGraph
from rest_framework.permissions import IsAuthenticated
from .serializers import DataAnalysisSerializer, AnalysisInsightSerializer, GeneratedGraphSerializer
from .services import DataAnalysisService
import zipfile
from io import BytesIO
from django.shortcuts import get_object_or_404

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def upload_dataset(request):
    """Upload and initiate analysis of dataset"""
    try:
        if 'file' not in request.FILES:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.FILES['file']
        dataset_name = request.data.get('dataset_name', uploaded_file.name)
        
        # Validate file size (50MB limit)
        if uploaded_file.size > 50 * 1024 * 1024:
            return Response({'error': 'File size exceeds 50MB limit'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate file type
        allowed_extensions = ['.csv', '.xlsx', '.xls', '.json']
        file_extension = os.path.splitext(uploaded_file.name)[1].lower()
        if file_extension not in allowed_extensions:
            return Response({'error': f'Unsupported file type. Allowed: {", ".join(allowed_extensions)}'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Create analysis record
        # Use Profile for user association
        analysis = DataAnalysis.objects.create(
            user=request.user.profile,
            dataset_name=dataset_name,
            original_file=uploaded_file,
            status='pending'
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
    # Avoid calling process_dataset_sync synchronously in the request/response cycle
    # Instead, trigger it asynchronously (e.g., with Celery) or call it after response if needed
    # For now, call it after returning the response (not recommended for production)
    serializer = DataAnalysisSerializer(analysis)
    response = Response(serializer.data, status=status.HTTP_201_CREATED)
    process_dataset_sync(analysis.id)
    return response
        
    # (moved above)
        
   

def process_dataset_sync(analysis_id):
    """Process dataset synchronously (use Celery in production)"""
    try:
        analysis = DataAnalysis.objects.get(id=analysis_id)
        analysis.status = 'processing'
        analysis.save()
        
        start_time = time.time()
        
        # Initialize service
        service = DataAnalysisService(analysis)
        
        # Load data
        if not service.load_data():
            analysis.status = 'failed'
            analysis.save()
            return
        
        # Clean data
        if not service.clean_data():
            analysis.status = 'failed'
            analysis.save()
            return
        
        # Generate insights
        service.generate_insights()
        # Generate graphs
        service.generate_graphs()
        
        # Save cleaned data
        service.save_cleaned_data()
        
        # Generate HTML report
        service.generate_html_report()
        
        # Update completion status
        processing_time = time.time() - start_time
        analysis.processing_time = processing_time
        analysis.status = 'completed'
        analysis.save()
        
    except Exception as e:
        print(f"Error processing dataset: {str(e)}")
        print(traceback.format_exc())
        analysis.status = 'failed'
        analysis.save()

@api_view(['GET'])
def get_analysis(request, analysis_id):
    """Get analysis details"""
    try:
        analysis = get_object_or_404(DataAnalysis, id=analysis_id)
        serializer = DataAnalysisSerializer(analysis)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_analysis_insights(request, analysis_id):
    """Get analysis insights"""
    try:
        analysis = get_object_or_404(DataAnalysis, id=analysis_id)
        insights = AnalysisInsight.objects.filter(analysis=analysis)
        serializer = AnalysisInsightSerializer(insights, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_analysis_graphs(request, analysis_id):
    """Get analysis graphs"""
    try:
        analysis = get_object_or_404(DataAnalysis, id=analysis_id)
        graphs = GeneratedGraph.objects.filter(analysis=analysis)
        serializer = GeneratedGraphSerializer(graphs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_analyses(request):
    """List all analyses for the logged-in user"""
    try:
        analyses = DataAnalysis.objects.filter(user=request.user.profile)
        serializer = DataAnalysisSerializer(analyses, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_analysis(request, analysis_id):
    """Delete analysis and associated files"""
    try:
        analysis = get_object_or_404(DataAnalysis, id=analysis_id)
        
        # Delete associated files
        if analysis.original_file:
            default_storage.delete(analysis.original_file.name)
        if analysis.cleaned_file:
            default_storage.delete(analysis.cleaned_file.name)
        if analysis.report_html:
            default_storage.delete(analysis.report_html.name)
        if analysis.graphs_zip:
            default_storage.delete(analysis.graphs_zip.name)
        
        # Delete temp graphs directory
        temp_graphs_dir = os.path.join(settings.MEDIA_ROOT, 'temp_graphs', str(analysis.id))
        if os.path.exists(temp_graphs_dir):
            import shutil
            shutil.rmtree(temp_graphs_dir)
        
        analysis.delete()
        
        return Response({'message': 'Analysis deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def download_all_files(request, analysis_id):
    """Download all generated files as a zip"""
    try:
        analysis = get_object_or_404(DataAnalysis, id=analysis_id)
        
        # Create in-memory zip
        buffer = BytesIO()
        with zipfile.ZipFile(buffer, 'w') as zip_file:
            # Add cleaned file
            if analysis.cleaned_file and os.path.exists(analysis.cleaned_file.path):
                zip_file.write(
                    analysis.cleaned_file.path,
                    f"dataset/{os.path.basename(analysis.cleaned_file.name)}"
                )
            
            # Add HTML report
            if analysis.report_html and os.path.exists(analysis.report_html.path):
                zip_file.write(
                    analysis.report_html.path,
                    f"reports/{os.path.basename(analysis.report_html.name)}"
                )
            
            # Add graphs (if you saved a zip already or individual graph files)
            if analysis.graphs_zip and os.path.exists(analysis.graphs_zip.path):
                zip_file.write(
                    analysis.graphs_zip.path,
                    f"graphs/{os.path.basename(analysis.graphs_zip.name)}"
                )
            else:
                # Optional: include individual graph files if not zipped
                graphs = GeneratedGraph.objects.filter(analysis=analysis)
                for graph in graphs:
                    if graph.file_path and os.path.exists(graph.file_path):
                        zip_file.write(
                            graph.file_path,
                            f"graphs/{os.path.basename(graph.file_path)}"
                        )
        
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename=report.zip'
        return response

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)