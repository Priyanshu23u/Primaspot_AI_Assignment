# influencers/models.py
from django.db import models
from django.utils import timezone

class Influencer(models.Model):
    """
    Core Influencer Model - Stores all basic information (MANDATORY REQUIREMENTS)
    """
    # Basic Information (MANDATORY)
    username = models.CharField(max_length=100, unique=True, db_index=True)
    full_name = models.CharField(max_length=200, blank=True, null=True)
    profile_pic_url = models.URLField(max_length=500, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    
    # Follower Metrics (MANDATORY)
    followers_count = models.BigIntegerField(default=0, db_index=True)
    following_count = models.BigIntegerField(default=0)
    posts_count = models.BigIntegerField(default=0)
    
    # Verification & Status
    is_verified = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    is_business = models.BooleanField(default=False)
    
    # Engagement Analytics (MANDATORY)
    engagement_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, db_index=True)
    avg_likes = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    avg_comments = models.DecimalField(max_digits=15, decimal_places=0, default=0)
    
    # Scraping Metadata
    last_scraped = models.DateTimeField(blank=True, null=True)
    last_analyzed = models.DateTimeField(blank=True, null=True)
    scrape_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'influencers'
        ordering = ['-followers_count']
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['followers_count']),
            models.Index(fields=['engagement_rate']),
            models.Index(fields=['is_verified']),
        ]
    
    def __str__(self):
        return f"@{self.username} ({self.followers_count:,} followers)"
    
    @property
    def engagement_rate_display(self):
        return f"{self.engagement_rate}%"
    
    @property
    def follower_tier(self):
        """Categorize influencer by follower count"""
        if self.followers_count >= 1000000:
            return "Mega Influencer"
        elif self.followers_count >= 100000:
            return "Macro Influencer"
        elif self.followers_count >= 10000:
            return "Mid Influencer"
        else:
            return "Micro Influencer"
