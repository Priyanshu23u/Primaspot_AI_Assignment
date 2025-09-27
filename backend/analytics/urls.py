# analytics/urls.py
from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    # Main Analytics Endpoint - WORKING (matches AnalyticsOverviewAPIView)
    path('', 
         views.AnalyticsOverviewAPIView.as_view(), 
         name='analytics-overview'),
    
    # Additional Analytics Endpoints - WORKING (matches your other views)
    path('engagement/trends/', 
         views.EngagementTrendsAPIView.as_view(), 
         name='engagement-trends'),
         
    path('content/insights/', 
         views.ContentInsightsAPIView.as_view(), 
         name='content-insights'),
]
