from django.db import models
from influencers.models import Influencer

class Reel(models.Model):
    influencer = models.ForeignKey(Influencer, on_delete=models.CASCADE, related_name='reels')
    reel_id = models.CharField(max_length=100, unique=True)
    shortcode = models.CharField(max_length=50)
    
    # Reel content
    video_url = models.URLField()
    thumbnail_url = models.URLField()
    thumbnail_local = models.ImageField(upload_to='reel_thumbnails/', blank=True, null=True)
    caption = models.TextField(blank=True)
    
    # Engagement metrics (advanced requirement)
    views_count = models.PositiveIntegerField(default=0)
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    
    # Video metadata
    post_date = models.DateTimeField()
    duration = models.PositiveIntegerField(default=0)  # seconds
    
    # AI Analysis fields (advanced requirement)
    detected_events = models.JSONField(default=list)  # person dancing, beach, car
    vibe_classification = models.CharField(max_length=50, blank=True)  # party, travel luxury, casual daily life
    descriptive_tags = models.JSONField(default=list)  # outdoor, nightlife, food review
    
    # Analysis metadata
    is_analyzed = models.BooleanField(default=False)
    analysis_date = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-post_date']
        
    def __str__(self):
        return f"{self.influencer.username} - Reel {self.shortcode}"

class ReelAnalysis(models.Model):
    """Detailed analysis results for reels"""
    reel = models.OneToOneField(Reel, on_delete=models.CASCADE, related_name='analysis')
    
    # Video analysis
    scene_changes = models.PositiveIntegerField(default=0)
    activity_level = models.CharField(max_length=20, default='medium')  # low, medium, high
    audio_detected = models.BooleanField(default=False)
    
    # Content analysis
    primary_subject = models.CharField(max_length=100, blank=True)
    environment = models.CharField(max_length=50, blank=True)  # indoor, outdoor, studio
    time_of_day = models.CharField(max_length=20, blank=True)  # day, night, golden hour
    
    created_at = models.DateTimeField(auto_now_add=True)
