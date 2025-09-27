# posts/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Post, PostAnalysis

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = [
        'shortcode', 'influencer', 'likes_count', 'comments_count', 
        'vibe_classification', 'quality_score', 'analysis_status', 'post_date'
    ]
    list_filter = ['is_analyzed', 'vibe_classification', 'is_video', 'post_date']
    search_fields = ['shortcode', 'caption', 'influencer__username']
    readonly_fields = ['post_id', 'created_at', 'updated_at']
    
    def analysis_status(self, obj):
        if obj.is_analyzed:
            return format_html('<span style="color: #28a745;">✅ Analyzed</span>')
        return format_html('<span style="color: #dc3545;">❌ Pending</span>')
    analysis_status.short_description = 'AI Analysis'

@admin.register(PostAnalysis)
class PostAnalysisAdmin(admin.ModelAdmin):
    list_display = ['post', 'lighting_score', 'composition_score', 'visual_appeal_score', 'category']
    list_filter = ['category', 'mood', 'created_at']
    search_fields = ['post__shortcode', 'detected_objects', 'dominant_colors']
