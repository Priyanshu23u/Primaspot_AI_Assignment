from django.contrib import admin
from .models import AudienceDemographics

@admin.register(AudienceDemographics)
class AudienceDemographicsAdmin(admin.ModelAdmin):
    list_display = ['influencer', 'male_percentage', 'female_percentage', 
                   'confidence_score', 'last_updated']
    list_filter = ['confidence_score', 'last_updated']
    search_fields = ['influencer__username']
    readonly_fields = ['created_at', 'last_updated']
    
    fieldsets = (
        ('Influencer', {
            'fields': ('influencer',)
        }),
        ('Age Distribution', {
            'fields': ('age_13_17', 'age_18_24', 'age_25_34', 'age_35_44', 
                      'age_45_54', 'age_55_plus')
        }),
        ('Gender Distribution', {
            'fields': ('male_percentage', 'female_percentage')
        }),
        ('Location Data', {
            'fields': ('top_countries', 'top_cities')
        }),
        ('Engagement Patterns', {
            'fields': ('peak_activity_hours', 'most_active_days')
        }),
        ('Metadata', {
            'fields': ('confidence_score', 'last_updated', 'created_at'),
            'classes': ('collapse',)
        })
    )
