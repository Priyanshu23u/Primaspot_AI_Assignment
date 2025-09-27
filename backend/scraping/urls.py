# scraping/urls.py
from django.urls import path
from . import views

app_name = 'scraping'

urlpatterns = [
    # Trigger scraping for specific influencer - WORKING (matches TriggerScrapingView.post)
    path('trigger/<int:influencer_id>/', 
         views.TriggerScrapingView.as_view(), 
         name='trigger-scraping'),
    
    # Check scraping status for specific influencer - WORKING (matches ScrapingStatusView.get)
    path('status/<int:influencer_id>/', 
         views.ScrapingStatusView.as_view(), 
         name='scraping-status'),
]
