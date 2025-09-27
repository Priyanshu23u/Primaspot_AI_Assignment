# posts/models.py
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import json
from influencers.models import Influencer

class Post(models.Model):
    """
    Enhanced Post Model - Stores post-level data (IMPORTANT REQUIREMENTS)
    Comprehensive model covering all assignment requirements with enhanced AI analysis support
    """
    
    # Relationships
    influencer = models.ForeignKey(
        Influencer, 
        on_delete=models.CASCADE, 
        related_name='posts',
        db_index=True
    )
    
    # Basic Post Data (IMPORTANT REQUIREMENTS - Assignment Mandatory)
    post_id = models.CharField(
        max_length=100, 
        unique=True, 
        db_index=True,
        help_text="Instagram post ID from API"
    )
    shortcode = models.CharField(
        max_length=50, 
        unique=True, 
        db_index=True,
        help_text="Instagram shortcode (URL identifier)"
    )
    image_url = models.URLField(
        max_length=1000,  # Increased for longer Instagram URLs
        help_text="Post image/thumbnail URL (IMPORTANT REQUIREMENT)"
    )
    caption = models.TextField(
        blank=True, 
        null=True,
        help_text="Post caption text (IMPORTANT REQUIREMENT)"
    )
    
    # Engagement Data (IMPORTANT REQUIREMENTS - Assignment Mandatory)
    likes_count = models.BigIntegerField(
        default=0, 
        db_index=True,
        validators=[MinValueValidator(0)],
        help_text="Number of likes (IMPORTANT REQUIREMENT)"
    )
    comments_count = models.BigIntegerField(
        default=0, 
        db_index=True,
        validators=[MinValueValidator(0)],
        help_text="Number of comments (IMPORTANT REQUIREMENT)"
    )
    post_date = models.DateTimeField(
        db_index=True,
        help_text="When the post was originally published"
    )
    
    # Enhanced Post Metadata
    is_video = models.BooleanField(
        default=False,
        help_text="Whether this post contains video content"
    )
    video_url = models.URLField(
        max_length=1000, 
        blank=True, 
        null=True,
        help_text="Video URL if post contains video"
    )
    typename = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Instagram post type (GraphImage, GraphVideo, etc.)"
    )
    accessibility_caption = models.TextField(
        blank=True,
        null=True,
        help_text="Instagram's auto-generated accessibility description"
    )
    
    # Location Data
    location_name = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Location name if post is geo-tagged"
    )
    location_id = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Instagram location ID"
    )
    
    # Social Engagement
    tagged_users_count = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Number of users tagged in this post"
    )
    
    # AI/ML Analysis Results (IMPORTANT REQUIREMENTS - Point 2)
    keywords = models.TextField(default='[]', blank=True, help_text="JSON list of keywords")
    vibe_classification = models.CharField(
        max_length=50, 
        blank=True, 
        null=True, 
        db_index=True,
        choices=[
            ('luxury', 'Luxury/Lavish'),
            ('aesthetic', 'Aesthetic'),
            ('casual', 'Casual'),
            ('energetic', 'Energetic'),
            ('professional', 'Professional'),
            ('lifestyle', 'Lifestyle'),
            ('fashion', 'Fashion'),
            ('fitness', 'Fitness'),
            ('travel', 'Travel'),
            ('food', 'Food')
        ],
        help_text="AI-classified vibe/ambience (IMPORTANT REQUIREMENT - AI Analysis)"
    )
    quality_score = models.DecimalField(
        max_digits=4, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('10.00'))],
        help_text="AI-generated quality indicators 0-10 (IMPORTANT REQUIREMENT - AI Analysis)"
    )
    
    # Enhanced AI Analysis Fields
    sentiment_score = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal('-1.00')), MaxValueValidator(Decimal('1.00'))],
        help_text="Sentiment analysis of caption (-1 negative to +1 positive)"
    )
    category = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        choices=[
            ('lifestyle', 'Lifestyle'),
            ('fitness', 'Fitness'),
            ('fashion', 'Fashion'), 
            ('food', 'Food'),
            ('travel', 'Travel'),
            ('business', 'Business'),
            ('entertainment', 'Entertainment'),
            ('sports', 'Sports'),
            ('technology', 'Technology'),
            ('art', 'Art & Culture')
        ],
        help_text="AI-determined content category"
    )
    
    # Performance Metrics
    engagement_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        help_text="Calculated engagement rate percentage"
    )
    virality_score = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('10.00'))],
        help_text="Calculated virality score based on engagement vs follower ratio"
    )
    
    # Analysis Status and Metadata
    is_analyzed = models.BooleanField(
        default=False, 
        db_index=True,
        help_text="Whether AI analysis has been completed"
    )
    analysis_date = models.DateTimeField(
        blank=True, 
        null=True,
        help_text="When AI analysis was last performed"
    )
    analysis_version = models.CharField(
        max_length=10,
        default='1.0',
        help_text="Version of AI analysis performed"
    )
    analysis_confidence = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('1.00'))],
        help_text="Confidence score of AI analysis (0-1)"
    )
    
    # Scraping Metadata
    scraped_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When this post was scraped from Instagram"
    )
    last_updated = models.DateTimeField(
        auto_now=True,
        help_text="Last time this post data was updated"
    )
    scraper_version = models.CharField(
        max_length=10,
        default='1.0',
        help_text="Version of scraper that collected this data"
    )
    
    # Data Quality Flags
    has_caption = models.BooleanField(
        default=False,
        help_text="Whether post has a caption"
    )
    has_location = models.BooleanField(
        default=False,
        help_text="Whether post has location data"
    )
    has_tags = models.BooleanField(
        default=False,
        help_text="Whether post has tagged users"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'posts'
        ordering = ['-post_date']
        indexes = [
            models.Index(fields=['influencer', '-post_date'], name='posts_influencer_date_idx'),
            models.Index(fields=['-likes_count'], name='posts_likes_idx'),
            models.Index(fields=['-engagement_rate'], name='posts_engagement_idx'),
            models.Index(fields=['vibe_classification'], name='posts_vibe_idx'),
            models.Index(fields=['category'], name='posts_category_idx'),
            models.Index(fields=['is_analyzed'], name='posts_analyzed_idx'),
            models.Index(fields=['-virality_score'], name='posts_virality_idx'),
            models.Index(fields=['post_date', 'is_analyzed'], name='posts_date_analyzed_idx'),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(likes_count__gte=0),
                name='posts_likes_positive'
            ),
            models.CheckConstraint(
                check=models.Q(comments_count__gte=0),
                name='posts_comments_positive'
            ),
            models.CheckConstraint(
                check=models.Q(quality_score__gte=0) & models.Q(quality_score__lte=10),
                name='posts_quality_range'
            ),
        ]
    
    def __str__(self):
        return f"@{self.influencer.username} - {self.shortcode} ({self.engagement_total:,} eng.)"
    
    def save(self, *args, **kwargs):
        """Override save to calculate derived fields"""
        # Calculate engagement metrics
        self.engagement_rate = self.calculate_engagement_rate()
        self.virality_score = self.calculate_virality_score()
        
        # Set boolean flags
        self.has_caption = bool(self.caption and self.caption.strip())
        self.has_location = bool(self.location_name)
        self.has_tags = self.tagged_users_count > 0
        
        super().save(*args, **kwargs)
    
    @property
    def engagement_total(self):
        """Total engagement (likes + comments)"""
        return self.likes_count + self.comments_count
    
    def calculate_engagement_rate(self):
        """Calculate engagement rate as percentage of follower base"""
        if self.influencer.followers_count > 0:
            return round((self.engagement_total / self.influencer.followers_count) * 100, 2)
        return 0.00
    
    def calculate_virality_score(self):
        """Calculate virality score (0-10) based on engagement performance"""
        if not self.influencer.followers_count:
            return 0.00
        
        # Calculate engagement rate
        eng_rate = (self.engagement_total / self.influencer.followers_count) * 100
        
        # Score based on engagement rate benchmarks
        if eng_rate >= 10:  # Viral content
            return 10.00
        elif eng_rate >= 5:  # High performance
            return 8.00 + (eng_rate - 5) * 0.4
        elif eng_rate >= 2:  # Good performance
            return 5.00 + (eng_rate - 2) * 1.0
        elif eng_rate >= 1:  # Average performance
            return 2.00 + (eng_rate - 1) * 3.0
        else:  # Below average
            return eng_rate * 2
    
    def get_keywords_display(self):
        """Get keywords as comma-separated string"""
        if isinstance(self.keywords, list):
            return ', '.join(self.keywords[:5])  # Show first 5
        return str(self.keywords) if self.keywords else ''
    
    def get_vibe_display(self):
        """Get human-readable vibe classification"""
        return dict(self._meta.get_field('vibe_classification').choices).get(
            self.vibe_classification, self.vibe_classification or 'Unclassified'
        )
    
    def get_category_display(self):
        """Get human-readable category"""
        return dict(self._meta.get_field('category').choices).get(
            self.category, self.category or 'Uncategorized'
        )
    
    def is_high_performing(self):
        """Check if post is high-performing"""
        return self.engagement_rate >= 3.0 or self.virality_score >= 7.0
    
    def get_performance_tier(self):
        """Get performance tier classification"""
        if self.virality_score >= 8:
            return 'viral'
        elif self.virality_score >= 6:
            return 'high'
        elif self.virality_score >= 4:
            return 'medium'
        elif self.virality_score >= 2:
            return 'low'
        else:
            return 'poor'


class PostAnalysis(models.Model):
    """
    Detailed AI Analysis for Posts (IMPORTANT REQUIREMENTS - Point 2)
    Stores comprehensive AI analysis results for image and content processing
    """
    
    # Relationship
    post = models.OneToOneField(
        Post, 
        on_delete=models.CASCADE, 
        related_name='detailed_analysis'
    )
    
    # Image Quality Metrics (IMPORTANT REQUIREMENTS - AI Analysis)
    lighting_score = models.DecimalField(
        max_digits=4, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('10.00'))],
        help_text="AI-analyzed lighting quality (0-10)"
    )
    composition_score = models.DecimalField(
        max_digits=4, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('10.00'))],
        help_text="AI-analyzed composition quality (0-10)"
    )
    visual_appeal_score = models.DecimalField(
        max_digits=4, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('10.00'))],
        help_text="AI-analyzed visual appeal (0-10)"
    )
    sharpness_score = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('10.00'))],
        help_text="AI-analyzed image sharpness (0-10)"
    )
    color_harmony_score = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('10.00'))],
        help_text="AI-analyzed color harmony (0-10)"
    )
    
    # AI Detection Results (Enhanced)
    detected_objects = models.TextField(default='[]', blank=True, help_text="JSON list of detected objects")
    dominant_colors = models.TextField(default='[]', blank=True, help_text="JSON list of colors")
    faces_detected = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Number of faces detected by AI"
    )
    people_count = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Estimated number of people in image"
    )
    
    # Content Classification (Enhanced)
    category = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        help_text="AI-determined content category"
    )
    mood = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        choices=[
            ('happy', 'Happy'),
            ('sad', 'Sad'),
            ('excited', 'Excited'),
            ('calm', 'Calm'),
            ('energetic', 'Energetic'),
            ('romantic', 'Romantic'),
            ('professional', 'Professional'),
            ('casual', 'Casual'),
            ('mysterious', 'Mysterious'),
            ('inspirational', 'Inspirational')
        ],
        help_text="AI-determined mood/emotion"
    )
    style = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        choices=[
            ('minimalist', 'Minimalist'),
            ('vibrant', 'Vibrant'),
            ('vintage', 'Vintage'),
            ('modern', 'Modern'),
            ('artistic', 'Artistic'),
            ('documentary', 'Documentary'),
            ('fashion', 'Fashion'),
            ('landscape', 'Landscape'),
            ('portrait', 'Portrait'),
            ('street', 'Street Photography')
        ],
        help_text="AI-determined photography/content style"
    )
    
    # Text Analysis Results
    caption_sentiment = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal('-1.00')), MaxValueValidator(Decimal('1.00'))],
        help_text="Caption sentiment analysis (-1 to +1)"
    )
    caption_length = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Length of caption in characters"
    )
    hashtag_count = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Number of hashtags in caption"
    )
    mention_count = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Number of @mentions in caption"
    )
    
    # Advanced AI Metrics
    aesthetic_score = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('10.00'))],
        help_text="Overall aesthetic score (0-10)"
    )
    uniqueness_score = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('10.00'))],
        help_text="Content uniqueness score (0-10)"
    )
    
    # Processing Metadata
    processing_time_ms = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Time taken for AI processing in milliseconds"
    )
    ai_model_version = models.CharField(
        max_length=20,
        default='1.0',
        help_text="Version of AI model used for analysis"
    )
    processing_errors = models.TextField(default='[]', blank=True, help_text="JSON list of errors")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'post_detailed_analyses'
        verbose_name = 'Post Analysis'
        verbose_name_plural = 'Post Analyses'
        indexes = [
            models.Index(fields=['-aesthetic_score'], name='analysis_aesthetic_idx'),
            models.Index(fields=['-visual_appeal_score'], name='analysis_visual_idx'),
            models.Index(fields=['category'], name='analysis_category_idx'),
            models.Index(fields=['mood'], name='analysis_mood_idx'),
        ]
    
    def __str__(self):
        return f"Analysis for {self.post.shortcode} (Quality: {self.get_overall_quality()}/10)"
    
    def get_overall_quality(self):
        """Calculate overall quality score"""
        scores = [
            self.lighting_score,
            self.composition_score,
            self.visual_appeal_score,
            self.sharpness_score,
            self.color_harmony_score
        ]
        valid_scores = [s for s in scores if s > 0]
        if valid_scores:
            return round(sum(valid_scores) / len(valid_scores), 1)
        return 0.0
    
    def get_detected_objects_display(self):
        """Get detected objects as comma-separated string"""
        if isinstance(self.detected_objects, list):
            return ', '.join(self.detected_objects[:10])  # Show first 10
        return str(self.detected_objects) if self.detected_objects else ''
    
    def get_dominant_colors_display(self):
        """Get dominant colors as comma-separated string"""
        if isinstance(self.dominant_colors, list):
            return ', '.join(self.dominant_colors[:5])  # Show first 5
        return str(self.dominant_colors) if self.dominant_colors else ''
    
    def is_high_quality(self):
        """Check if post is considered high quality"""
        return self.get_overall_quality() >= 7.0
    
    def has_people(self):
        """Check if image contains people"""
        return self.faces_detected > 0 or self.people_count > 0
    
    def get_quality_tier(self):
        """Get quality tier classification"""
        quality = self.get_overall_quality()
        if quality >= 8.5:
            return 'excellent'
        elif quality >= 7.0:
            return 'high'
        elif quality >= 5.0:
            return 'medium'
        elif quality >= 3.0:
            return 'low'
        else:
            return 'poor'


# Manager for enhanced queries
class PostQuerySet(models.QuerySet):
    """Custom QuerySet for advanced post filtering"""
    
    def analyzed(self):
        """Get only analyzed posts"""
        return self.filter(is_analyzed=True)
    
    def by_vibe(self, vibe):
        """Filter by vibe classification"""
        return self.filter(vibe_classification=vibe)
    
    def by_category(self, category):
        """Filter by category"""
        return self.filter(category=category)
    
    def high_performing(self):
        """Get high-performing posts"""
        return self.filter(virality_score__gte=7.0)
    
    def recent(self, days=30):
        """Get posts from recent days"""
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        return self.filter(post_date__gte=cutoff_date)
    
    def with_high_engagement(self, min_rate=3.0):
        """Get posts with high engagement rate"""
        return self.filter(engagement_rate__gte=min_rate)


# Add custom manager to Post model
Post.add_to_class('objects', models.Manager.from_queryset(PostQuerySet)())
