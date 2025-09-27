# reels/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Reel
from influencers.models import Influencer

class ReelViewSet(viewsets.ViewSet):
    """
    Reel ViewSet for API - Supports all video-level data requirements
    """
    
    def list(self, request):
        """
        List all reels or reels for specific influencer
        Implements ADVANCED REQUIREMENTS: Reels/Video-Level Data
        """
        influencer_id = request.query_params.get('influencer')
        analyzed_only = request.query_params.get('analyzed_only')
        limit = int(request.query_params.get('limit', 50))
        
        if influencer_id:
            try:
                influencer = get_object_or_404(Influencer, pk=influencer_id)
                reels = influencer.reels.all()
            except:
                return Response({'error': 'Invalid influencer ID'}, status=400)
        else:
            reels = Reel.objects.all()
        
        if analyzed_only == 'true':
            reels = reels.filter(is_analyzed=True)
        
        reels = reels.order_by('-post_date')[:limit]
        
        # Build comprehensive response
        reels_data = []
        for reel in reels:
            reel_data = {
                'id': reel.id,
                'influencer_id': reel.influencer.id,
                'influencer_username': reel.influencer.username,
                'reel_id': reel.reel_id,
                'shortcode': reel.shortcode,
                'video_url': reel.video_url,
                'thumbnail_url': reel.thumbnail_url,
                'caption': reel.caption,
                'views_count': reel.views_count,
                'likes_count': reel.likes_count,
                'comments_count': reel.comments_count,
                'post_date': reel.post_date,
                'duration': reel.duration,
                'detected_events': reel.detected_events,
                'vibe_classification': reel.vibe_classification,
                'descriptive_tags': reel.descriptive_tags,
                'is_analyzed': reel.is_analyzed,
                'analysis_date': reel.analysis_date
            }
            reels_data.append(reel_data)
        
        return Response({
            'count': len(reels_data),
            'results': reels_data
        })
