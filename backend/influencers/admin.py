from django.contrib import admin
from .models import Influencer

@admin.register(Influencer)
class InfluencerAdmin(admin.ModelAdmin):
    list_display = ['username', 'full_name', 'followers_count', 'following_count', 
                   'posts_count', 'engagement_rate', 'is_verified', 'last_scraped']
    list_filter = ['is_verified', 'is_private', 'is_active', 'last_scraped']
    search_fields = ['username', 'full_name']
    readonly_fields = ['created_at', 'updated_at', 'last_scraped', 'scrape_count']
    ordering = ['-followers_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('username', 'full_name', 'bio', 'website', 'is_verified', 'is_private')
        }),
        ('Profile Media', {
            'fields': ('profile_pic_url', 'profile_pic_local')
        }),
        ('Statistics', {
            'fields': ('followers_count', 'following_count', 'posts_count', 
                      'avg_likes', 'avg_comments', 'engagement_rate')
        }),
        ('Scraping Info', {
            'fields': ('is_active', 'last_scraped', 'scrape_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['trigger_scraping', 'mark_as_active', 'mark_as_inactive']
    
    def trigger_scraping(self, request, queryset):
        from scraping.tasks import scrape_influencer_data
        count = 0
        for influencer in queryset:
            scrape_influencer_data.delay(influencer.id)
            count += 1
        self.message_user(request, f'Scraping triggered for {count} influencers.')
    trigger_scraping.short_description = "Trigger scraping for selected influencers"
    
    def mark_as_active(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} influencers marked as active.')
    mark_as_active.short_description = "Mark selected influencers as active"
    
    def mark_as_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} influencers marked as inactive.')
    mark_as_inactive.short_description = "Mark selected influencers as inactive"
