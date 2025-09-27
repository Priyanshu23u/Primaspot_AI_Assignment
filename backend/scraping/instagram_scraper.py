# scraping/instagram_scraper.py
import instaloader
import requests
from bs4 import BeautifulSoup
import json
import time
import random
from datetime import datetime, timedelta
from django.utils import timezone
import logging
from typing import Dict, List, Optional
import os
from urllib.parse import urlparse
import re

logger = logging.getLogger('scraping')

class InstagramScraper:
    """
    COMPLETE Enhanced Instagram Data Scraper - Point 1 Implementation
    Handles all Instagram data collection requirements with enhanced anti-detection
    """
    
    def __init__(self):
        self.loader = instaloader.Instaloader()
        self.logger = logger
        self.session = requests.Session()
        
        # Enhanced configuration for anti-detection
        self._configure_instaloader()
        
        # Rate limiting settings
        self.min_delay = 3
        self.max_delay = 8
        self.request_count = 0
        self.max_requests_per_hour = 100
        self.last_request_time = time.time()
        
        # User agent rotation
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
        ]
        
        # Error tracking
        self.consecutive_errors = 0
        self.max_consecutive_errors = 3
        
    def _configure_instaloader(self):
        """Configure instaloader with optimal settings"""
        try:
            # Basic configuration
            self.loader.context.request_timeout = 30.0
            self.loader.context.sleep = True
            self.loader.context.user_agent = self._get_random_user_agent()
            
            # Disable downloads we don't need
            self.loader.download_pictures = False
            self.loader.download_videos = False
            self.loader.download_video_thumbnails = False
            self.loader.download_geotags = False
            self.loader.download_comments = False
            self.loader.save_metadata = False
            
            # Rate limiting
            self.loader.context.sleep = True
            
        except Exception as e:
            self.logger.warning(f"Failed to configure instaloader: {e}")
    
    def _get_random_user_agent(self) -> str:
        """Get random user agent for anti-detection"""
        return random.choice(self.user_agents)
    
    def _should_rate_limit(self) -> bool:
        """Check if we should rate limit based on request count"""
        current_time = time.time()
        time_diff = current_time - self.last_request_time
        
        # Reset counter if an hour has passed
        if time_diff > 3600:
            self.request_count = 0
            self.last_request_time = current_time
        
        return self.request_count >= self.max_requests_per_hour
    
    def _intelligent_delay(self):
        """Intelligent delay with exponential backoff on errors"""
        if self.consecutive_errors > 0:
            # Exponential backoff on errors
            delay = self.max_delay * (2 ** self.consecutive_errors)
            delay = min(delay, 300)  # Max 5 minutes
        else:
            # Normal random delay
            delay = random.uniform(self.min_delay, self.max_delay)
        
        # Add extra delay if we're approaching rate limits
        if self.request_count > self.max_requests_per_hour * 0.8:
            delay *= 2
        
        self.logger.debug(f"Applying delay: {delay:.2f} seconds")
        time.sleep(delay)
        
        self.request_count += 1
    
    def _handle_rate_limit_error(self):
        """Handle rate limiting with progressive delays"""
        self.consecutive_errors += 1
        
        if self.consecutive_errors <= 3:
            delay = 300 * self.consecutive_errors  # 5, 10, 15 minutes
            self.logger.warning(f"Rate limited. Waiting {delay/60:.1f} minutes...")
            time.sleep(delay)
        else:
            delay = 3600  # 1 hour
            self.logger.error(f"Multiple rate limit errors. Waiting {delay/60:.0f} minutes...")
            time.sleep(delay)
    
    def _reset_error_count(self):
        """Reset error count after successful operation"""
        self.consecutive_errors = 0
    
    def scrape_influencer_profile(self, username: str) -> Dict:
        """
        Enhanced profile scraping with comprehensive error handling
        Returns: Basic Information (MANDATORY REQUIREMENTS)
        """
        try:
            self.logger.info(f"Starting enhanced profile scrape for @{username}")
            
            # Check rate limiting
            if self._should_rate_limit():
                self.logger.warning("Rate limit reached, waiting...")
                time.sleep(3600)  # Wait 1 hour
            
            # Apply intelligent delay
            self._intelligent_delay()
            
            # Rotate user agent
            self.loader.context.user_agent = self._get_random_user_agent()
            
            # Load profile with retry logic
            profile = self._load_profile_with_retry(username)
            
            if not profile:
                return {'scrape_success': False, 'error': 'Failed to load profile after retries'}
            
            # Extract comprehensive profile data
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
                
                # Additional profile info
                'external_url': profile.external_url or '',
                'is_professional_account': getattr(profile, 'is_professional_account', False),
                'category': getattr(profile, 'category', ''),
                
                # Metadata
                'last_scraped': timezone.now(),
                'scrape_success': True,
                'scraper_version': '2.0'
            }
            
            # Reset error count on success
            self._reset_error_count()
            
            self.logger.info(f"Profile scraped successfully: @{username} ({profile.followers:,} followers)")
            return profile_data
            
        except instaloader.exceptions.ProfileNotExistsException:
            self.logger.error(f"Profile @{username} does not exist")
            return {'scrape_success': False, 'error': 'Profile not found', 'error_type': 'not_found'}
            
        except instaloader.exceptions.PrivateProfileNotFollowedException:
            self.logger.error(f"Profile @{username} is private")
            return {'scrape_success': False, 'error': 'Private profile', 'error_type': 'private'}
            
        except instaloader.exceptions.TooManyRequestsException:
            self.logger.error(f"Rate limited while scraping @{username}")
            self._handle_rate_limit_error()
            return {'scrape_success': False, 'error': 'Rate limited', 'error_type': 'rate_limit'}
            
        except instaloader.exceptions.ConnectionException as e:
            self.logger.error(f"Connection error for @{username}: {e}")
            self.consecutive_errors += 1
            return {'scrape_success': False, 'error': f'Connection error: {str(e)}', 'error_type': 'connection'}
            
        except Exception as e:
            self.logger.error(f"Unexpected error scraping profile @{username}: {e}")
            self.consecutive_errors += 1
            return {'scrape_success': False, 'error': str(e), 'error_type': 'unknown'}
    
    def _load_profile_with_retry(self, username: str, max_retries: int = 3):
        """Load profile with retry logic"""
        for attempt in range(max_retries):
            try:
                profile = instaloader.Profile.from_username(self.loader.context, username)
                return profile
            except (instaloader.exceptions.ConnectionException, 
                    instaloader.exceptions.QueryReturnedBadRequestException) as e:
                if attempt < max_retries - 1:
                    delay = (attempt + 1) * 5  # Progressive delay
                    self.logger.warning(f"Retry {attempt + 1}/{max_retries} for @{username} after {delay}s delay")
                    time.sleep(delay)
                    continue
                else:
                    raise e
        return None
    
    def scrape_recent_posts(self, username: str, limit: int = 12) -> List[Dict]:
        """
        Enhanced post scraping with better error handling
        Returns: Recent posts with IMPORTANT REQUIREMENTS data
        """
        try:
            self.logger.info(f"Starting enhanced posts scrape for @{username}, limit: {limit}")
            
            profile = self._load_profile_with_retry(username)
            if not profile:
                self.logger.error(f"Could not load profile for posts scraping: @{username}")
                return []
            
            if profile.is_private:
                self.logger.warning(f"Cannot scrape posts from private profile: @{username}")
                return []
            
            posts_data = []
            posts_iterator = profile.get_posts()
            count = 0
            consecutive_failures = 0
            max_failures = 5
            
            for post in posts_iterator:
                if count >= limit:
                    break
                
                if consecutive_failures >= max_failures:
                    self.logger.warning(f"Too many consecutive post failures for @{username}")
                    break
                
                try:
                    # Apply delay between posts
                    self._intelligent_delay()
                    
                    # IMPORTANT post-level data with enhanced extraction
                    post_data = {
                        'post_id': str(post.mediaid),
                        'shortcode': post.shortcode,
                        'image_url': post.url,
                        'caption': post.caption or '',
                        
                        # IMPORTANT engagement data
                        'likes_count': post.likes,
                        'comments_count': post.comments,
                        'post_date': post.date_utc,
                        
                        # Enhanced post metadata
                        'is_video': post.is_video,
                        'video_url': post.video_url if post.is_video else None,
                        'typename': post.typename,
                        'accessibility_caption': getattr(post, 'accessibility_caption', ''),
                        
                        # Location data if available
                        'location': {
                            'name': post.location.name if post.location else None,
                            'id': post.location.id if post.location else None,
                        } if post.location else None,
                        
                        # Tagged users count (privacy-friendly)
                        'tagged_users_count': len(post.tagged_users) if hasattr(post, 'tagged_users') else 0,
                        
                        # Analysis placeholders for AI processing
                        'keywords': [],
                        'vibe_classification': None,
                        'quality_score': 0.0,
                        'is_analyzed': False,
                        
                        # Scraping metadata
                        'scraped_at': timezone.now().isoformat()
                    }
                    
                    posts_data.append(post_data)
                    count += 1
                    consecutive_failures = 0  # Reset on success
                    
                    self.logger.debug(f"Scraped post {count}/{limit}: {post.shortcode}")
                    
                except Exception as e:
                    consecutive_failures += 1
                    self.logger.warning(f"Error scraping post {post.shortcode}: {e}")
                    continue
            
            # Reset error count on successful completion
            if posts_data:
                self._reset_error_count()
            
            self.logger.info(f"Scraped {len(posts_data)} posts for @{username}")
            return posts_data
            
        except Exception as e:
            self.logger.error(f"Posts scraping failed for @{username}: {e}")
            self.consecutive_errors += 1
            return []
    
    def scrape_recent_reels(self, username: str, limit: int = 8) -> List[Dict]:
        """
        Enhanced reel scraping with video-specific data extraction
        Returns: Recent reels with ADVANCED REQUIREMENTS data
        """
        try:
            self.logger.info(f"Starting enhanced reels scrape for @{username}, limit: {limit}")
            
            profile = self._load_profile_with_retry(username)
            if not profile:
                self.logger.error(f"Could not load profile for reels scraping: @{username}")
                return []
            
            if profile.is_private:
                self.logger.warning(f"Cannot scrape reels from private profile: @{username}")
                return []
            
            reels_data = []
            posts_iterator = profile.get_posts()
            count = 0
            processed_posts = 0
            max_posts_to_check = limit * 3  # Check more posts to find reels
            
            for post in posts_iterator:
                if count >= limit or processed_posts >= max_posts_to_check:
                    break
                
                processed_posts += 1
                
                # Only process videos
                if not post.is_video:
                    continue
                
                try:
                    # Apply delay between requests
                    self._intelligent_delay()
                    
                    # Enhanced reel detection
                    is_reel = self._is_reel(post)
                    
                    if is_reel:
                        # ADVANCED reel data with comprehensive extraction
                        reel_data = {
                            'reel_id': str(post.mediaid),
                            'shortcode': post.shortcode,
                            'video_url': post.video_url,
                            'thumbnail_url': post.url,
                            'caption': post.caption or '',
                            
                            # ADVANCED engagement data
                            'views_count': getattr(post, 'video_view_count', 0) or 0,
                            'likes_count': post.likes,
                            'comments_count': post.comments,
                            'post_date': post.date_utc,
                            
                            # Enhanced video metadata
                            'duration': int(post.video_duration) if post.video_duration else 0,
                            'typename': post.typename,
                            'accessibility_caption': getattr(post, 'accessibility_caption', ''),
                            
                            # Location data
                            'location': {
                                'name': post.location.name if post.location else None,
                                'id': post.location.id if post.location else None,
                            } if post.location else None,
                            
                            # Audio/music info if available
                            'has_audio': True,  # Assume reels have audio
                            'music_metadata': self._extract_music_info(post),
                            
                            # Tagged users count
                            'tagged_users_count': len(post.tagged_users) if hasattr(post, 'tagged_users') else 0,
                            
                            # Analysis placeholders for AI processing
                            'detected_events': [],
                            'vibe_classification': None,
                            'descriptive_tags': [],
                            'is_analyzed': False,
                            
                            # Scraping metadata
                            'scraped_at': timezone.now().isoformat()
                        }
                        
                        reels_data.append(reel_data)
                        count += 1
                        
                        self.logger.debug(f"Scraped reel {count}/{limit}: {post.shortcode}")
                    
                except Exception as e:
                    self.logger.warning(f"Error scraping reel {post.shortcode}: {e}")
                    continue
            
            # Reset error count on successful completion
            if reels_data:
                self._reset_error_count()
            
            self.logger.info(f"Scraped {len(reels_data)} reels for @{username} (checked {processed_posts} posts)")
            return reels_data
            
        except Exception as e:
            self.logger.error(f"Reels scraping failed for @{username}: {e}")
            self.consecutive_errors += 1
            return []
    
    def _is_reel(self, post) -> bool:
        """Enhanced reel detection logic"""
        try:
            # Check typename first (most reliable)
            if hasattr(post, 'typename') and post.typename in ['GraphVideo', 'GraphSidecar']:
                # Check if it's specifically a reel
                if hasattr(post, 'is_video') and post.is_video:
                    # Duration-based detection (reels are typically 15-90 seconds)
                    if post.video_duration and 5 <= post.video_duration <= 90:
                        return True
                    
                    # If no duration info, assume it's a reel if it's a short video
                    if not post.video_duration:
                        return True
            
            # Additional checks based on URL patterns or other indicators
            if hasattr(post, 'video_url') and post.video_url:
                # Some URL patterns might indicate reels
                if 'stories' not in post.video_url.lower():
                    return True
            
            return False
            
        except Exception as e:
            self.logger.debug(f"Error in reel detection: {e}")
            return False
    
    def _extract_music_info(self, post) -> Dict:
        """Extract music/audio information from reel"""
        try:
            # This would require additional API calls or parsing
            # For now, return placeholder structure
            return {
                'has_music': None,  # Unknown
                'artist': None,
                'title': None,
                'is_original_audio': None
            }
        except Exception:
            return {}
    
    def scrape_complete_profile(self, username: str) -> Dict:
        """
        Complete enhanced scraping for ALL REQUIREMENTS
        Returns: All data needed for the web application with comprehensive error handling
        """
        try:
            self.logger.info(f"Starting complete enhanced scrape for @{username}")
            start_time = time.time()
            
            # Step 1: Scrape profile info (MANDATORY)
            self.logger.info("Step 1: Scraping profile information...")
            profile_data = self.scrape_influencer_profile(username)
            
            if not profile_data.get('scrape_success'):
                self.logger.error(f"Profile scraping failed: {profile_data.get('error')}")
                return profile_data
            
            # Step 2: Scrape posts (IMPORTANT) - Get extra to ensure we meet requirements
            self.logger.info("Step 2: Scraping posts...")
            posts_data = self.scrape_recent_posts(username, limit=15)  # Get 15 for >10 requirement
            
            # Step 3: Scrape reels (ADVANCED) - Get extra to ensure we meet requirements
            self.logger.info("Step 3: Scraping reels...")
            reels_data = self.scrape_recent_reels(username, limit=10)   # Get 10 for >5 requirement
            
            # Calculate completion metrics
            end_time = time.time()
            scrape_duration = end_time - start_time
            
            # Combine all data with comprehensive summary
            complete_data = {
                **profile_data,
                'posts': posts_data,
                'reels': reels_data,
                'scrape_summary': {
                    'total_posts_scraped': len(posts_data),
                    'total_reels_scraped': len(reels_data),
                    'scraping_started_at': (start_time * 1000),  # Unix timestamp
                    'scraping_completed_at': timezone.now().isoformat(),
                    'scrape_duration_seconds': round(scrape_duration, 2),
                    'scraper_version': '2.0',
                    'requirements_met': {
                        'basic_information': True,
                        'recent_posts_10_plus': len(posts_data) >= 10,
                        'recent_reels_5_plus': len(reels_data) >= 5,
                        'all_requirements_met': len(posts_data) >= 10 and len(reels_data) >= 5
                    },
                    'data_quality': {
                        'posts_with_engagement': sum(1 for p in posts_data if p.get('likes_count', 0) > 0),
                        'reels_with_views': sum(1 for r in reels_data if r.get('views_count', 0) > 0),
                        'content_with_captions': sum(1 for item in posts_data + reels_data if item.get('caption')),
                    },
                    'next_recommended_scrape': (timezone.now() + timedelta(hours=24)).isoformat()
                }
            }
            
            # Log comprehensive completion summary
            summary = complete_data['scrape_summary']
            requirements = summary['requirements_met']
            
            self.logger.info(f"Complete scraping finished for @{username}")
            self.logger.info(f"  ✅ Profile: Success")
            self.logger.info(f"  📸 Posts: {len(posts_data)} (requirement: ≥10) - {'✅' if requirements['recent_posts_10_plus'] else '❌'}")
            self.logger.info(f"  🎬 Reels: {len(reels_data)} (requirement: ≥5) - {'✅' if requirements['recent_reels_5_plus'] else '❌'}")
            self.logger.info(f"  ⏱️  Duration: {scrape_duration:.1f}s")
            self.logger.info(f"  🎯 All Requirements Met: {'✅' if requirements['all_requirements_met'] else '❌'}")
            
            return complete_data
            
        except Exception as e:
            self.logger.error(f"Complete scraping failed for @{username}: {e}")
            return {
                'scrape_success': False, 
                'error': str(e),
                'error_type': 'complete_scrape_failure',
                'partial_data_available': False
            }
    
    def get_scraper_status(self) -> Dict:
        """Get current scraper status and health"""
        return {
            'scraper_version': '2.0',
            'consecutive_errors': self.consecutive_errors,
            'requests_this_hour': self.request_count,
            'max_requests_per_hour': self.max_requests_per_hour,
            'current_user_agent': self.loader.context.user_agent,
            'rate_limit_active': self._should_rate_limit(),
            'last_request_time': self.last_request_time,
            'status': 'healthy' if self.consecutive_errors < self.max_consecutive_errors else 'degraded'
        }
    
    def reset_scraper_state(self):
        """Reset scraper state (useful for recovery)"""
        self.consecutive_errors = 0
        self.request_count = 0
        self.last_request_time = time.time()
        self.loader.context.user_agent = self._get_random_user_agent()
        self.logger.info("Scraper state reset successfully")
