import instaloader
import requests
from bs4 import BeautifulSoup
import time
import random
import json
import os
from datetime import datetime, timedelta
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class InstagramScraper:
    def __init__(self):
        """Initialize the Instagram scraper using Instaloader"""
        # Initialize Instaloader (recommended approach)
        self.loader = instaloader.Instaloader()
        self.loader.context.log = lambda *args, **kwargs: None  # Disable verbose logging
        
        # Setup session for additional requests
        self.session = requests.Session()
        self.setup_session()
        
        logger.info("Instagram scraper initialized")
    
    def setup_session(self):
        """Setup requests session with proper headers"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        }
        self.session.headers.update(headers)
    
    def random_delay(self, min_seconds=1, max_seconds=3):
        """Add random delay to avoid detection"""
        time.sleep(random.uniform(min_seconds, max_seconds))
    
    def scrape_profile(self, username):
        """
        Scrape Instagram profile data using Instaloader
        Returns: dict with profile information
        """
        try:
            logger.info(f"🔍 Scraping profile: @{username}")
            
            # Get profile using Instaloader
            profile = instaloader.Profile.from_username(self.loader.context, username)
            
            profile_data = {
                'username': profile.username,
                'full_name': profile.full_name or '',
                'bio': profile.biography or '',
                'profile_pic_url': profile.profile_pic_url,
                'external_url': profile.external_url or '',
                'followers_count': profile.followers,
                'following_count': profile.followees,
                'posts_count': profile.mediacount,
                'is_verified': profile.is_verified,
                'is_private': profile.is_private,
                'is_business': profile.is_business_account,
                'category': self._detect_category_from_bio(profile.biography or ''),
                'scraped_at': datetime.now()
            }
            
            logger.info(f"✅ Successfully scraped profile @{username}")
            return profile_data
            
        except instaloader.exceptions.ProfileNotExistsException:
            logger.error(f"❌ Profile @{username} does not exist")
            return None
        except instaloader.exceptions.PrivateProfileNotFollowedException:
            logger.warning(f"🔒 Profile @{username} is private")
            return None
        except Exception as e:
            logger.error(f"❌ Error scraping profile @{username}: {str(e)}")
            return None
    
    def scrape_posts(self, username, limit=20):
        """
        Scrape Instagram posts using Instaloader
        Returns: list of post dictionaries
        """
        try:
            logger.info(f"📸 Scraping posts for @{username}, limit: {limit}")
            
            profile = instaloader.Profile.from_username(self.loader.context, username)
            posts_data = []
            
            for post in profile.get_posts():
                if len(posts_data) >= limit:
                    break
                
                try:
                    # Extract hashtags and mentions
                    hashtags = []
                    mentions = []
                    if post.caption:
                        hashtags = [tag.strip('#') for tag in post.caption.split() if tag.startswith('#')]
                        mentions = [mention.strip('@') for mention in post.caption.split() if mention.startswith('@')]
                    
                    post_data = {
                        'shortcode': post.shortcode,
                        'caption': post.caption or '',
                        'media_type': 'video' if post.is_video else 'photo',
                        'media_url': post.video_url if post.is_video else post.url,
                        'likes_count': post.likes,
                        'comments_count': post.comments,
                        'posted_at': post.date,
                        'hashtags': hashtags,
                        'mentions': mentions,
                        'location': post.location.name if post.location else '',
                    }
                    
                    posts_data.append(post_data)
                    self.random_delay(0.5, 1.5)  # Respectful delay
                    
                except Exception as e:
                    logger.warning(f"⚠️ Error processing post {post.shortcode}: {str(e)}")
                    continue
            
            logger.info(f"✅ Successfully scraped {len(posts_data)} posts for @{username}")
            return posts_data
            
        except Exception as e:
            logger.error(f"❌ Error scraping posts for @{username}: {str(e)}")
            return []
    
    def scrape_reels(self, username, limit=10):
        """
        Scrape Instagram reels
        """
        try:
            logger.info(f"🎥 Scraping reels for @{username}, limit: {limit}")
            
            profile = instaloader.Profile.from_username(self.loader.context, username)
            reels_data = []
            
            for post in profile.get_posts():
                if len(reels_data) >= limit:
                    break
                
                # Focus on video posts (likely reels)
                if post.is_video and post.video_duration and post.video_duration <= 90:
                    try:
                        hashtags = []
                        mentions = []
                        if post.caption:
                            hashtags = [tag.strip('#') for tag in post.caption.split() if tag.startswith('#')]
                            mentions = [mention.strip('@') for mention in post.caption.split() if mention.startswith('@')]
                        
                        reel_data = {
                            'shortcode': post.shortcode,
                            'caption': post.caption or '',
                            'media_url': post.video_url,
                            'thumbnail_url': post.url,
                            'duration': post.video_duration or 0,
                            'views_count': post.video_view_count or 0,
                            'likes_count': post.likes,
                            'comments_count': post.comments,
                            'posted_at': post.date,
                            'hashtags': hashtags,
                            'mentions': mentions,
                        }
                        
                        reels_data.append(reel_data)
                        self.random_delay(0.5, 1.5)
                        
                    except Exception as e:
                        logger.warning(f"⚠️ Error processing reel {post.shortcode}: {str(e)}")
                        continue
            
            logger.info(f"✅ Successfully scraped {len(reels_data)} reels for @{username}")
            return reels_data
            
        except Exception as e:
            logger.error(f"❌ Error scraping reels for @{username}: {str(e)}")
            return []
    
    def _detect_category_from_bio(self, bio):
        """Simple category detection based on bio keywords"""
        if not bio:
            return 'lifestyle'
        
        bio_lower = bio.lower()
        
        category_keywords = {
            'fitness': ['fitness', 'gym', 'workout', 'health', 'nutrition', 'trainer', 'yoga'],
            'technology': ['tech', 'developer', 'coding', 'software', 'ai', 'startup', 'innovation'],
            'travel': ['travel', 'wanderlust', 'adventure', 'explore', 'journey', 'nomad'],
            'food': ['food', 'chef', 'cooking', 'recipe', 'restaurant', 'foodie'],
            'fashion': ['fashion', 'style', 'model', 'designer', 'beauty', 'makeup'],
            'business': ['entrepreneur', 'business', 'ceo', 'founder', 'marketing', 'sales'],
            'entertainment': ['music', 'artist', 'actor', 'comedian', 'entertainment', 'creative'],
        }
        
        for category, keywords in category_keywords.items():
            if any(keyword in bio_lower for keyword in keywords):
                return category
        
        return 'lifestyle'
    
    def get_engagement_metrics(self, posts_data):
        """Calculate engagement metrics from posts data"""
        if not posts_data:
            return {'avg_likes': 0, 'avg_comments': 0, 'engagement_rate': 0}
        
        total_likes = sum(post.get('likes_count', 0) for post in posts_data)
        total_comments = sum(post.get('comments_count', 0) for post in posts_data)
        
        avg_likes = total_likes // len(posts_data)
        avg_comments = total_comments // len(posts_data)
        
        return {
            'avg_likes': avg_likes,
            'avg_comments': avg_comments,
            'total_engagement': total_likes + total_comments
        }
    
    def full_profile_scrape(self, username):
        """
        Complete profile scraping including posts and reels
        Returns: comprehensive profile data
        """
        try:
            logger.info(f"🚀 Starting full profile scrape for @{username}")
            
            # Scrape profile
            profile_data = self.scrape_profile(username)
            if not profile_data:
                return None
            
            # Scrape posts
            posts_data = self.scrape_posts(username, limit=20)
            
            # Scrape reels
            reels_data = self.scrape_reels(username, limit=10)
            
            # Calculate engagement metrics
            engagement_metrics = self.get_engagement_metrics(posts_data)
            profile_data.update(engagement_metrics)
            
            # Complete dataset
            complete_data = {
                'profile': profile_data,
                'posts': posts_data,
                'reels': reels_data,
                'scraped_at': datetime.now(),
                'total_content_scraped': len(posts_data) + len(reels_data)
            }
            
            logger.info(f"✅ Complete profile scrape finished for @{username}")
            return complete_data
            
        except Exception as e:
            logger.error(f"❌ Error in full profile scrape for @{username}: {str(e)}")
            return None
