# reels/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Reel, ReelAnalysis

@admin.register(Reel)
class ReelAdmin(admin.ModelAdmin):
    list_display = [
        'shortcode', 'influencer', 'views_count', 'likes_count', 
        'vibe_classification', 'analysis_status', 'post_date'
    ]
    list_filter = ['is_analyzed', 'vibe_classification', 'post_date']
    search_fields = ['shortcode', 'caption', 'influencer__username']
    readonly_fields = ['reel_id', 'created_at', 'updated_at']
    
    def analysis_status(self, obj):
        if obj.is_analyzed:
            return format_html('<span style="color: #28a745;">✅ Analyzed</span>')
        return format_html('<span style="color: #dc3545;">❌ Pending</span>')
    analysis_status.short_description = 'AI Analysis'

@admin.register(ReelAnalysis)
class ReelAnalysisAdmin(admin.ModelAdmin):
    list_display = ['reel', 'scene_changes', 'activity_level', 'primary_subject', 'environment']
    list_filter = ['activity_level', 'environment', 'time_of_day']
    search_fields = ['reel__shortcode', 'primary_subject']
