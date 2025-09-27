from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.InfluencerViewSet, basename='influencer')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:pk>/analytics/', views.InfluencerAnalyticsView.as_view(), name='influencer-analytics'),
]
