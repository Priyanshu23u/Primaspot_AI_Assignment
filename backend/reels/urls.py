# reels/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSet
router = DefaultRouter()
router.register(r'reels', views.ReelViewSet, basename='reel')

app_name = 'reels'

urlpatterns = [
    # ViewSet URLs - WORKING
    path('', include(router.urls)),
]
