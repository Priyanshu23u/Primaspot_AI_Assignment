from rest_framework import serializers
from .models import Post, PostAnalysis

class PostAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAnalysis
        exclude = ['id', 'post']

class PostSerializer(serializers.ModelSerializer):
    analysis = PostAnalysisSerializer(read_only=True)
    influencer_username = serializers.CharField(source='influencer.username', read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'post_id', 'shortcode', 'image_url', 'caption',
                 'likes_count', 'comments_count', 'post_date', 'keywords',
                 'vibe_classification', 'quality_score', 'is_analyzed',
                 'influencer_username', 'analysis']
