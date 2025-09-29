from django.urls import path
from . import views
from .advanced_views import AdvancedScrapingView, BypassStatusView

urlpatterns = [
    # Existing URLs
    path('trigger/<int:influencer_id>/', views.TriggerScrapingView.as_view(), name='trigger-scraping'),
    path('status/<int:influencer_id>/', views.ScrapingStatusView.as_view(), name='scraping-status'),
    
    # Advanced rate limit bypass URLs
    path('advanced-scraping/', AdvancedScrapingView.as_view(), name='advanced-scraping'),
    path('bypass-status/', BypassStatusView.as_view(), name='bypass-status'),
]
