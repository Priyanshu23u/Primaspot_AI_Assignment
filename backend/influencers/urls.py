# influencers/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for InfluencerViewSet
router = DefaultRouter()
router.register(r'', views.InfluencerViewSet, basename='influencer')

app_name = 'influencers'

urlpatterns = [
    # ViewSet URLs - WORKING (matches your InfluencerViewSet)
    # This provides:
    # GET /api/v1/influencers/ -> list()
    # GET /api/v1/influencers/{id}/ -> retrieve()  
    # GET /api/v1/influencers/search/ -> search() [@action]
    path('', include(router.urls)),
    
    # Custom API Views - WORKING (matches your implemented APIViews)
    path('<int:influencer_id>/analytics/', 
         views.InfluencerAnalyticsAPIView.as_view(), 
         name='influencer-analytics'),
         
    path('<int:influencer_id>/posts/', 
         views.InfluencerPostsAPIView.as_view(), 
         name='influencer-posts'),
         
    path('<int:influencer_id>/reels/', 
         views.InfluencerReelsAPIView.as_view(), 
         name='influencer-reels'),
         
    path('<int:influencer_id>/demographics/', 
         views.InfluencerDemographicsAPIView.as_view(), 
         name='influencer-demographics'),
    
    # Health Check - WORKING (matches your APIHealthView)
    path('health/', 
         views.APIHealthView.as_view(), 
         name='api-health'),
]
