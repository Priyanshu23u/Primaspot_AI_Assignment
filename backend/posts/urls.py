# posts/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSet
router = DefaultRouter()
router.register(r'posts', views.PostViewSet, basename='post')

app_name = 'posts'

urlpatterns = [
    # ViewSet URLs - WORKING
    path('', include(router.urls)),
]
