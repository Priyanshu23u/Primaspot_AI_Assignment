# scraping/tasks.py
from celery import shared_task
from celery.utils.log import get_task_logger
from django.utils import timezone
from .instagram_scraper import InstagramScraper
from influencers.models import Influencer
from posts.models import Post
from reels.models import Reel

logger = get_task_logger(__name__)

@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={'max_retries': 3, 'countdown': 300})
def scrape_influencer_data(self, influencer_id: int):
    """
    COMPLETE scraping task - Point 1 & 4 Implementation
    Scrapes ALL REQUIREMENTS data for influencer
    """
    try:
        logger.info(f"Starting scraping task for influencer {influencer_id}")
        
        # Get influencer
        influencer = Influencer.objects.get(id=influencer_id)
        username = influencer.username
        
        # Initialize scraper
        scraper = InstagramScraper()
        
        # Perform complete scraping
        scraped_data = scraper.scrape_complete_profile(username)
        
        if not scraped_data.get('scrape_success'):
            logger.error(f"Scraping failed for @{username}: {scraped_data.get('error')}")
            return f"Scraping failed: {scraped_data.get('error')}"
        
        # Update influencer with scraped data
        _update_influencer_data(influencer, scraped_data)
        
        # Create/update posts
        posts_created = _create_posts(influencer, scraped_data.get('posts', []))
        
        # Create/update reels
        reels_created = _create_reels(influencer, scraped_data.get('reels', []))
        
        # Update scraping metadata
        influencer.last_scraped = timezone.now()
        influencer.scrape_count += 1
        influencer.save()
        
        result_message = f"Scraping completed for @{username}: {posts_created} posts, {reels_created} reels"
        logger.info(result_message)
        
        return result_message
        
    except Influencer.DoesNotExist:
        error_msg = f"Influencer {influencer_id} not found"
        logger.error(error_msg)
        return error_msg
    except Exception as e:
        logger.error(f"Scraping task failed: {e}")
        raise

def _update_influencer_data(influencer, scraped_data):
    """Update influencer model with scraped data"""
    influencer.full_name = scraped_data.get('full_name', influencer.full_name)
    influencer.profile_pic_url = scraped_data.get('profile_pic_url', influencer.profile_pic_url)
    influencer.bio = scraped_data.get('bio', influencer.bio)
    influencer.followers_count = scraped_data.get('followers_count', influencer.followers_count)
    influencer.following_count = scraped_data.get('following_count', influencer.following_count)
    influencer.posts_count = scraped_data.get('posts_count', influencer.posts_count)
    influencer.is_verified = scraped_data.get('is_verified', influencer.is_verified)
    influencer.is_private = scraped_data.get('is_private', influencer.is_private)
    influencer.is_business = scraped_data.get('is_business', influencer.is_business)
    influencer.save()

def _create_posts(influencer, posts_data):
    """Create post records from scraped data"""
    created_count = 0
    
    for post_data in posts_data:
        post, created = Post.objects.update_or_create(
            post_id=post_data['post_id'],
            defaults={
                'influencer': influencer,
                'shortcode': post_data['shortcode'],
                'image_url': post_data['image_url'],
                'caption': post_data['caption'],
                'likes_count': post_data['likes_count'],
                'comments_count': post_data['comments_count'],
                'post_date': post_data['post_date'],
                'is_video': post_data['is_video'],
                'video_url': post_data.get('video_url'),
            }
        )
        
        if created:
            created_count += 1
    
    return created_count

def _create_reels(influencer, reels_data):
    """Create reel records from scraped data"""
    created_count = 0
    
    for reel_data in reels_data:
        reel, created = Reel.objects.update_or_create(
            reel_id=reel_data['reel_id'],
            defaults={
                'influencer': influencer,
                'shortcode': reel_data['shortcode'],
                'video_url': reel_data['video_url'],
                'thumbnail_url': reel_data['thumbnail_url'],
                'caption': reel_data['caption'],
                'views_count': reel_data['views_count'],
                'likes_count': reel_data['likes_count'],
                'comments_count': reel_data['comments_count'],
                'post_date': reel_data['post_date'],
                'duration': reel_data['duration'],
            }
        )
        
        if created:
            created_count += 1
    
    return created_count

@shared_task(bind=True)
def daily_influencer_update(self):
    """
    SCHEDULED TASK: Daily update of all influencers
    Part of Point 4 implementation
    """
    try:
        logger.info("Starting daily influencer update")
        
        influencers = Influencer.objects.filter(is_active=True)
        processed_count = 0
        
        for influencer in influencers:
            try:
                # Chain scraping and analysis tasks
                from analytics.tasks import analyze_influencer_posts, analyze_influencer_reels, infer_audience_demographics
                
                # Start task chain: scrape -> analyze posts -> analyze reels -> demographics
                chain = (
                    scrape_influencer_data.s(influencer.id) |
                    analyze_influencer_posts.s() |
                    analyze_influencer_reels.s() |
                    infer_audience_demographics.s()
                )
                
                chain.apply_async()
                processed_count += 1
                logger.info(f"Daily update chain started for @{influencer.username}")
                
                # Add delay to prevent overwhelming
                import time
                time.sleep(5)
                
            except Exception as e:
                logger.error(f"Failed to start daily update for {influencer.username}: {e}")
                continue
        
        logger.info(f"Daily update initiated for {processed_count} influencers")
        return f"Daily update started for {processed_count} influencers"
        
    except Exception as e:
        logger.error(f"Daily update task failed: {e}")
        raise
