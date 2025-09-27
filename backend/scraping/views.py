from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from influencers.models import Influencer
from .tasks import scrape_influencer_data

class TriggerScrapingView(APIView):
    """
    Manually trigger scraping for an influencer
    """
    def post(self, request, influencer_id):
        influencer = get_object_or_404(Influencer, id=influencer_id)
        
        # Trigger scraping task
        task = scrape_influencer_data.delay(influencer_id)
        
        return Response({
            'message': f'Scraping initiated for @{influencer.username}',
            'task_id': task.id
        })

class ScrapingStatusView(APIView):
    """
    Check scraping status for an influencer
    """
    def get(self, request, influencer_id):
        influencer = get_object_or_404(Influencer, id=influencer_id)
        
        return Response({
            'username': influencer.username,
            'last_scraped': influencer.last_scraped,
            'scrape_count': influencer.scrape_count,
            'is_active': influencer.is_active
        })
