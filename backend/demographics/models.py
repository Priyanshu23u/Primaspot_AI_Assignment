# demographics/models.py
from django.db import models
from django.contrib.postgres.fields import ArrayField
from influencers.models import Influencer

class AudienceDemographics(models.Model):
    """
    Audience Demographics Model (BONUS FEATURE)
    AI-inferred audience demographics based on content analysis
    """
    # Relationships
    influencer = models.OneToOneField(Influencer, on_delete=models.CASCADE, related_name='demographics')
    
    # Age Distribution (BONUS FEATURE)
    age_13_17 = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    age_18_24 = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    age_25_34 = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    age_35_44 = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    age_45_54 = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    age_55_plus = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    # Gender Distribution (BONUS FEATURE)
    male_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    female_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    
    # Geographic Distribution (BONUS FEATURE)
    top_countries = ArrayField(models.CharField(max_length=50), default=list, blank=True)
    top_cities = ArrayField(models.CharField(max_length=50), default=list, blank=True)
    
    # Activity Patterns (BONUS FEATURE)
    peak_activity_hours = ArrayField(models.IntegerField(), default=list, blank=True)
    most_active_days = ArrayField(models.CharField(max_length=10), default=list, blank=True)
    
    # Inference Metadata
    confidence_score = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    inference_date = models.DateTimeField(auto_now=True)
    data_points_used = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'audience_demographics'
        verbose_name_plural = 'Audience Demographics'
    
    def __str__(self):
        return f"Demographics for @{self.influencer.username}"
    
    @property
    def dominant_age_group(self):
        """Get the age group with highest percentage"""
        age_groups = {
            '13-17': self.age_13_17,
            '18-24': self.age_18_24,
            '25-34': self.age_25_34,
            '35-44': self.age_35_44,
            '45-54': self.age_45_54,
            '55+': self.age_55_plus
        }
        return max(age_groups, key=age_groups.get)
    
    @property
    def dominant_gender(self):
        """Get the dominant gender"""
        return 'Male' if self.male_percentage > self.female_percentage else 'Female'
