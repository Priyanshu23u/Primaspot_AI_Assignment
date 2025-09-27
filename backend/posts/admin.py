from django.contrib import admin
from .models import Post, PostAnalysis

class PostAnalysisInline(admin.StackedInline):
    model = PostAnalysis
    extra = 0
    readonly_fields = ['created_at']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['shortcode', 'influencer', 'likes_count', 'comments_count', 
                   'quality_score', 'vibe_classification', 'is_analyzed', 'post_date']
    list_filter = ['is_analyzed', 'is_video', 'vibe_classification', 'post_date', 'influencer']
    search_fields = ['shortcode', 'caption', 'influencer__username']
    readonly_fields = ['post_id', 'created_at', 'updated_at', 'analysis_date']
    ordering = ['-post_date']
    
    inlines = [PostAnalysisInline]
    
    fieldsets = (
        ('Post Information', {
            'fields': ('influencer', 'post_id', 'shortcode', 'post_date', 'is_video')
        }),
        ('Content', {
            'fields': ('image_url', 'image_local', 'caption')
        }),
        ('Engagement', {
            'fields': ('likes_count', 'comments_count')
        }),
        ('AI Analysis', {
            'fields': ('keywords', 'vibe_classification', 'quality_score', 
                      'is_analyzed', 'analysis_date'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    actions = ['analyze_posts', 'mark_as_unanalyzed']
    
    def analyze_posts(self, request, queryset):
        from analytics.tasks import analyze_influencer_posts
        for post in queryset:
            analyze_influencer_posts.delay(post.influencer.id)
        self.message_user(request, f'Analysis triggered for posts.')
    analyze_posts.short_description = "Trigger AI analysis for selected posts"
    
    def mark_as_unanalyzed(self, request, queryset):
        updated = queryset.update(is_analyzed=False)
        self.message_user(request, f'{updated} posts marked as unanalyzed.')
    mark_as_unanalyzed.short_description = "Mark selected posts as unanalyzed"

@admin.register(PostAnalysis)
class PostAnalysisAdmin(admin.ModelAdmin):
    list_display = ['post', 'category', 'mood', 'lighting_score', 'composition_score', 
                   'visual_appeal_score', 'created_at']
    list_filter = ['category', 'mood', 'created_at']
    search_fields = ['post__shortcode', 'post__influencer__username', 'category', 'mood']
    readonly_fields = ['created_at']
