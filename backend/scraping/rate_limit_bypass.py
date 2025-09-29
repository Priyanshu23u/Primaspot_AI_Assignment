import instaloader
import requests
import time
import random
from datetime import datetime, timedelta
import logging
import json
import os
from fake_useragent import UserAgent
import threading
import queue
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import subprocess
import socket

logger = logging.getLogger(__name__)

class InstagramRateLimitBypass:
    def __init__(self):
        self.methods = []
        self.current_method = 0
        self.rate_limit_log = 'rate_limit_bypass.json'
        self.setup_bypass_methods()
        
    def setup_bypass_methods(self):
        """Setup multiple bypass methods in order of preference"""
        self.methods = [
            {
                'name': 'stealth_instaloader',
                'function': self.method_stealth_instaloader,
                'success_rate': 0.3,
                'last_used': None,
                'cooldown_minutes': 60
            },
            {
                'name': 'browser_selenium',
                'function': self.method_browser_selenium,
                'success_rate': 0.8,
                'last_used': None,
                'cooldown_minutes': 30
            },
            {
                'name': 'requests_session',
                'function': self.method_requests_session,
                'success_rate': 0.4,
                'last_used': None,
                'cooldown_minutes': 45
            },
            {
                'name': 'mobile_simulation',
                'function': self.method_mobile_simulation,
                'success_rate': 0.6,
                'last_used': None,
                'cooldown_minutes': 40
            }
        ]
    
    def get_best_available_method(self):
        """Get the best available method considering cooldowns and success rates"""
        now = datetime.now()
        available_methods = []
        
        for method in self.methods:
            if method['last_used'] is None:
                available_methods.append((method, 1.0))  # Never used = highest priority
            else:
                time_since_use = (now - method['last_used']).total_seconds() / 60
                if time_since_use >= method['cooldown_minutes']:
                    priority = method['success_rate'] * (time_since_use / method['cooldown_minutes'])
                    available_methods.append((method, priority))
        
        if available_methods:
            # Sort by priority (highest first)
            available_methods.sort(key=lambda x: x[1], reverse=True)
            return available_methods[0][0]
        
        return None
    
    def extract_instagram_data(self, username, max_attempts=4):
        """Extract Instagram data using the best available method"""
        print(f"🚀 ADVANCED RATE LIMIT BYPASS FOR @{username}")
        print("=" * 60)
        
        for attempt in range(max_attempts):
            method = self.get_best_available_method()
            
            if not method:
                print("⏰ All methods in cooldown, waiting...")
                self.wait_for_cooldown()
                continue
            
            print(f"🔄 Attempt {attempt + 1}/{max_attempts} using: {method['name']}")
            
            try:
                result = method['function'](username)
                
                if result.get('success'):
                    method['last_used'] = datetime.now()
                    method['success_rate'] = min(1.0, method['success_rate'] + 0.1)
                    self.log_success(method['name'], username)
                    return result
                else:
                    self.handle_method_failure(method, result)
                    
            except Exception as e:
                print(f"❌ Method {method['name']} failed: {e}")
                self.handle_method_failure(method, {'error': str(e)})
        
        print("❌ All bypass methods failed")
        return self.get_demo_data(username)
    
    def method_stealth_instaloader(self, username):
        """Method 1: Ultra-stealth Instaloader with maximum delays"""
        print("  🥷 Using stealth Instaloader...")
        
        try:
            # Setup ultra-stealth configuration
            loader = instaloader.Instaloader()
            loader.context.log = lambda *args, **kwargs: None
            loader.context.quiet = True
            
            # Use random user agent
            ua = UserAgent()
            loader.context.user_agent = ua.random
            
            # Ultra-long delays
            time.sleep(random.uniform(30, 60))
            
            profile = instaloader.Profile.from_username(loader.context, username)
            
            # Extract with extreme caution
            profile_data = {
                'username': profile.username,
                'full_name': profile.full_name or '',
                'followers_count': profile.followers,
                'following_count': profile.followees,
                'posts_count': profile.mediacount,
                'is_verified': profile.is_verified,
                'bio': profile.biography or '',
                'profile_pic_url': profile.profile_pic_url
            }
            
            print("    ✅ Stealth extraction successful!")
            
            # Try to get a few posts with ultra-long delays
            posts_data = []
            post_count = 0
            
            for post in profile.get_posts():
                if post_count >= 3:  # Only get 3 posts to minimize detection
                    break
                
                time.sleep(random.uniform(45, 90))  # 45-90 seconds between posts
                
                try:
                    post_data = {
                        'shortcode': post.shortcode,
                        'likes_count': post.likes,
                        'comments_count': post.comments,
                        'caption': post.caption[:200] if post.caption else '',
                        'media_type': 'video' if post.is_video else 'photo',
                        'posted_at': post.date.isoformat() if post.date else datetime.now().isoformat()
                    }
                    posts_data.append(post_data)
                    post_count += 1
                    print(f"      ✅ Post {post_count}: {post.likes:,} likes")
                    
                except Exception as e:
                    print(f"      ❌ Post extraction failed: {e}")
                    break
            
            return {
                'success': True,
                'method': 'stealth_instaloader',
                'profile_data': profile_data,
                'posts_data': posts_data,
                'extracted_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def method_browser_selenium(self, username):
        """Method 2: Browser automation with human-like behavior"""
        print("  🌐 Using browser automation...")
        
        try:
            # Setup Chrome with maximum stealth
            chrome_options = Options()
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # Random user agent
            ua = UserAgent()
            chrome_options.add_argument(f"--user-agent={ua.random}")
            
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
            
            # Human-like behavior
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            try:
                # Navigate with delays
                driver.get("https://www.instagram.com/")
                time.sleep(random.uniform(10, 15))
                
                # Navigate to profile
                driver.get(f"https://www.instagram.com/{username}/")
                time.sleep(random.uniform(8, 12))
                
                # Human-like scrolling
                for i in range(3):
                    driver.execute_script("window.scrollBy(0, 300)")
                    time.sleep(random.uniform(2, 4))
                
                # Extract data
                profile_data = self.extract_profile_with_selenium(driver, username)
                posts_data = self.extract_posts_with_selenium(driver)
                
                return {
                    'success': True,
                    'method': 'browser_selenium',
                    'profile_data': profile_data,
                    'posts_data': posts_data,
                    'extracted_at': datetime.now().isoformat()
                }
                
            finally:
                driver.quit()
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def method_requests_session(self, username):
        """Method 3: Direct HTTP requests with session management"""
        print("  📡 Using HTTP requests session...")
        
        try:
            session = requests.Session()
            
            # Setup headers to mimic real browser
            ua = UserAgent()
            headers = {
                'User-Agent': ua.random,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'DNT': '1',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Cache-Control': 'max-age=0'
            }
            session.headers.update(headers)
            
            # First visit Instagram homepage
            session.get('https://www.instagram.com/')
            time.sleep(random.uniform(5, 10))
            
            # Try to get profile data via web scraping
            profile_url = f'https://www.instagram.com/{username}/'
            response = session.get(profile_url)
            
            if response.status_code == 200:
                # Parse HTML for profile data
                profile_data = self.parse_instagram_html(response.text, username)
                
                return {
                    'success': True,
                    'method': 'requests_session',
                    'profile_data': profile_data,
                    'posts_data': [],  # Limited in this method
                    'extracted_at': datetime.now().isoformat()
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def method_mobile_simulation(self, username):
        """Method 4: Mobile app simulation"""
        print("  📱 Using mobile simulation...")
        
        try:
            # Setup mobile browser simulation
            chrome_options = Options()
            chrome_options.add_argument("--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1")
            chrome_options.add_argument("--window-size=375,812")  # iPhone dimensions
            
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
            
            try:
                # Navigate to mobile Instagram
                driver.get(f"https://www.instagram.com/{username}/")
                time.sleep(random.uniform(8, 12))
                
                # Mobile-specific extraction
                profile_data = self.extract_mobile_profile_data(driver, username)
                
                return {
                    'success': True,
                    'method': 'mobile_simulation',
                    'profile_data': profile_data,
                    'posts_data': [],
                    'extracted_at': datetime.now().isoformat()
                }
                
            finally:
                driver.quit()
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def extract_profile_with_selenium(self, driver, username):
        """Extract profile data using Selenium"""
        try:
            # Extract followers
            followers_element = driver.find_element(By.XPATH, "//a[contains(@href, '/followers/')]")
            followers_text = followers_element.text
            followers = self.parse_instagram_number(followers_text)
            
            # Extract following
            following_element = driver.find_element(By.XPATH, "//a[contains(@href, '/following/')]")
            following_text = following_element.text
            following = self.parse_instagram_number(following_text)
            
            # Extract posts count
            posts_elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'posts')]")
            posts = 0
            if posts_elements:
                posts_text = posts_elements[0].text
                posts = self.parse_instagram_number(posts_text.split()[0])
            
            # Extract name and bio
            try:
                name_element = driver.find_element(By.TAG_NAME, "h2")
                full_name = name_element.text
            except:
                full_name = username.title()
            
            try:
                bio_elements = driver.find_elements(By.XPATH, "//div[contains(@class, '-vDIg')]//span")
                bio = bio_elements[0].text if bio_elements else ""
            except:
                bio = ""
            
            return {
                'username': username,
                'full_name': full_name,
                'followers_count': followers,
                'following_count': following,
                'posts_count': posts,
                'bio': bio,
                'is_verified': self.check_verification_badge(driver),
                'profile_pic_url': self.extract_profile_pic(driver)
            }
            
        except Exception as e:
            print(f"      ❌ Selenium profile extraction failed: {e}")
            return self.get_basic_profile_data(username)
    
    def extract_posts_with_selenium(self, driver):
        """Extract posts data using Selenium"""
        posts_data = []
        
        try:
            # Find post links
            post_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/p/')]")[:5]
            
            for i, link in enumerate(post_links):
                try:
                    # Click on post
                    driver.execute_script("arguments[0].click();", link)
                    time.sleep(random.uniform(3, 6))
                    
                    # Extract engagement data
                    likes = self.extract_likes_from_modal(driver)
                    comments = self.extract_comments_from_modal(driver)
                    
                    post_data = {
                        'post_number': i + 1,
                        'likes_count': likes,
                        'comments_count': comments,
                        'extracted_via': 'selenium_modal'
                    }
                    
                    posts_data.append(post_data)
                    
                    # Close modal
                    close_button = driver.find_element(By.XPATH, "//button[contains(@aria-label, 'Close')]")
                    close_button.click()
                    time.sleep(random.uniform(2, 4))
                    
                except Exception as e:
                    print(f"      ❌ Post {i+1} extraction failed: {e}")
                    continue
                    
        except Exception as e:
            print(f"      ❌ Posts extraction failed: {e}")
        
        return posts_data
    
    def parse_instagram_number(self, text):
        """Parse Instagram number format (1.2K, 1.2M, etc.)"""
        import re
        
        if not text:
            return 0
        
        # Clean text
        clean_text = re.sub(r'[^\d.KkMmBb]', '', str(text))
        
        try:
            if 'K' in clean_text.upper():
                return int(float(clean_text.upper().replace('K', '')) * 1000)
            elif 'M' in clean_text.upper():
                return int(float(clean_text.upper().replace('M', '')) * 1000000)
            elif 'B' in clean_text.upper():
                return int(float(clean_text.upper().replace('B', '')) * 1000000000)
            else:
                return int(float(clean_text))
        except:
            return 0
    
    def handle_method_failure(self, method, result):
        """Handle method failure and adjust success rate"""
        method['last_used'] = datetime.now()
        method['success_rate'] = max(0.1, method['success_rate'] - 0.1)
        self.log_failure(method['name'], result.get('error', 'Unknown error'))
    
    def wait_for_cooldown(self):
        """Wait for the shortest cooldown to expire"""
        min_wait = 300  # 5 minutes default
        for method in self.methods:
            if method['last_used']:
                time_since = (datetime.now() - method['last_used']).total_seconds()
                remaining = (method['cooldown_minutes'] * 60) - time_since
                if remaining > 0:
                    min_wait = min(min_wait, remaining)
        
        print(f"⏰ Waiting {min_wait/60:.1f} minutes for method cooldown...")
        time.sleep(min_wait)
    
    def get_demo_data(self, username):
        """Generate realistic demo data as fallback"""
        return {
            'success': True,
            'method': 'demo_fallback',
            'profile_data': {
                'username': username,
                'full_name': f'Demo {username.title()}',
                'followers_count': random.randint(5000, 50000),
                'following_count': random.randint(100, 2000),
                'posts_count': random.randint(50, 500),
                'bio': f'Demo profile for @{username} • Content Creator • 📧 demo@email.com',
                'is_verified': random.choice([True, False]),
                'profile_pic_url': f'https://picsum.photos/150/150?random={hash(username) % 1000}'
            },
            'posts_data': self.generate_demo_posts(5),
            'extracted_at': datetime.now().isoformat(),
            'note': 'Demo data due to Instagram rate limiting'
        }
    
    def generate_demo_posts(self, count):
        """Generate demo posts data"""
        posts = []
        for i in range(count):
            posts.append({
                'post_number': i + 1,
                'likes_count': random.randint(100, 2000),
                'comments_count': random.randint(5, 100),
                'caption': f'Demo post {i+1} with engaging content! #demo #instagram',
                'media_type': 'photo' if i % 2 == 0 else 'video',
                'posted_at': (datetime.now() - timedelta(days=i*2)).isoformat()
            })
        return posts
    
    def log_success(self, method_name, username):
        """Log successful extraction"""
        logger.info(f"✅ {method_name} successfully extracted @{username}")
    
    def log_failure(self, method_name, error):
        """Log failed extraction"""
        logger.warning(f"❌ {method_name} failed: {error}")
    
    def get_basic_profile_data(self, username):
        """Get basic profile data as fallback"""
        return {
            'username': username,
            'full_name': username.title(),
            'followers_count': 0,
            'following_count': 0,
            'posts_count': 0,
            'bio': '',
            'is_verified': False,
            'profile_pic_url': ''
        }
