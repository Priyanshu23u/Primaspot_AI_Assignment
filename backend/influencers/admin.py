# influencers/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Influencer

@admin.register(Influencer)
class InfluencerAdmin(admin.ModelAdmin):
    list_display = [
        'username', 'full_name', 'follower_count_display', 'engagement_rate_display',
        'posts_count', 'verification_status', 'last_scraped', 'is_active'
    ]
    list_filter = ['is_verified', 'is_private', 'is_business', 'is_active', 'created_at']
    search_fields = ['username', 'full_name', 'bio']
    readonly_fields = ['created_at', 'updated_at', 'scrape_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('username', 'full_name', 'profile_pic_url', 'bio')
        }),
        ('Metrics', {
            'fields': ('followers_count', 'following_count', 'posts_count')
        }),
        ('Engagement Analytics', {
            'fields': ('engagement_rate', 'avg_likes', 'avg_comments')
        }),
        ('Status', {
            'fields': ('is_verified', 'is_private', 'is_business', 'is_active')
        }),
        ('Scraping Info', {
            'fields': ('last_scraped', 'last_analyzed', 'scrape_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def follower_count_display(self, obj):
        if obj.followers_count >= 1000000:
            return f"{obj.followers_count / 1000000:.1f}M"
        elif obj.followers_count >= 1000:
            return f"{obj.followers_count / 1000:.1f}K"
        return str(obj.followers_count)
    follower_count_display.short_description = 'Followers'
    follower_count_display.admin_order_field = 'followers_count'
    
    def engagement_rate_display(self, obj):
        return f"{obj.engagement_rate}%"
    engagement_rate_display.short_description = 'Engagement'
    engagement_rate_display.admin_order_field = 'engagement_rate'
    
    def verification_status(self, obj):
        if obj.is_verified:
            return format_html('<span style="color: #28a745;">✓ Verified</span>')
        return format_html('<span style="color: #6c757d;">Not Verified</span>')
    verification_status.short_description = 'Verification'
    
    actions = ['trigger_scraping', 'trigger_analysis']
    
    def trigger_scraping(self, request, queryset):
        """Admin action to trigger scraping"""
        from scraping.tasks import scrape_influencer_data
        
        count = 0
        for influencer in queryset:
            scrape_influencer_data.delay(influencer.id)
            count += 1
        
        self.message_user(request, f"Scraping triggered for {count} influencers")
    trigger_scraping.short_description = "Trigger scraping for selected influencers"
    
    def trigger_analysis(self, request, queryset):
        """Admin action to trigger AI analysis"""
        from analytics.tasks import analyze_influencer_posts
        
        count = 0
        for influencer in queryset:
            analyze_influencer_posts.delay(influencer.id)
            count += 1
        
        self.message_user(request, f"AI analysis triggered for {count} influencers")
    trigger_analysis.short_description = "Trigger AI analysis for selected influencers"
