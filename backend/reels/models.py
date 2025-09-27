# reels/models.py
from django.db import models
from django.contrib.postgres.fields import ArrayField
from influencers.models import Influencer

class Reel(models.Model):
    """
    Reel Model - Stores video-level data (ADVANCED REQUIREMENTS)
    """
    # Relationships
    influencer = models.ForeignKey(Influencer, on_delete=models.CASCADE, related_name='reels')
    
    # Basic Reel Data (ADVANCED REQUIREMENTS)
    reel_id = models.CharField(max_length=100, unique=True, db_index=True)
    shortcode = models.CharField(max_length=50, unique=True, db_index=True)
    video_url = models.URLField(max_length=500)
    thumbnail_url = models.URLField(max_length=500, blank=True, null=True)
    caption = models.TextField(blank=True, null=True)
    
    # Engagement Data (ADVANCED REQUIREMENTS)
    views_count = models.BigIntegerField(default=0, db_index=True)
    likes_count = models.BigIntegerField(default=0, db_index=True)
    comments_count = models.BigIntegerField(default=0, db_index=True)
    post_date = models.DateTimeField(db_index=True)
    
    # Video Metadata
    duration = models.IntegerField(default=0)  # Duration in seconds
    
    # AI/ML Video Analysis Results (ADVANCED REQUIREMENTS - Point 2)
    detected_events = models.TextField(default='[]', blank=True, help_text="JSON list of detected events")
    vibe_classification = models.CharField(max_length=50, blank=True, null=True, db_index=True)
    descriptive_tags = models.TextField(default='[]', blank=True, help_text="JSON list of descriptive tags")
    
    # Analysis Status
    is_analyzed = models.BooleanField(default=False, db_index=True)
    analysis_date = models.DateTimeField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reels'
        ordering = ['-post_date']
        indexes = [
            models.Index(fields=['influencer', '-post_date']),
            models.Index(fields=['views_count']),
            models.Index(fields=['vibe_classification']),
            models.Index(fields=['is_analyzed']),
        ]
    
    def __str__(self):
        return f"{self.influencer.username} - Reel {self.shortcode}"
    
    @property
    def engagement_total(self):
        return self.likes_count + self.comments_count
    
    @property
    def view_to_like_ratio(self):
        if self.views_count > 0:
            return (self.likes_count / self.views_count) * 100
        return 0

class ReelAnalysis(models.Model):
    """
    Detailed AI Analysis for Reels (ADVANCED REQUIREMENTS - Point 2)
    """
    reel = models.OneToOneField(Reel, on_delete=models.CASCADE, related_name='analysis')
    
    # Video Analysis Metrics (ADVANCED REQUIREMENTS)
    scene_changes = models.IntegerField(default=0)
    activity_level = models.CharField(max_length=20, default='medium')  # low, medium, high
    audio_detected = models.BooleanField(default=False)
    
    # Content Analysis
    primary_subject = models.CharField(max_length=50, blank=True, null=True)
    environment = models.CharField(max_length=50, blank=True, null=True)  # indoor, outdoor
    time_of_day = models.CharField(max_length=20, blank=True, null=True)  # day, night, sunset
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reel_analyses'
    
    def __str__(self):
        return f"Analysis for {self.reel.shortcode}"
