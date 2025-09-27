from django.urls import path
from . import views

urlpatterns = [
    path('trigger/<int:influencer_id>/', views.TriggerScrapingView.as_view(), name='trigger-scraping'),
    path('status/<int:influencer_id>/', views.ScrapingStatusView.as_view(), name='scraping-status'),
]
