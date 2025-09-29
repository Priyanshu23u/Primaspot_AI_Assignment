from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import json

class Influencer(models.Model):
    CATEGORY_CHOICES = [
        ('fitness', 'Fitness & Health'),
        ('technology', 'Technology'),
        ('travel', 'Travel & Adventure'),
        ('food', 'Food & Cooking'),
        ('fashion', 'Fashion & Style'),
        ('lifestyle', 'Lifestyle'),
        ('business', 'Business'),
        ('entertainment', 'Entertainment'),
    ]
    
    # Basic Information
    username = models.CharField(max_length=100, unique=True, db_index=True)
    full_name = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    profile_pic_url = models.URLField(blank=True)
    external_url = models.URLField(blank=True)
    
    # Metrics
    followers_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)
    posts_count = models.IntegerField(default=0)
    
    # Status
    is_verified = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    is_business = models.BooleanField(default=False)
    
    # Classification
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='lifestyle')
    
    # Calculated Metrics
    engagement_rate = models.FloatField(
        default=0.0, 
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    avg_likes = models.IntegerField(default=0)
    avg_comments = models.IntegerField(default=0)
    avg_views = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_scraped = models.DateTimeField(null=True, blank=True)
    
    # ML Analysis Results
    content_themes = models.JSONField(default=dict, blank=True)
    posting_patterns = models.JSONField(default=dict, blank=True)
    audience_insights = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-followers_count']
        
    def __str__(self):
        return f"@{self.username}"
    
    @property
    def engagement_score(self):
        if self.followers_count > 0:
            return ((self.avg_likes + self.avg_comments) / self.followers_count) * 100
        return 0
