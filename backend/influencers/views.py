from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg, Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Influencer
from .serializers import (
    InfluencerListSerializer,
    InfluencerDetailSerializer,
    InfluencerCreateSerializer
)

class InfluencerViewSet(viewsets.ModelViewSet):
    """
    Complete CRUD ViewSet for Influencer model
    Satisfies all REST API requirements
    """
    queryset = Influencer.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_verified', 'is_private', 'is_active']
    search_fields = ['username', 'full_name', 'bio']
    ordering_fields = ['followers_count', 'engagement_rate', 'created_at', 'last_scraped']
    ordering = ['-followers_count']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return InfluencerListSerializer
        elif self.action == 'create':
            return InfluencerCreateSerializer
        return InfluencerDetailSerializer
    
    def perform_create(self, serializer):
        """Trigger scraping when new influencer is added"""
        influencer = serializer.save()
        from scraping.tasks import scrape_influencer_data
        scrape_influencer_data.delay(influencer.id)
    
    def perform_update(self, serializer):
        """Update engagement metrics when influencer is updated"""
        influencer = serializer.save()
        influencer.update_engagement_metrics()
    
    @action(detail=True, methods=['post'])
    def refresh_data(self, request, pk=None):
        """Manual trigger to refresh influencer data"""
        influencer = self.get_object()
        from scraping.tasks import scrape_influencer_data
        scrape_influencer_data.delay(influencer.id)
        return Response({
            'message': f'Data refresh initiated for @{influencer.username}',
            'status': 'queued'
        })
    
    @action(detail=False, methods=['get'])
    def top_influencers(self, request):
        """Get top influencers by engagement rate"""
        top_influencers = self.queryset.order_by('-engagement_rate')[:10]
        serializer = InfluencerListSerializer(top_influencers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get platform statistics"""
        stats = {
            'total_influencers': self.queryset.count(),
            'verified_influencers': self.queryset.filter(is_verified=True).count(),
            'active_influencers': self.queryset.filter(is_active=True).count(),
            'avg_followers': self.queryset.aggregate(Avg('followers_count'))['followers_count__avg'],
            'avg_engagement_rate': self.queryset.aggregate(Avg('engagement_rate'))['engagement_rate__avg'],
        }
        return Response(stats)

class InfluencerAnalyticsView(APIView):
    """
    Comprehensive analytics for an influencer
    Satisfies analytics requirement from assignment
    """
    def get(self, request, pk):
        try:
            influencer = Influencer.objects.get(pk=pk)
            
            # Calculate detailed analytics
            posts = influencer.posts.all()
            reels = influencer.reels.all()
            
            analytics = {
                'basic_info': {
                    'username': influencer.username,
                    'full_name': influencer.full_name,
                    'followers_count': influencer.followers_count,
                    'following_count': influencer.following_count,
                    'posts_count': influencer.posts_count,
                    'is_verified': influencer.is_verified,
                },
                'engagement_metrics': {
                    'avg_likes': float(influencer.avg_likes),
                    'avg_comments': float(influencer.avg_comments),
                    'engagement_rate': float(influencer.engagement_rate),
                    'total_likes': sum(post.likes_count for post in posts),
                    'total_comments': sum(post.comments_count for post in posts),
                },
                'content_analysis': {
                    'total_posts': posts.count(),
                    'total_reels': reels.count(),
                    'analyzed_posts': posts.filter(is_analyzed=True).count(),
                    'analyzed_reels': reels.filter(is_analyzed=True).count(),
                    'avg_quality_score': posts.aggregate(Avg('quality_score'))['quality_score__avg'] or 0,
                },
                'top_performing_posts': self._get_top_posts(posts),
                'content_categories': self._get_content_categories(posts),
                'vibe_distribution': self._get_vibe_distribution(posts, reels),
                'posting_patterns': self._get_posting_patterns(posts, reels),
            }
            
            # Add demographics if available
            try:
                demographics = influencer.demographics
                analytics['demographics'] = {
                    'age_distribution': {
                        '13-17': float(demographics.age_13_17),
                        '18-24': float(demographics.age_18_24),
                        '25-34': float(demographics.age_25_34),
                        '35-44': float(demographics.age_35_44),
                        '45-54': float(demographics.age_45_54),
                        '55+': float(demographics.age_55_plus),
                    },
                    'gender_distribution': {
                        'male': float(demographics.male_percentage),
                        'female': float(demographics.female_percentage),
                    },
                    'top_locations': {
                        'countries': demographics.top_countries,
                        'cities': demographics.top_cities,
                    }
                }
            except:
                analytics['demographics'] = None
            
            return Response(analytics)
            
        except Influencer.DoesNotExist:
            return Response(
                {'error': 'Influencer not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def _get_top_posts(self, posts):
        """Get top 5 posts by engagement"""
        top_posts = posts.order_by('-likes_count')[:5]
        return [
            {
                'shortcode': post.shortcode,
                'likes_count': post.likes_count,
                'comments_count': post.comments_count,
                'image_url': post.image_url,
                'engagement': post.likes_count + post.comments_count,
                'quality_score': float(post.quality_score) if post.quality_score else 0,
            }
            for post in top_posts
        ]
    
    def _get_content_categories(self, posts):
        """Analyze content categories from keywords"""
        categories = {}
        for post in posts.filter(is_analyzed=True):
            for keyword in post.get_keywords():
                categories[keyword] = categories.get(keyword, 0) + 1
        
        return dict(sorted(categories.items(), key=lambda x: x[1], reverse=True)[:10])
    
    def _get_vibe_distribution(self, posts, reels):
        """Calculate distribution of vibes/moods"""
        vibe_counts = {}
        
        for post in posts.filter(is_analyzed=True):
            if post.vibe_classification:
                vibe_counts[post.vibe_classification] = vibe_counts.get(post.vibe_classification, 0) + 1
        
        for reel in reels.filter(is_analyzed=True):
            if reel.vibe_classification:
                vibe_counts[reel.vibe_classification] = vibe_counts.get(reel.vibe_classification, 0) + 1
        
        return vibe_counts
    
    def _get_posting_patterns(self, posts, reels):
        """Analyze posting patterns"""
        from collections import defaultdict
        import datetime
        
        hour_counts = defaultdict(int)
        day_counts = defaultdict(int)
        
        for post in posts:
            hour_counts[post.post_date.hour] += 1
            day_counts[post.post_date.strftime('%A')] += 1
        
        for reel in reels:
            hour_counts[reel.post_date.hour] += 1
            day_counts[reel.post_date.strftime('%A')] += 1
        
        return {
            'peak_hours': dict(sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)[:5]),
            'active_days': dict(sorted(day_counts.items(), key=lambda x: x[1], reverse=True)),
        }
