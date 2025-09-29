from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from influencers.models import Influencer

class Demographics(models.Model):
    influencer = models.OneToOneField(Influencer, on_delete=models.CASCADE, related_name='demographics')
    
    # Audience Size Analysis
    total_followers_analyzed = models.IntegerField(default=0)
    confidence_score = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)]
    )
    data_points_used = models.IntegerField(default=0)
    
    # Age Distribution (percentages)
    age_13_17 = models.FloatField(default=0.0)
    age_18_24 = models.FloatField(default=0.0)
    age_25_34 = models.FloatField(default=0.0)
    age_35_44 = models.FloatField(default=0.0)
    age_45_54 = models.FloatField(default=0.0)
    age_55_plus = models.FloatField(default=0.0)
    
    # Gender Distribution (percentages)
    male_percentage = models.FloatField(default=0.0)
    female_percentage = models.FloatField(default=0.0)
    other_percentage = models.FloatField(default=0.0)
    
    # Geographic Data
    top_countries = models.JSONField(default=list, blank=True)
    top_cities = models.JSONField(default=list, blank=True)
    top_languages = models.JSONField(default=list, blank=True)
    
    # Interest Categories
    interest_categories = models.JSONField(default=list, blank=True)
    
    # Device & Platform Data
    device_distribution = models.JSONField(default=dict, blank=True)
    platform_usage = models.JSONField(default=dict, blank=True)
    
    # Activity Patterns
    peak_activity_hours = models.JSONField(default=list, blank=True)
    engagement_by_day = models.JSONField(default=dict, blank=True)
    
    # Follower Quality
    fake_followers_percentage = models.FloatField(default=0.0)
    inactive_followers_percentage = models.FloatField(default=0.0)
    high_quality_followers_percentage = models.FloatField(default=0.0)
    
    # Timestamps
    last_updated = models.DateTimeField(auto_now=True)
    next_update_scheduled = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name_plural = "Demographics"
        
    def __str__(self):
        return f"Demographics for @{self.influencer.username}"
