import requests
import json
import time
import random
from urllib.parse import quote
from django.conf import settings
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import logging

logger = logging.getLogger('scraping')

class AdvancedInstagramScraper:
    """
    Production-ready Instagram scraper
    CRITICAL: This is what makes the app functional
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.driver = None
        self._setup_session()
        self._setup_selenium()
    
    def _setup_selenium(self):
        """Setup Selenium WebDriver for advanced scraping"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        self.driver = webdriver.Chrome(
            service=webdriver.chrome.service.Service(ChromeDriverManager().install()),
            options=chrome_options
        )
        
        # Execute script to remove webdriver property
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    def scrape_user_profile(self, username: str) -> dict:
        """
        Scrape comprehensive user profile data
        THIS IS THE CORE FUNCTIONALITY
        """
        try:
            url = f"https://www.instagram.com/{username}/"
            self.driver.get(url)
            time.sleep(random.uniform(3, 6))
            
            # Extract profile data using Selenium
            profile_data = {
                'username': username,
                'full_name': self._safe_extract_text('h2'),
                'biography': self._safe_extract_text('[data-testid="user-bio"]'),
                'followers_count': self._extract_count('followers'),
                'following_count': self._extract_count('following'),
                'posts_count': self._extract_count('posts'),
                'is_verified': self._check_verification(),
                'is_private': self._check_privacy(),
                'profile_pic_url': self._extract_profile_pic(),
            }
            
            return profile_data
            
        except Exception as e:
            logger.error(f"Profile scraping failed for {username}: {str(e)}")
            return None
    
    def scrape_user_posts(self, username: str, max_posts: int = 12) -> list:
        """Scrape user posts with full metadata"""
        try:
            posts = []
            url = f"https://www.instagram.com/{username}/"
            self.driver.get(url)
            time.sleep(random.uniform(3, 6))
            
            # Click on first post
            first_post = self.driver.find_element(By.CSS_SELECTOR, 'article a')
            first_post.click()
            time.sleep(2)
            
            for i in range(max_posts):
                post_data = self._extract_post_data()
                if post_data:
                    posts.append(post_data)
                
                # Navigate to next post
                try:
                    next_button = self.driver.find_element(By.CSS_SELECTOR, '[aria-label="Next"]')
                    next_button.click()
                    time.sleep(random.uniform(2, 4))
                except:
                    break  # No more posts
            
            return posts
            
        except Exception as e:
            logger.error(f"Posts scraping failed for {username}: {str(e)}")
            return []
    
    def _extract_post_data(self) -> dict:
        """Extract data from current post"""
        try:
            return {
                'post_id': self._extract_post_id(),
                'shortcode': self._extract_shortcode(),
                'image_url': self._extract_image_url(),
                'caption': self._extract_caption(),
                'likes_count': self._extract_likes_count(),
                'comments_count': self._extract_comments_count(),
                'post_date': self._extract_post_date(),
                'is_video': self._check_is_video(),
            }
        except Exception as e:
            logger.error(f"Post data extraction failed: {str(e)}")
            return None
    
    def close(self):
        """Clean up resources"""
        if self.driver:
            self.driver.quit()
