from django.db import models
from influencers.models import Influencer

class AudienceDemographics(models.Model):
    """Bonus feature - Inferred audience demographics"""
    influencer = models.OneToOneField(Influencer, on_delete=models.CASCADE, related_name='demographics')
    
    # Age distribution (percentages)
    age_13_17 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    age_18_24 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    age_25_34 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    age_35_44 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    age_45_54 = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    age_55_plus = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Gender distribution
    male_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    female_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Top locations (JSON array)
    top_countries = models.JSONField(default=list)
    top_cities = models.JSONField(default=list)
    
    # Engagement patterns
    peak_activity_hours = models.JSONField(default=list)
    most_active_days = models.JSONField(default=list)
    
    # Analysis confidence and date
    confidence_score = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Demographics for @{self.influencer.username}"
