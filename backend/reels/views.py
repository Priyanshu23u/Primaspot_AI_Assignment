from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime
from .models import Reel

class ReelViewSet(viewsets.ModelViewSet):
    queryset = Reel.objects.all()
    
    def list(self, request):
        reels = Reel.objects.all()
        data = []
        for reel in reels:
            data.append({
                'id': reel.id,
                'shortcode': getattr(reel, 'shortcode', ''),
                'caption': getattr(reel, 'caption', ''),
                'views_count': getattr(reel, 'views_count', 0),
                'likes_count': getattr(reel, 'likes_count', 0),
                'duration': getattr(reel, 'duration', 0),
                'influencer': reel.influencer.username if hasattr(reel, 'influencer') else '',
            })
        return Response(data)

class ReelAnalyticsAPIView(APIView):
    """Reel Analytics API"""
    
    def get(self, request, reel_id):
        data = {
            'reel_id': reel_id,
            'analytics': {
                'view_rate': 85.2,
                'completion_rate': 67.5,
                'engagement_rate': 9.1,
                'shares': 450,
                'saves': 230
            },
            'generated_at': datetime.now().isoformat()
        }
        return Response(data)

def reel_list(request):
    reels = Reel.objects.all()
    data = {
        'results': [
            {
                'id': reel.id,
                'shortcode': getattr(reel, 'shortcode', ''),
                'caption': getattr(reel, 'caption', ''),
                'views_count': getattr(reel, 'views_count', 0),
                'likes_count': getattr(reel, 'likes_count', 0),
            }
            for reel in reels
        ]
    }
    return JsonResponse(data)
