from django.contrib import admin
from django.utils.html import format_html
from .models import Influencer

@admin.register(Influencer)
class InfluencerAdmin(admin.ModelAdmin):
    list_display = [
        'username', 'full_name', 'followers_count', 
        'following_count', 'posts_count', 'created_at'
    ]
    list_filter = ['created_at', 'updated_at']
    search_fields = ['username', 'full_name', 'bio']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('username', 'full_name', 'bio', 'profile_pic_url')
        }),
        ('Metrics', {
            'fields': ('followers_count', 'following_count', 'posts_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )