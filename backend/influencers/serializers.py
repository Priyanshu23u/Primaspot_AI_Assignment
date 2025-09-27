from rest_framework import serializers
from .models import Influencer
from posts.models import Post
from reels.models import Reel
from demographics.models import AudienceDemographics

class InfluencerListSerializer(serializers.ModelSerializer):
    """Serializer for influencer list view"""
    class Meta:
        model = Influencer
        fields = ['id', 'username', 'full_name', 'profile_pic_url', 
                 'followers_count', 'following_count', 'posts_count',
                 'engagement_rate', 'is_verified']

class InfluencerDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for influencer with related data"""
    recent_posts = serializers.SerializerMethodField()
    recent_reels = serializers.SerializerMethodField()
    demographics = serializers.SerializerMethodField()
    
    class Meta:
        model = Influencer
        fields = '__all__'
    
    def get_recent_posts(self, obj):
        from posts.serializers import PostSerializer
        recent_posts = obj.posts.all()[:10]
        return PostSerializer(recent_posts, many=True).data
    
    def get_recent_reels(self, obj):
        from reels.serializers import ReelSerializer
        recent_reels = obj.reels.all()[:5]
        return ReelSerializer(recent_reels, many=True).data
    
    def get_demographics(self, obj):
        try:
            from demographics.serializers import AudienceDemographicsSerializer
            return AudienceDemographicsSerializer(obj.demographics).data
        except:
            return None


class InfluencerCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new influencer with validation"""
    class Meta:
        model = Influencer
        fields = ['username']
    
    def validate_username(self, value):
        """Validate Instagram username format"""
        if not value.replace('_', '').replace('.', '').isalnum():
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, underscores, and periods"
            )
        if len(value) > 30:
            raise serializers.ValidationError("Username cannot exceed 30 characters")
        return value
    
    def create(self, validated_data):
        # Trigger scraping task after creation
        influencer = Influencer.objects.create(**validated_data)
        from scraping.tasks import scrape_influencer_data
        scrape_influencer_data.delay(influencer.id)
        return influencer

