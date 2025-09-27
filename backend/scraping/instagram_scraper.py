import requests
import json
import time
import random
import logging
from urllib.parse import quote
from django.conf import settings
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from fake_useragent import UserAgent
import undetected_chromedriver as uc
from datetime import datetime
import instaloader

logger = logging.getLogger('scraping')

class InstagramScraper:
    """
    WORKING Instagram scraper using multiple methods for 2025
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.driver = None
        self.insta_loader = instaloader.Instaloader()
        self._setup_session()
        self.ua = UserAgent()
        
    def _setup_session(self):
        """Setup requests session with rotating headers"""
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
        })
    
    def _setup_selenium(self):
        """Setup undetected Chrome driver"""
        try:
            options = uc.ChromeOptions()
            options.add_argument('--headless')
            options.add_argument('--no-sandbox')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--disable-blink-features=AutomationControlled')
            options.add_argument(f'--user-agent={self.ua.random}')
            
            self.driver = uc.Chrome(options=options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            return True
        except Exception as e:
            logger.error(f"Failed to setup Selenium: {e}")
            return False
    
    def scrape_user_profile(self, username: str) -> dict:
        """
        WORKING method to scrape user profile using Instaloader + GraphQL fallback
        """
        try:
            # Method 1: Try Instaloader (most reliable)
            profile_data = self._scrape_with_instaloader(username)
            if profile_data:
                return profile_data
            
            # Method 2: Try GraphQL API
            profile_data = self._scrape_with_graphql(username)
            if profile_data:
                return profile_data
            
            # Method 3: Try Selenium as fallback
            profile_data = self._scrape_with_selenium(username)
            return profile_data
            
        except Exception as e:
            logger.error(f"All profile scraping methods failed for {username}: {e}")
            return None
    
    def _scrape_with_instaloader(self, username: str) -> dict:
        """Use Instaloader library - most reliable method"""
        try:
            profile = instaloader.Profile.from_username(self.insta_loader.context, username)
            
            return {
                'username': profile.username,
                'full_name': profile.full_name or '',
                'biography': profile.biography or '',
                'profile_pic_url': profile.profile_pic_url,
                'followers_count': profile.followers,
                'following_count': profile.followees,
                'posts_count': profile.mediacount,
                'is_verified': profile.is_verified,
                'is_private': profile.is_private,
                'website': profile.external_url or '',
            }
        except Exception as e:
            logger.warning(f"Instaloader failed for {username}: {e}")
            return None
    
    def _scrape_with_graphql(self, username: str) -> dict:
        """Use Instagram GraphQL API - working 2025 method"""
        try:
            url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={username}"
            headers = {
                'User-Agent': self.ua.random,
                'x-ig-app-id': '936619743392459',
                'x-requested-with': 'XMLHttpRequest',
                'x-asbd-id': '198387',
                'x-ig-www-claim': '0',
            }
            
            response = self.session.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()['data']['user']
                return {
                    'username': data.get('username'),
                    'full_name': data.get('full_name', ''),
                    'biography': data.get('biography', ''),
                    'profile_pic_url': data.get('profile_pic_url_hd', ''),
                    'followers_count': data['edge_followed_by']['count'],
                    'following_count': data['edge_follow']['count'],
                    'posts_count': data['edge_owner_to_timeline_media']['count'],
                    'is_verified': data.get('is_verified', False),
                    'is_private': data.get('is_private', False),
                    'website': data.get('external_url', ''),
                }
            
            return None
            
        except Exception as e:
            logger.warning(f"GraphQL scraping failed for {username}: {e}")
            return None
    
    def scrape_user_posts(self, username: str, max_posts: int = 12) -> list:
        """
        WORKING method to scrape user posts
        """
        try:
            # Method 1: Try Instaloader
            posts = self._scrape_posts_instaloader(username, max_posts)
            if posts:
                return posts
            
            # Method 2: Try GraphQL
            posts = self._scrape_posts_graphql(username, max_posts)
            return posts
            
        except Exception as e:
            logger.error(f"Post scraping failed for {username}: {e}")
            return []
    
    def _scrape_posts_instaloader(self, username: str, max_posts: int) -> list:
        """Scrape posts using Instaloader"""
        try:
            profile = instaloader.Profile.from_username(self.insta_loader.context, username)
            posts = []
            
            for post in profile.get_posts():
                if len(posts) >= max_posts:
                    break
                
                posts.append({
                    'post_id': str(post.mediaid),
                    'shortcode': post.shortcode,
                    'image_url': post.url,
                    'caption': post.caption or '',
                    'likes_count': post.likes,
                    'comments_count': post.comments,
                    'post_date': int(post.date.timestamp()),
                    'is_video': post.is_video,
                })
                
                # Add delay to avoid rate limiting
                time.sleep(random.uniform(1, 3))
            
            return posts
            
        except Exception as e:
            logger.warning(f"Instaloader post scraping failed: {e}")
            return []
    
    def _scrape_posts_graphql(self, username: str, max_posts: int) -> list:
        """Scrape posts using GraphQL API"""
        try:
            # First get user ID
            profile_url = f"https://www.instagram.com/{username}/"
            response = self.session.get(profile_url)
            
            # Extract user ID from page source
            if 'profilePage_' in response.text:
                start = response.text.find('profilePage_') + 12
                end = response.text.find('"', start)
                user_id = response.text[start:end]
            else:
                return []
            
            # Get posts using GraphQL
            variables = json.dumps({
                'id': user_id,
                'first': max_posts,
            })
            
            graphql_url = "https://www.instagram.com/graphql/query/"
            params = {
                'query_hash': 'e769aa130647d2354c40ea6a439bfc08',
                'variables': variables
            }
            
            headers = {
                'User-Agent': self.ua.random,
                'x-ig-app-id': '936619743392459',
            }
            
            response = self.session.get(graphql_url, params=params, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                posts = []
                
                for edge in data['data']['user']['edge_owner_to_timeline_media']['edges']:
                    node = edge['node']
                    caption = ''
                    
                    if node.get('edge_media_to_caption', {}).get('edges'):
                        caption = node['edge_media_to_caption']['edges'][0]['node']['text']
                    
                    posts.append({
                        'post_id': node['id'],
                        'shortcode': node['shortcode'],
                        'image_url': node['display_url'],
                        'caption': caption,
                        'likes_count': node['edge_liked_by']['count'],
                        'comments_count': node['edge_media_to_comment']['count'],
                        'post_date': node['taken_at_timestamp'],
                        'is_video': node['is_video'],
                    })
                
                return posts
            
            return []
            
        except Exception as e:
            logger.warning(f"GraphQL posts scraping failed: {e}")
            return []
    
    def scrape_user_reels(self, username: str, max_reels: int = 5) -> list:
        """
        WORKING method to scrape user reels
        """
        try:
            profile = instaloader.Profile.from_username(self.insta_loader.context, username)
            reels = []
            
            # Get posts and filter for videos/reels
            for post in profile.get_posts():
                if len(reels) >= max_reels:
                    break
                
                if post.is_video:
                    reels.append({
                        'reel_id': str(post.mediaid),
                        'shortcode': post.shortcode,
                        'video_url': post.video_url,
                        'thumbnail_url': post.url,
                        'caption': post.caption or '',
                        'views_count': post.video_view_count or 0,
                        'likes_count': post.likes,
                        'comments_count': post.comments,
                        'post_date': int(post.date.timestamp()),
                        'duration': post.video_duration or 0,
                    })
                    
                    time.sleep(random.uniform(1, 3))
            
            return reels
            
        except Exception as e:
            logger.error(f"Reel scraping failed for {username}: {e}")
            return []
    
    def close(self):
        """Clean up resources"""
        if self.driver:
            self.driver.quit()
