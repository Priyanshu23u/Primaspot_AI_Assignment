import instaloader
import requests
from datetime import datetime, timedelta
import time
import random
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

class RealInstagramScraper:
    def __init__(self):
        # Initialize Instaloader - the most reliable Instagram scraper
        self.loader = instaloader.Instaloader()
        
        # Configure to avoid detection
        self.loader.context.log = lambda *args, **kwargs: None  # Disable verbose logging
        self.loader.context.quiet = True
        
        # Add random delays to avoid rate limiting
        self.min_delay = 1
        self.max_delay = 3
        
        logger.info('✅ Instagram scraper initialized')
    
    def random_delay(self):
        """Add random delay to avoid detection"""
        delay = random.uniform(self.min_delay, self.max_delay)
        time.sleep(delay)
    
    def test_connection(self):
        """Test if Instagram scraping is working"""
        try:
            # Test with a known public profile
            profile = instaloader.Profile.from_username(self.loader.context, 'instagram')
            
            test_result = {
                'success': True,
                'message': 'Instagram scraping connection successful!',
                'test_profile': {
                    'username': profile.username,
                    'followers': profile.followers,
                    'following': profile.followees,
                    'posts': profile.mediacount,
                    'is_verified': profile.is_verified,
                    'full_name': profile.full_name,
                    'bio': profile.biography[:100] + '...' if profile.biography else ''
                },
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info('✅ Instagram connection test successful')
            return test_result
            
        except Exception as e:
            error_result = {
                'success': False,
                'error': str(e),
                'message': 'Instagram scraping test failed',
                'possible_causes': [
                    'Rate limiting by Instagram',
                    'Network connectivity issues',
                    'Instagram security measures',
                    'Invalid profile username'
                ],
                'suggestions': [
                    'Wait 10-15 minutes and try again',
                    'Use a different network/VPN',
                    'Try with a different public profile'
                ],
                'timestamp': datetime.now().isoformat()
            }
            
            logger.error(f'❌ Instagram connection test failed: {e}')
            return error_result
    
    def scrape_profile(self, username):
        """Scrape real Instagram profile data"""
        try:
            logger.info(f'🔍 Scraping Instagram profile: @{username}')
            
            # Add delay before scraping
            self.random_delay()
            
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
                'scraped_at': datetime.now(),
                'scraping_success': True,
                'scraping_method': 'instaloader'
            }
            
            logger.info(f'✅ Successfully scraped profile @{username}')
            return profile_data
            
        except instaloader.exceptions.ProfileNotExistsException:
            logger.error(f'❌ Profile @{username} does not exist')
            return {
                'scraping_success': False,
                'error': 'Profile does not exist',
                'username': username
            }
            
        except instaloader.exceptions.PrivateProfileNotFollowedException:
            logger.warning(f'🔒 Profile @{username} is private')
            return {
                'scraping_success': False,
                'error': 'Profile is private - cannot access without following',
                'username': username,
                'is_private': True
            }
            
        except Exception as e:
            logger.error(f'❌ Error scraping profile @{username}: {str(e)}')
            return {
                'scraping_success': False,
                'error': str(e),
                'username': username,
                'error_type': type(e).__name__
            }
    
    def scrape_recent_posts(self, username, limit=10):
        """Scrape recent Instagram posts"""
        try:
            logger.info(f'📸 Scraping recent posts for @{username}, limit: {limit}')
            
            profile = instaloader.Profile.from_username(self.loader.context, username)
            posts_data = []
            
            # Get recent posts
            for post in profile.get_posts():
                if len(posts_data) >= limit:
                    break
                
                try:
                    # Extract hashtags and mentions
                    hashtags = []
                    mentions = []
                    if post.caption:
                        words = post.caption.split()
                        hashtags = [word[1:] for word in words if word.startswith('#')]
                        mentions = [word[1:] for word in words if word.startswith('@')]
                    
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
                        'accessibility_caption': post.accessibility_caption or '',
                        'scraped_at': datetime.now(),
                        'scraping_success': True
                    }
                    
                    posts_data.append(post_data)
                    
                    # Add delay between posts
                    self.random_delay()
                    
                except Exception as e:
                    logger.warning(f'⚠️ Error processing post {post.shortcode}: {str(e)}')
                    continue
            
            logger.info(f'✅ Successfully scraped {len(posts_data)} posts for @{username}')
            
            return {
                'success': True,
                'posts': posts_data,
                'total_scraped': len(posts_data),
                'username': username,
                'scraped_at': datetime.now()
            }
            
        except Exception as e:
            logger.error(f'❌ Error scraping posts for @{username}: {str(e)}')
            return {
                'success': False,
                'error': str(e),
                'username': username,
                'posts': []
            }
    
    def _detect_category_from_bio(self, bio):
        """Detect category from bio text"""
        if not bio:
            return 'lifestyle'
        
        bio_lower = bio.lower()
        
        category_keywords = {
            'fitness': ['fitness', 'gym', 'workout', 'health', 'nutrition', 'trainer', 'yoga', 'muscle'],
            'technology': ['tech', 'developer', 'coding', 'software', 'ai', 'startup', 'innovation', 'programming'],
            'travel': ['travel', 'wanderlust', 'adventure', 'explore', 'journey', 'nomad', 'world', 'countries'],
            'food': ['food', 'chef', 'cooking', 'recipe', 'restaurant', 'foodie', 'culinary'],
            'fashion': ['fashion', 'style', 'model', 'designer', 'beauty', 'makeup', 'outfit'],
            'business': ['entrepreneur', 'business', 'ceo', 'founder', 'marketing', 'sales', 'company'],
            'entertainment': ['music', 'artist', 'actor', 'comedian', 'entertainment', 'creative', 'performer'],
        }
        
        for category, keywords in category_keywords.items():
            if any(keyword in bio_lower for keyword in keywords):
                return category
        
        return 'lifestyle'
    
    def full_profile_scrape(self, username, posts_limit=20):
        """Complete profile scraping including posts"""
        try:
            logger.info(f'🚀 Starting full profile scrape for @{username}')
            
            # Scrape profile
            profile_data = self.scrape_profile(username)
            if not profile_data.get('scraping_success'):
                return profile_data
            
            # Scrape posts
            posts_result = self.scrape_recent_posts(username, posts_limit)
            
            # Calculate engagement metrics
            posts = posts_result.get('posts', [])
            if posts:
                total_likes = sum(post.get('likes_count', 0) for post in posts)
                total_comments = sum(post.get('comments_count', 0) for post in posts)
                
                profile_data['avg_likes'] = total_likes // len(posts) if posts else 0
                profile_data['avg_comments'] = total_comments // len(posts) if posts else 0
                
                # Calculate engagement rate
                if profile_data.get('followers_count', 0) > 0:
                    avg_engagement = (profile_data['avg_likes'] + profile_data['avg_comments'])
                    profile_data['engagement_rate'] = (avg_engagement / profile_data['followers_count']) * 100
            
            # Complete dataset
            complete_data = {
                'profile': profile_data,
                'posts': posts_result,
                'scraping_summary': {
                    'total_posts_scraped': len(posts),
                    'scraping_method': 'instaloader',
                    'scraped_at': datetime.now(),
                    'success': True
                }
            }
            
            logger.info(f'✅ Complete profile scrape finished for @{username}')
            return complete_data
            
        except Exception as e:
            logger.error(f'❌ Error in full profile scrape for @{username}: {str(e)}')
            return {
                'success': False,
                'error': str(e),
                'username': username
            }
