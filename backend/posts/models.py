from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from influencers.models import Influencer

class Post(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('photo', 'Photo'),
        ('video', 'Video'),
        ('carousel', 'Carousel'),
        ('reel', 'Reel'),
    ]
    
    VIBE_CHOICES = [
        ('aesthetic', 'Aesthetic'),
        ('casual', 'Casual'),
        ('professional', 'Professional'),
        ('energetic', 'Energetic'),
        ('luxury', 'Luxury'),
    ]
    
    # Basic Information
    shortcode = models.CharField(max_length=20, unique=True, db_index=True, default='')
    influencer = models.ForeignKey(Influencer, on_delete=models.CASCADE, related_name='posts')
    
    # Content
    caption = models.TextField(blank=True, default='')
    media_type = models.CharField(max_length=20, choices=MEDIA_TYPE_CHOICES, default='photo')
    media_url = models.URLField(blank=True, default='')
    thumbnail_url = models.URLField(blank=True, default='')
    
    # Engagement Metrics
    likes_count = models.IntegerField(default=0)
    comments_count = models.IntegerField(default=0)
    shares_count = models.IntegerField(default=0)
    saves_count = models.IntegerField(default=0)
    views_count = models.IntegerField(null=True, blank=True)
    
    # Timestamps
    posted_at = models.DateTimeField(default=timezone.now, db_index=True)
    scraped_at = models.DateTimeField(auto_now_add=True)
    
    # ML Analysis
    is_analyzed = models.BooleanField(default=False)
    analysis_status = models.CharField(max_length=20, default='pending')
    
    # Content Analysis Results
    quality_score = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)]
    )
    vibe_classification = models.CharField(max_length=20, choices=VIBE_CHOICES, blank=True, default='casual')
    sentiment_score = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(-1.0), MaxValueValidator(1.0)]
    )
    
    # Visual Analysis
    dominant_colors = models.JSONField(default=list, blank=True)
    detected_objects = models.JSONField(default=list, blank=True)
    face_count = models.IntegerField(default=0)
    text_overlay_detected = models.BooleanField(default=False)
    
    # Content Tags
    hashtags = models.JSONField(default=list, blank=True)
    mentions = models.JSONField(default=list, blank=True)
    auto_tags = models.JSONField(default=list, blank=True)
    
    # Location
    location = models.CharField(max_length=200, blank=True, default='')
    location_coords = models.JSONField(default=dict, blank=True)
    
    @property
    def engagement_rate(self):
        if self.influencer.followers_count > 0:
            total_engagement = self.likes_count + self.comments_count
            return (total_engagement / self.influencer.followers_count) * 100
        return 0
    
    class Meta:
        ordering = ['-posted_at']
        
    def __str__(self):
        return f"{self.influencer.username} - {self.shortcode}"