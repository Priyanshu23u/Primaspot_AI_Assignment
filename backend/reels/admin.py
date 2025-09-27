from django.contrib import admin
from .models import Reel, ReelAnalysis

class ReelAnalysisInline(admin.StackedInline):
    model = ReelAnalysis
    extra = 0
    readonly_fields = ['created_at']

@admin.register(Reel)
class ReelAdmin(admin.ModelAdmin):
    list_display = ['shortcode', 'influencer', 'views_count', 'likes_count', 
                   'comments_count', 'vibe_classification', 'is_analyzed', 'post_date']
    list_filter = ['is_analyzed', 'vibe_classification', 'post_date', 'influencer']
    search_fields = ['shortcode', 'caption', 'influencer__username']
    readonly_fields = ['reel_id', 'created_at', 'updated_at', 'analysis_date']
    ordering = ['-post_date']
    
    inlines = [ReelAnalysisInline]
    
    fieldsets = (
        ('Reel Information', {
            'fields': ('influencer', 'reel_id', 'shortcode', 'post_date', 'duration')
        }),
        ('Content', {
            'fields': ('video_url', 'thumbnail_url', 'thumbnail_local', 'caption')
        }),
        ('Engagement', {
            'fields': ('views_count', 'likes_count', 'comments_count')
        }),
        ('AI Analysis', {
            'fields': ('detected_events', 'vibe_classification', 'descriptive_tags', 
                      'is_analyzed', 'analysis_date'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

@admin.register(ReelAnalysis)
class ReelAnalysisAdmin(admin.ModelAdmin):
    list_display = ['reel', 'primary_subject', 'environment', 'time_of_day', 
                   'activity_level', 'created_at']
    list_filter = ['environment', 'time_of_day', 'activity_level', 'created_at']
    search_fields = ['reel__shortcode', 'reel__influencer__username', 'primary_subject']
    readonly_fields = ['created_at']
