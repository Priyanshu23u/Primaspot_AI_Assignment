from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'reels', views.ReelViewSet, basename='reel')
router.register(r'analysis', views.ReelAnalysisViewSet, basename='reel-analysis')

urlpatterns = [
    path('', include(router.urls)),
]
