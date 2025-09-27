# analytics/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Count, Avg, Sum
from influencers.models import Influencer
from posts.models import Post
from reels.models import Reel
from demographics.models import AudienceDemographics

class AnalyticsOverviewAPIView(APIView):
    """
    Platform-wide analytics overview
    """
    
    def get(self, request):
        """Get platform analytics overview"""
        
        # Platform statistics
        platform_stats = {
            'total_influencers': Influencer.objects.count(),
            'verified_influencers': Influencer.objects.filter(is_verified=True).count(),
            'total_posts': Post.objects.count(),
            'total_reels': Reel.objects.count(),
            'analyzed_posts': Post.objects.filter(is_analyzed=True).count(),
            'analyzed_reels': Reel.objects.filter(is_analyzed=True).count(),
            'demographics_available': AudienceDemographics.objects.count()
        }
        
        # Average metrics
        avg_metrics = {
            'avg_followers': Influencer.objects.aggregate(Avg('followers_count'))['followers_count__avg'] or 0,
            'avg_engagement_rate': Influencer.objects.aggregate(Avg('engagement_rate'))['engagement_rate__avg'] or 0,
            'avg_posts_per_influencer': round(platform_stats['total_posts'] / platform_stats['total_influencers'], 2) if platform_stats['total_influencers'] > 0 else 0,
            'avg_reels_per_influencer': round(platform_stats['total_reels'] / platform_stats['total_influencers'], 2) if platform_stats['total_influencers'] > 0 else 0
        }
        
        # Analysis coverage
        analysis_coverage = {
            'posts_analysis_percentage': round((platform_stats['analyzed_posts'] / platform_stats['total_posts']) * 100, 2) if platform_stats['total_posts'] > 0 else 0,
            'reels_analysis_percentage': round((platform_stats['analyzed_reels'] / platform_stats['total_reels']) * 100, 2) if platform_stats['total_reels'] > 0 else 0,
            'demographics_coverage': round((platform_stats['demographics_available'] / platform_stats['total_influencers']) * 100, 2) if platform_stats['total_influencers'] > 0 else 0
        }
        
        return Response({
            'platform_statistics': platform_stats,
            'average_metrics': avg_metrics,
            'analysis_coverage': analysis_coverage,
            'generated_at': timezone.now().isoformat()
        })

class EngagementTrendsAPIView(APIView):
    """Engagement trends analysis"""
    
    def get(self, request):
        return Response({
            'message': 'Engagement trends analysis available',
            'note': 'Implement time-series analysis based on requirements'
        })

class ContentInsightsAPIView(APIView):
    """Content insights and recommendations"""
    
    def get(self, request):
        return Response({
            'message': 'Content insights analysis available', 
            'note': 'Implement AI-powered insights based on requirements'
        })
