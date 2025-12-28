from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('upload/', views.upload_dataset, name='upload_dataset'),
    path('analyses/', views.list_analyses, name='list_analyses'),
    path('analyses/<uuid:analysis_id>/', views.get_analysis, name='get_analysis'),
    path('analyses/<uuid:analysis_id>/insights/', views.get_analysis_insights, name='get_analysis_insights'),
    path('analyses/<uuid:analysis_id>/graphs/', views.get_analysis_graphs, name='get_analysis_graphs'),
    path("analyses/<uuid:analysis_id>/download/results/", views.download_all_files, name="download_results"),
    path('analyses/<uuid:analysis_id>/delete/', views.delete_analysis, name='delete_analysis'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)