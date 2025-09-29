from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from influencers.models import Influencer

class Reel(models.Model):
    VIBE_CHOICES = [
        ('energetic', 'Energetic'),
        ('aesthetic', 'Aesthetic'),
        ('educational', 'Educational'),
        ('entertaining', 'Entertaining'),
        ('promotional', 'Promotional'),
    ]
    
    # Basic Information
    shortcode = models.CharField(max_length=20, unique=True, db_index=True)
    influencer = models.ForeignKey(Influencer, on_delete=models.CASCADE, related_name='reels')
    
    # Content
    caption = models.TextField(blank=True)
    media_url = models.URLField(blank=True)
    thumbnail_url = models.URLField(blank=True)
    duration = models.FloatField(default=0.0)
    
    # Engagement Metrics
    views_count = models.IntegerField(default=0)
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    shares_count = models.IntegerField(default=0)
    saves_count = models.IntegerField(default=0)
    play_count = models.IntegerField(default=0)
    
    # Timestamps
    posted_at = models.DateTimeField(db_index=True)
    scraped_at = models.DateTimeField(auto_now_add=True)
    
    # ML Analysis
    is_analyzed = models.BooleanField(default=False)
    vibe_classification = models.CharField(max_length=20, choices=VIBE_CHOICES, blank=True)
    
    # Audio Analysis
    audio_name = models.CharField(max_length=200, blank=True)
    audio_artist = models.CharField(max_length=200, blank=True)
    audio_duration = models.FloatField(default=0.0)
    audio_is_original = models.BooleanField(default=False)
    
    # Video Analysis
    scene_changes = models.IntegerField(default=0)
    activity_level = models.FloatField(default=0.0)
    face_time_percentage = models.FloatField(default=0.0)
    has_captions = models.BooleanField(default=False)
    is_branded_content = models.BooleanField(default=False)
    
    # Content Tags
    hashtags = models.JSONField(default=list, blank=True)
    mentions = models.JSONField(default=list, blank=True)
    effects_used = models.JSONField(default=list, blank=True)
    
    @property
    def engagement_rate(self):
        if self.views_count > 0:
            total_engagement = self.likes_count + self.comments_count + self.shares_count
            return (total_engagement / self.views_count) * 100
        return 0
    
    class Meta:
        ordering = ['-posted_at']
        
    def __str__(self):
        return f"{self.influencer.username} - Reel {self.shortcode}"
