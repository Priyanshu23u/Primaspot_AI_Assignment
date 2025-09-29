from django.core.management.base import BaseCommand, CommandError
from scraping.instagram_scraper import InstagramScraper
from scraping.content_analyzer import ContentAnalyzer
from influencers.models import Influencer
from posts.models import Post
from reels.models import Reel
from demographics.models import Demographics
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Scrape Instagram data for influencers'
    
    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Instagram username to scrape')
        parser.add_argument('--posts-limit', type=int, default=20, help='Number of posts to scrape')
        parser.add_argument('--reels-limit', type=int, default=10, help='Number of reels to scrape')
        parser.add_argument('--analyze', action='store_true', help='Run ML analysis on scraped content')
        parser.add_argument('--full-profile', action='store_true', help='Scrape complete profile data')
    
    def handle(self, *args, **options):
        username = options['username']
        posts_limit = options['posts_limit']
        reels_limit = options['reels_limit']
        should_analyze = options['analyze']
        full_profile = options['full_profile']
        
        self.stdout.write(f"🚀 Starting Instagram scrape for @{username}")
        
        try:
            # Initialize scraper and analyzer
            scraper = InstagramScraper()
            analyzer = ContentAnalyzer() if should_analyze else None
            
            if full_profile:
                # Complete profile scrape
                complete_data = scraper.full_profile_scrape(username)
                if not complete_data:
                    raise CommandError(f"Failed to scrape profile @{username}")
                
                # Save to database
                self.save_complete_profile_data(complete_data, analyzer)
                
            else:
                # Individual scraping
                profile_data = scraper.scrape_profile(username)
                if not profile_data:
                    raise CommandError(f"Failed to scrape profile @{username}")
                
                posts_data = scraper.scrape_posts(username, posts_limit)
                reels_data = scraper.scrape_reels(username, reels_limit)
                
                # Save to database
                self.save_profile_data(profile_data)
                self.save_posts_data(posts_data, username, analyzer)
                self.save_reels_data(reels_data, username, analyzer)
            
            self.stdout.write(
                self.style.SUCCESS(f"✅ Successfully scraped data for @{username}")
            )
            
        except Exception as e:
            logger.error(f"Scraping failed for @{username}: {str(e)}")
            raise CommandError(f"❌ Scraping failed: {str(e)}")
    
    def save_complete_profile_data(self, complete_data, analyzer):
        """Save complete profile data to database"""
        profile_data = complete_data['profile']
        posts_data = complete_data['posts']
        reels_data = complete_data['reels']
        
        # Save profile
        influencer = self.save_profile_data(profile_data)
        
        # Save posts and reels
        self.save_posts_data(posts_data, influencer.username, analyzer)
        self.save_reels_data(reels_data, influencer.username, analyzer)
        
        # Analyze content themes
        if analyzer:
            content_themes = analyzer.analyze_profile_content_themes(posts_data)
            if content_themes:
                influencer.content_themes = content_themes
                influencer.save()
        
        self.stdout.write(f"💾 Saved complete profile data for @{influencer.username}")
    
    def save_profile_data(self, profile_data):
        """Save influencer profile data"""
        try:
            influencer, created = Influencer.objects.get_or_create(
                username=profile_data['username'],
                defaults={
                    'full_name': profile_data.get('full_name', ''),
                    'bio': profile_data.get('bio', ''),
                    'profile_pic_url': profile_data.get('profile_pic_url', ''),
                    'external_url': profile_data.get('external_url', ''),
                    'followers_count': profile_data.get('followers_count', 0),
                    'following_count': profile_data.get('following_count', 0),
                    'posts_count': profile_data.get('posts_count', 0),
                    'is_verified': profile_data.get('is_verified', False),
                    'is_private': profile_data.get('is_private', False),
                    'is_business': profile_data.get('is_business', False),
                    'category': profile_data.get('category', 'lifestyle'),
                    'avg_likes': profile_data.get('avg_likes', 0),
                    'avg_comments': profile_data.get('avg_comments', 0),
                    'last_scraped': datetime.now()
                }
            )
            
            if not created:
                # Update existing influencer
                for key, value in profile_data.items():
                    if hasattr(influencer, key):
                        setattr(influencer, key, value)
                influencer.last_scraped = datetime.now()
                influencer.save()
            
            action = "Created" if created else "Updated"
            self.stdout.write(f"👤 {action} influencer: @{influencer.username}")
            return influencer
            
        except Exception as e:
            self.stdout.write(f"❌ Error saving profile: {str(e)}")
            return None
    
    def save_posts_data(self, posts_data, username, analyzer):
        """Save posts data"""
        try:
            influencer = Influencer.objects.get(username=username)
            created_count = 0
            
            for post_data in posts_data:
                try:
                    post, created = Post.objects.get_or_create(
                        shortcode=post_data['shortcode'],
                        defaults={
                            'influencer': influencer,
                            'caption': post_data.get('caption', ''),
                            'media_type': post_data.get('media_type', 'photo'),
                            'media_url': post_data.get('media_url', ''),
                            'likes_count': post_data.get('likes_count', 0),
                            'comments_count': post_data.get('comments_count', 0),
                            'posted_at': post_data.get('posted_at', datetime.now()),
                            'hashtags': post_data.get('hashtags', []),
                            'mentions': post_data.get('mentions', []),
                            'location': post_data.get('location', ''),
                        }
                    )
                    
                    if created:
                        created_count += 1
                        
                        # Run ML analysis if requested
                        if analyzer:
                            try:
                                analysis = analyzer.analyze_post_content(post_data)
                                if analysis:
                                    # Update post with analysis results
                                    sentiment = analysis.get('sentiment_analysis', {})
                                    post.sentiment_score = sentiment.get('sentiment_score', 0.0)
                                    post.vibe_classification = analysis.get('vibe_classification', 'casual')
                                    post.auto_tags = analysis.get('auto_tags', [])
                                    
                                    # Image analysis results
                                    image_analysis = analysis.get('image_analysis', {})
                                    if image_analysis:
                                        quality_metrics = image_analysis.get('quality_metrics', {})
                                        post.quality_score = quality_metrics.get('quality_score', 0.0)
                                        post.dominant_colors = image_analysis.get('dominant_colors', [])
                                    
                                    post.is_analyzed = True
                                    post.analysis_status = 'completed'
                                    post.save()
                                    
                            except Exception as e:
                                logger.warning(f"Analysis failed for post {post.shortcode}: {e}")
                
                except Exception as e:
                    self.stdout.write(f"❌ Error saving post {post_data.get('shortcode', 'unknown')}: {str(e)}")
                    continue
            
            self.stdout.write(f"📸 Saved {created_count} new posts for @{username}")
            
        except Exception as e:
            self.stdout.write(f"❌ Error saving posts: {str(e)}")
    
    def save_reels_data(self, reels_data, username, analyzer):
        """Save reels data"""
        try:
            influencer = Influencer.objects.get(username=username)
            created_count = 0
            
            for reel_data in reels_data:
                try:
                    reel, created = Reel.objects.get_or_create(
                        shortcode=reel_data['shortcode'],
                        defaults={
                            'influencer': influencer,
                            'caption': reel_data.get('caption', ''),
                            'media_url': reel_data.get('media_url', ''),
                            'thumbnail_url': reel_data.get('thumbnail_url', ''),
                            'duration': reel_data.get('duration', 0.0),
                            'views_count': reel_data.get('views_count', 0),
                            'likes_count': reel_data.get('likes_count', 0),
                            'comments_count': reel_data.get('comments_count', 0),
                            'posted_at': reel_data.get('posted_at', datetime.now()),
                            'hashtags': reel_data.get('hashtags', []),
                            'mentions': reel_data.get('mentions', []),
                        }
                    )
                    
                    if created:
                        created_count += 1
                        
                        # Basic analysis
                        if analyzer:
                            try:
                                vibe = analyzer.classify_vibe(
                                    reel_data.get('caption', ''),
                                    reel_data.get('hashtags', [])
                                )
                                reel.vibe_classification = vibe
                                reel.is_analyzed = True
                                reel.save()
                            except Exception as e:
                                logger.warning(f"Analysis failed for reel {reel.shortcode}: {e}")
                
                except Exception as e:
                    self.stdout.write(f"❌ Error saving reel {reel_data.get('shortcode', 'unknown')}: {str(e)}")
                    continue
            
            self.stdout.write(f"🎥 Saved {created_count} new reels for @{username}")
            
        except Exception as e:
            self.stdout.write(f"❌ Error saving reels: {str(e)}")
