from celery import shared_task
from django.utils import timezone
from influencers.models import Influencer
from posts.models import Post
from reels.models import Reel
from .instagram_scraper import InstagramScraper
import logging
from datetime import datetime

logger = logging.getLogger('scraping')

@shared_task
def scrape_influencer_data(influencer_id: int):
    """
    WORKING task to scrape complete influencer data
    """
    try:
        influencer = Influencer.objects.get(id=influencer_id)
        scraper = InstagramScraper()
        
        logger.info(f"Starting scrape for @{influencer.username}")
        
        # Scrape profile data
        profile_data = scraper.scrape_user_profile(influencer.username)
        if profile_data:
            _update_influencer_profile(influencer, profile_data)
            logger.info(f"Profile updated for @{influencer.username}")
        
        # Scrape posts
        posts_data = scraper.scrape_user_posts(influencer.username, max_posts=12)
        posts_created = 0
        
        for post_data in posts_data:
            if _create_or_update_post(influencer, post_data):
                posts_created += 1
        
        logger.info(f"Created/updated {posts_created} posts for @{influencer.username}")
        
        # Scrape reels
        reels_data = scraper.scrape_user_reels(influencer.username, max_reels=5)
        reels_created = 0
        
        for reel_data in reels_data:
            if _create_or_update_reel(influencer, reel_data):
                reels_created += 1
        
        logger.info(f"Created/updated {reels_created} reels for @{influencer.username}")
        
        # Update scraping metadata
        influencer.last_scraped = timezone.now()
        influencer.scrape_count += 1
        influencer.save()
        
        # Update engagement metrics
        influencer.update_engagement_metrics()
        
        # Trigger analysis tasks
        from analytics.tasks import analyze_influencer_posts, analyze_influencer_reels
        analyze_influencer_posts.delay(influencer_id)
        analyze_influencer_reels.delay(influencer_id)
        
        scraper.close()
        
        return f"Successfully scraped @{influencer.username}: {posts_created} posts, {reels_created} reels"
        
    except Influencer.DoesNotExist:
        logger.error(f"Influencer {influencer_id} not found")
        return f"Influencer {influencer_id} not found"
    except Exception as e:
        logger.error(f"Error scraping influencer {influencer_id}: {str(e)}")
        return f"Error scraping: {str(e)}"

def _update_influencer_profile(influencer: Influencer, profile_data: dict):
    """Update influencer profile with scraped data"""
    influencer.full_name = profile_data.get('full_name', '')
    influencer.bio = profile_data.get('biography', '')
    influencer.profile_pic_url = profile_data.get('profile_pic_url', '')
    influencer.followers_count = profile_data.get('followers_count', 0)
    influencer.following_count = profile_data.get('following_count', 0)
    influencer.posts_count = profile_data.get('posts_count', 0)
    influencer.is_verified = profile_data.get('is_verified', False)
    influencer.is_private = profile_data.get('is_private', False)
    influencer.website = profile_data.get('website', '')
    influencer.save()

def _create_or_update_post(influencer: Influencer, post_data: dict) -> bool:
    """Create or update post with scraped data"""
    try:
        post, created = Post.objects.get_or_create(
            post_id=post_data['post_id'],
            defaults={
                'influencer': influencer,
                'shortcode': post_data['shortcode'],
                'image_url': post_data['image_url'],
                'caption': post_data['caption'],
                'likes_count': post_data['likes_count'],
                'comments_count': post_data['comments_count'],
                'post_date': datetime.fromtimestamp(post_data['post_date']),
                'is_video': post_data['is_video'],
            }
        )
        
        if not created:
            # Update engagement metrics
            post.likes_count = post_data['likes_count']
            post.comments_count = post_data['comments_count']
            post.save()
        
        return True
    except Exception as e:
        logger.error(f"Failed to create/update post: {e}")
        return False

def _create_or_update_reel(influencer: Influencer, reel_data: dict) -> bool:
    """Create or update reel with scraped data"""
    try:
        reel, created = Reel.objects.get_or_create(
            reel_id=reel_data['reel_id'],
            defaults={
                'influencer': influencer,
                'shortcode': reel_data['shortcode'],
                'video_url': reel_data['video_url'],
                'thumbnail_url': reel_data['thumbnail_url'],
                'caption': reel_data['caption'],
                'views_count': reel_data.get('views_count', 0),
                'likes_count': reel_data['likes_count'],
                'comments_count': reel_data['comments_count'],
                'post_date': datetime.fromtimestamp(reel_data['post_date']),
                'duration': reel_data.get('duration', 0),
            }
        )
        
        if not created:
            # Update engagement metrics
            reel.views_count = reel_data.get('views_count', 0)
            reel.likes_count = reel_data['likes_count']
            reel.comments_count = reel_data['comments_count']
            reel.save()
        
        return True
    except Exception as e:
        logger.error(f"Failed to create/update reel: {e}")
        return False
