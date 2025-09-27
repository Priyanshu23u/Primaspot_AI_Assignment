from django.db import models
from django.utils import timezone
import json

class Influencer(models.Model):
    username = models.CharField(max_length=100, unique=True)
    full_name = models.CharField(max_length=200, blank=True)
    profile_pic_url = models.URLField(blank=True)
    profile_pic_local = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    
    # Basic counts (mandatory)
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    posts_count = models.PositiveIntegerField(default=0)
    
    # Engagement metrics (mandatory)
    avg_likes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    avg_comments = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    engagement_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Bio and additional info
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    is_verified = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    
    # Scraping metadata
    last_scraped = models.DateTimeField(null=True, blank=True)
    scrape_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-followers_count']
        
    def __str__(self):
        return f"@{self.username} ({self.followers_count} followers)"
    
    # Add this method to your Influencer model
    def update_engagement_metrics(self):
        """Calculate and update engagement metrics from posts"""
        posts = self.posts.all()
        if posts.exists():
            total_posts = posts.count()
            total_likes = sum(post.likes_count for post in posts)
            total_comments = sum(post.comments_count for post in posts)
            
            self.avg_likes = total_likes / total_posts
            self.avg_comments = total_comments / total_posts
            
            # Engagement rate = (avg_likes + avg_comments) / followers * 100
            if self.followers_count > 0:
                self.engagement_rate = ((self.avg_likes + self.avg_comments) / self.followers_count) * 100
            else:
                self.engagement_rate = 0
            
            self.save()


