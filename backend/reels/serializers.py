from rest_framework import serializers
from .models import Reel, ReelAnalysis

class ReelAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReelAnalysis
        exclude = ['id', 'reel']

class ReelSerializer(serializers.ModelSerializer):
    analysis = ReelAnalysisSerializer(read_only=True)
    influencer_username = serializers.CharField(source='influencer.username', read_only=True)
    
    class Meta:
        model = Reel
        fields = ['id', 'reel_id', 'shortcode', 'thumbnail_url', 'caption',
                 'views_count', 'likes_count', 'comments_count', 'post_date',
                 'detected_events', 'vibe_classification', 'descriptive_tags',
                 'is_analyzed', 'duration', 'influencer_username', 'analysis']
