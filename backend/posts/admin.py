from django.contrib import admin
from django.utils.html import format_html
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = [
        'shortcode', 'influencer', 'likes_count', 'comments_count', 'posted_at'
    ]
    list_filter = ['posted_at', 'influencer__username']
    search_fields = ['shortcode', 'caption', 'influencer__username']
    readonly_fields = ['shortcode', 'scraped_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('shortcode', 'influencer', 'caption', 'media_url')
        }),
        ('Engagement Metrics', {
            'fields': ('likes_count', 'comments_count', 'shares_count')
        }),
        ('Timestamps', {
            'fields': ('posted_at', 'scraped_at')
        }),
    )