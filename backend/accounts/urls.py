from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='custom-signup'),
    path('login/', views.login_view, name='custom-login'),
]
