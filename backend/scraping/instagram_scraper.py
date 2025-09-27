# scraping/instagram_scraper.py
import instaloader
import requests
from bs4 import BeautifulSoup
import json
import time
import random
from datetime import datetime
from django.utils import timezone
import logging

logger = logging.getLogger('scraping')

class InstagramScraper:
    """
    COMPLETE Instagram Data Scraper - Point 1 Implementation
    Handles all Instagram data collection requirements
    """
    
    def __init__(self):
        self.loader = instaloader.Instaloader()
        self.logger = logger
        
        # Configure instaloader
        self.loader.context.request_timeout = 30.0
        self.loader.context.sleep = True
        
        # Rate limiting
        self.request_delay = random.uniform(2, 5)
    
    def scrape_influencer_profile(self, username: str) -> dict:
        """
        Scrape MANDATORY basic information for influencer
        Returns: Basic Information (MANDATORY REQUIREMENTS)
        """
        try:
            self.logger.info(f"Starting profile scrape for @{username}")
            
            # Load profile
            profile = instaloader.Profile.from_username(self.loader.context, username)
            
            # Extract MANDATORY basic information
            profile_data = {
                'username': profile.username,
                'full_name': profile.full_name or '',
                'profile_pic_url': profile.profile_pic_url,
                'bio': profile.biography or '',
                
                # MANDATORY follower metrics
                'followers_count': profile.followers,
                'following_count': profile.followees,
                'posts_count': profile.mediacount,
                
                # Verification & status
                'is_verified': profile.is_verified,
                'is_private': profile.is_private,
                'is_business': profile.is_business_account,
                
                # Metadata
                'last_scraped': timezone.now(),
                'scrape_success': True
            }
            
            self.logger.info(f"Profile scraped successfully: @{username}")
            return profile_data
            
        except instaloader.exceptions.ProfileNotExistsException:
            self.logger.error(f"Profile @{username} does not exist")
            return {'scrape_success': False, 'error': 'Profile not found'}
        except instaloader.exceptions.PrivateProfileNotFollowedException:
            self.logger.error(f"Profile @{username} is private")
            return {'scrape_success': False, 'error': 'Private profile'}
        except Exception as e:
            self.logger.error(f"Profile scraping failed for @{username}: {e}")
            return {'scrape_success': False, 'error': str(e)}
    
    def scrape_recent_posts(self, username: str, limit: int = 12) -> list:
        """
        Scrape IMPORTANT post-level data
        Returns: Recent posts with IMPORTANT REQUIREMENTS data
        """
        try:
            self.logger.info(f"Starting posts scrape for @{username}, limit: {limit}")
            
            profile = instaloader.Profile.from_username(self.loader.context, username)
            posts_data = []
            
            # Get recent posts
            posts = profile.get_posts()
            count = 0
            
            for post in posts:
                if count >= limit:
                    break
                
                try:
                    # IMPORTANT post-level data
                    post_data = {
                        'post_id': str(post.mediaid),
                        'shortcode': post.shortcode,
                        'image_url': post.url,
                        'caption': post.caption or '',
                        
                        # IMPORTANT engagement data
                        'likes_count': post.likes,
                        'comments_count': post.comments,
                        'post_date': post.date_utc,
                        
                        # Post metadata
                        'is_video': post.is_video,
                        'video_url': post.video_url if post.is_video else None,
                        
                        # Analysis placeholders
                        'keywords': [],
                        'vibe_classification': None,
                        'quality_score': 0.0,
                        'is_analyzed': False
                    }
                    
                    posts_data.append(post_data)
                    count += 1
                    
                    # Rate limiting
                    time.sleep(self.request_delay)
                    
                except Exception as e:
                    self.logger.error(f"Error scraping post {post.shortcode}: {e}")
                    continue
            
            self.logger.info(f"Scraped {len(posts_data)} posts for @{username}")
            return posts_data
            
        except Exception as e:
            self.logger.error(f"Posts scraping failed for @{username}: {e}")
            return []
    
    def scrape_recent_reels(self, username: str, limit: int = 8) -> list:
        """
        Scrape ADVANCED reels/video-level data
        Returns: Recent reels with ADVANCED REQUIREMENTS data
        """
        try:
            self.logger.info(f"Starting reels scrape for @{username}, limit: {limit}")
            
            profile = instaloader.Profile.from_username(self.loader.context, username)
            reels_data = []
            
            # Get recent posts that are videos/reels
            posts = profile.get_posts()
            count = 0
            
            for post in posts:
                if count >= limit:
                    break
                
                # Only process videos/reels
                if not post.is_video:
                    continue
                
                try:
                    # Check if it's a reel (video with certain characteristics)
                    is_reel = post.video_duration and post.video_duration <= 90
                    
                    if is_reel:
                        # ADVANCED reel data
                        reel_data = {
                            'reel_id': str(post.mediaid),
                            'shortcode': post.shortcode,
                            'video_url': post.video_url,
                            'thumbnail_url': post.url,
                            'caption': post.caption or '',
                            
                            # ADVANCED engagement data
                            'views_count': post.video_view_count or 0,
                            'likes_count': post.likes,
                            'comments_count': post.comments,
                            'post_date': post.date_utc,
                            
                            # Video metadata
                            'duration': int(post.video_duration) if post.video_duration else 0,
                            
                            # Analysis placeholders
                            'detected_events': [],
                            'vibe_classification': None,
                            'descriptive_tags': [],
                            'is_analyzed': False
                        }
                        
                        reels_data.append(reel_data)
                        count += 1
                    
                    # Rate limiting
                    time.sleep(self.request_delay)
                    
                except Exception as e:
                    self.logger.error(f"Error scraping reel {post.shortcode}: {e}")
                    continue
            
            self.logger.info(f"Scraped {len(reels_data)} reels for @{username}")
            return reels_data
            
        except Exception as e:
            self.logger.error(f"Reels scraping failed for @{username}: {e}")
            return []
    
    def scrape_complete_profile(self, username: str) -> dict:
        """
        Complete scraping for ALL REQUIREMENTS
        Returns: All data needed for the web application
        """
        try:
            self.logger.info(f"Starting complete scrape for @{username}")
            
            # Scrape profile info (MANDATORY)
            profile_data = self.scrape_influencer_profile(username)
            if not profile_data.get('scrape_success'):
                return profile_data
            
            # Scrape posts (IMPORTANT)
            posts_data = self.scrape_recent_posts(username, limit=15)  # Get 15 for >10 requirement
            
            # Scrape reels (ADVANCED)
            reels_data = self.scrape_recent_reels(username, limit=8)   # Get 8 for >5 requirement
            
            # Combine all data
            complete_data = {
                **profile_data,
                'posts': posts_data,
                'reels': reels_data,
                'scrape_summary': {
                    'total_posts_scraped': len(posts_data),
                    'total_reels_scraped': len(reels_data),
                    'scraping_completed_at': timezone.now().isoformat(),
                    'requirements_met': {
                        'basic_information': True,
                        'recent_posts_10_plus': len(posts_data) >= 10,
                        'recent_reels_5_plus': len(reels_data) >= 5
                    }
                }
            }
            
            self.logger.info(f"Complete scraping finished for @{username}")
            self.logger.info(f"  Profile: ✅, Posts: {len(posts_data)}, Reels: {len(reels_data)}")
            
            return complete_data
            
        except Exception as e:
            self.logger.error(f"Complete scraping failed for @{username}: {e}")
            return {'scrape_success': False, 'error': str(e)}
