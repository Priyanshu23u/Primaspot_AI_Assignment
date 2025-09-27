# influencers/serializers.py
from rest_framework import serializers
from .models import Influencer

class InfluencerSerializer(serializers.ModelSerializer):
    """
    Basic Influencer Serializer - Point 5 API Implementation
    """
    engagement_rate = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)
    avg_likes = serializers.DecimalField(max_digits=15, decimal_places=0, read_only=True)
    avg_comments = serializers.DecimalField(max_digits=15, decimal_places=0, read_only=True)
    follower_tier = serializers.CharField(read_only=True)
    
    class Meta:
        model = Influencer
        fields = [
            'id', 'username', 'full_name', 'profile_pic_url', 'bio',
            'followers_count', 'following_count', 'posts_count',
            'is_verified', 'is_private', 'is_business',
            'engagement_rate', 'avg_likes', 'avg_comments', 'follower_tier',
            'last_scraped', 'scrape_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'engagement_rate', 'avg_likes', 'avg_comments', 'follower_tier']

class InfluencerDetailSerializer(InfluencerSerializer):
    """
    Detailed Influencer Serializer with related data
    """
    recent_posts = serializers.SerializerMethodField()
    recent_reels = serializers.SerializerMethodField()
    total_posts = serializers.SerializerMethodField()
    total_reels = serializers.SerializerMethodField()
    analyzed_posts = serializers.SerializerMethodField()
    analyzed_reels = serializers.SerializerMethodField()
    
    class Meta(InfluencerSerializer.Meta):
        fields = InfluencerSerializer.Meta.fields + [
            'recent_posts', 'recent_reels', 'total_posts', 'total_reels',
            'analyzed_posts', 'analyzed_reels'
        ]
    
    def get_recent_posts(self, obj):
        """Get recent 5 posts with AI analysis data"""
        recent_posts = obj.posts.order_by('-post_date')[:5]
        return [{
            'id': post.id,
            'shortcode': post.shortcode,
            'image_url': post.image_url,
            'caption': post.caption[:100] + '...' if len(post.caption) > 100 else post.caption,
            'likes_count': post.likes_count,
            'comments_count': post.comments_count,
            'post_date': post.post_date,
            'keywords': post.keywords,
            'vibe_classification': post.vibe_classification,
            'quality_score': float(post.quality_score) if post.quality_score else 0.0,
            'is_analyzed': post.is_analyzed
        } for post in recent_posts]
    
    def get_recent_reels(self, obj):
        """Get recent 3 reels with AI analysis data"""
        recent_reels = obj.reels.order_by('-post_date')[:3]
        return [{
            'id': reel.id,
            'shortcode': reel.shortcode,
            'video_url': reel.video_url,
            'thumbnail_url': reel.thumbnail_url,
            'caption': reel.caption[:100] + '...' if len(reel.caption) > 100 else reel.caption,
            'views_count': reel.views_count,
            'likes_count': reel.likes_count,
            'comments_count': reel.comments_count,
            'post_date': reel.post_date,
            'detected_events': reel.detected_events,
            'vibe_classification': reel.vibe_classification,
            'descriptive_tags': reel.descriptive_tags,
            'is_analyzed': reel.is_analyzed
        } for reel in recent_reels]
    
    def get_total_posts(self, obj):
        return obj.posts.count()
    
    def get_total_reels(self, obj):
        return obj.reels.count()
    
    def get_analyzed_posts(self, obj):
        return obj.posts.filter(is_analyzed=True).count()
    
    def get_analyzed_reels(self, obj):
        return obj.reels.filter(is_analyzed=True).count()
