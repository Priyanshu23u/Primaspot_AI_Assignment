from django.contrib import admin
from django.utils.html import format_html
from .models import Reel

@admin.register(Reel)
class ReelAdmin(admin.ModelAdmin):
    list_display = [
        'shortcode', 'influencer', 'duration', 'views_count', 
        'likes_count', 'engagement_rate_display', 'posted_at'
    ]
    list_filter = [
        'posted_at', 'duration', 'influencer__category'
    ]
    search_fields = ['shortcode', 'caption', 'influencer__username']
    readonly_fields = ['shortcode', 'scraped_at']
    
    def engagement_rate_display(self, obj):
        if hasattr(obj, 'engagement_rate') and obj.engagement_rate:
            return f"{obj.engagement_rate:.2f}%"
        return "0%"
    engagement_rate_display.short_description = "Engagement Rate"

    fieldsets = (
        ('Basic Information', {
            'fields': ('shortcode', 'influencer', 'caption', 'media_url', 'duration')
        }),
        ('Engagement Metrics', {
            'fields': ('views_count', 'likes_count', 'comments_count', 'shares_count')
        }),
        ('Timestamps', {
            'fields': ('posted_at', 'scraped_at')
        }),
    )