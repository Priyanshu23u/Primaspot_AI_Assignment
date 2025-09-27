# posts/models.py
from django.db import models
from django.contrib.postgres.fields import ArrayField
from influencers.models import Influencer

class Post(models.Model):
    """
    Post Model - Stores post-level data (IMPORTANT REQUIREMENTS)
    """
    # Relationships
    influencer = models.ForeignKey(Influencer, on_delete=models.CASCADE, related_name='posts')
    
    # Basic Post Data (IMPORTANT REQUIREMENTS)
    post_id = models.CharField(max_length=100, unique=True, db_index=True)
    shortcode = models.CharField(max_length=50, unique=True, db_index=True)
    image_url = models.URLField(max_length=500)
    caption = models.TextField(blank=True, null=True)
    
    # Engagement Data (IMPORTANT REQUIREMENTS)
    likes_count = models.BigIntegerField(default=0, db_index=True)
    comments_count = models.BigIntegerField(default=0, db_index=True)
    post_date = models.DateTimeField(db_index=True)
    
    # Post Metadata
    is_video = models.BooleanField(default=False)
    video_url = models.URLField(max_length=500, blank=True, null=True)
    
    # AI/ML Analysis Results (IMPORTANT REQUIREMENTS - Point 2)
    keywords = ArrayField(models.CharField(max_length=50), default=list, blank=True)
    vibe_classification = models.CharField(max_length=50, blank=True, null=True, db_index=True)
    quality_score = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    
    # Analysis Status
    is_analyzed = models.BooleanField(default=False, db_index=True)
    analysis_date = models.DateTimeField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'posts'
        ordering = ['-post_date']
        indexes = [
            models.Index(fields=['influencer', '-post_date']),
            models.Index(fields=['likes_count']),
            models.Index(fields=['vibe_classification']),
            models.Index(fields=['is_analyzed']),
        ]
    
    def __str__(self):
        return f"{self.influencer.username} - {self.shortcode}"
    
    @property
    def engagement_total(self):
        return self.likes_count + self.comments_count
    
    @property
    def engagement_rate(self):
        if self.influencer.followers_count > 0:
            return (self.engagement_total / self.influencer.followers_count) * 100
        return 0

class PostAnalysis(models.Model):
    """
    Detailed AI Analysis for Posts (IMPORTANT REQUIREMENTS - Point 2)
    """
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='analysis')
    
    # Image Quality Metrics (IMPORTANT REQUIREMENTS)
    lighting_score = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    composition_score = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    visual_appeal_score = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    
    # AI Detection Results
    detected_objects = ArrayField(models.CharField(max_length=50), default=list, blank=True)
    dominant_colors = ArrayField(models.CharField(max_length=7), default=list, blank=True)  # Hex colors
    
    # Content Classification
    category = models.CharField(max_length=50, blank=True, null=True)
    mood = models.CharField(max_length=50, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'post_analyses'
    
    def __str__(self):
        return f"Analysis for {self.post.shortcode}"
