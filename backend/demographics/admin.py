# demographics/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import AudienceDemographics

@admin.register(AudienceDemographics)
class AudienceDemographicsAdmin(admin.ModelAdmin):
    list_display = [
        'influencer', 'dominant_age_group', 'dominant_gender', 
        'confidence_score', 'inference_date'
    ]
    list_filter = ['confidence_score', 'inference_date']
    search_fields = ['influencer__username', 'top_countries', 'top_cities']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Influencer', {
            'fields': ('influencer',)
        }),
        ('Age Distribution', {
            'fields': ('age_13_17', 'age_18_24', 'age_25_34', 'age_35_44', 'age_45_54', 'age_55_plus')
        }),
        ('Gender Distribution', {
            'fields': ('male_percentage', 'female_percentage')
        }),
        ('Geographic Data', {
            'fields': ('top_countries', 'top_cities')
        }),
        ('Activity Patterns', {
            'fields': ('peak_activity_hours', 'most_active_days')
        }),
        ('Inference Metadata', {
            'fields': ('confidence_score', 'inference_date', 'data_points_used')
        })
    )
