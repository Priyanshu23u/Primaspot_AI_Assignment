from django.contrib import admin
from .models import Demographics

@admin.register(Demographics)
class DemographicsAdmin(admin.ModelAdmin):
    list_display = [
        'influencer', 'total_followers_analyzed', 'confidence_score', 
        'male_percentage', 'female_percentage', 'last_updated'
    ]
    list_filter = ['last_updated', 'confidence_score']
    search_fields = ['influencer__username']
    readonly_fields = ['last_updated']
    
    fieldsets = (
        ('Overview', {
            'fields': ('influencer', 'total_followers_analyzed', 'confidence_score', 'data_points_used')
        }),
        ('Age Distribution', {
            'fields': ('age_13_17', 'age_18_24', 'age_25_34', 'age_35_44', 'age_45_54', 'age_55_plus')
        }),
        ('Gender Distribution', {
            'fields': ('male_percentage', 'female_percentage', 'other_percentage')
        }),
        ('Geographic & Interest Data', {
            'fields': ('top_countries', 'top_cities', 'top_languages', 'interest_categories'),
            'classes': ('collapse',)
        }),
        ('Activity Patterns', {
            'fields': ('peak_activity_hours', 'engagement_by_day', 'device_distribution'),
            'classes': ('collapse',)
        }),
        ('Quality Metrics', {
            'fields': ('fake_followers_percentage', 'inactive_followers_percentage', 'high_quality_followers_percentage'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('last_updated', 'next_update_scheduled')
        }),
    )
