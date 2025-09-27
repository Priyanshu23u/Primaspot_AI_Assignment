from django.db import models
from influencers.models import Influencer
import json

class Post(models.Model):
    influencer = models.ForeignKey(Influencer, on_delete=models.CASCADE, related_name='posts')
    post_id = models.CharField(max_length=100, unique=True)
    shortcode = models.CharField(max_length=50)
    
    # Post content
    image_url = models.URLField()
    image_local = models.ImageField(upload_to='post_images/', blank=True, null=True)
    caption = models.TextField(blank=True)
    
    # Engagement metrics (mandatory)
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    
    # Post metadata
    post_date = models.DateTimeField()
    is_video = models.BooleanField(default=False)
    
    # AI Analysis fields (important requirement)
    keywords = models.JSONField(default=list, blank=True)  # Auto-generated tags
    vibe_classification = models.CharField(max_length=50, blank=True)  # casual, aesthetic, luxury, energetic
    quality_score = models.DecimalField(max_digits=3, decimal_places=2, default=0)  # 0-10 scale
    
    # Analysis metadata
    is_analyzed = models.BooleanField(default=False)
    analysis_date = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-post_date']
        
    def __str__(self):
        return f"{self.influencer.username} - {self.shortcode}"
    
    def set_keywords(self, keywords_list):
        """Store keywords as JSON"""
        self.keywords = keywords_list
        
    def get_keywords(self):
        """Retrieve keywords as list"""
        return self.keywords if isinstance(self.keywords, list) else []

class PostAnalysis(models.Model):
    """Detailed analysis results for posts"""
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='analysis')
    
    # Image quality metrics
    lighting_score = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    composition_score = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    visual_appeal_score = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    
    # Detected objects/elements
    detected_objects = models.JSONField(default=list)
    dominant_colors = models.JSONField(default=list)
    
    # Content categorization
    category = models.CharField(max_length=50, blank=True)  # food, travel, fashion, etc.
    mood = models.CharField(max_length=50, blank=True)     # happy, professional, relaxed, etc.
    
    created_at = models.DateTimeField(auto_now_add=True)
