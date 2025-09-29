import instaloader
import requests
import time
import random
from datetime import datetime, timedelta
import logging
from fake_useragent import UserAgent
import json
import os

logger = logging.getLogger(__name__)

class AdvancedInstagramScraper:
    def __init__(self):
        self.loader = instaloader.Instaloader()
        
        # Enhanced anti-detection settings
        self.setup_stealth_mode()
        
        # Adaptive delays based on success/failure
        self.base_delay = 10
        self.max_delay = 300  # 5 minutes max
        self.current_delay = self.base_delay
        
        # Success tracking for adaptive behavior
        self.success_count = 0
        self.failure_count = 0
        
        # Session management
        self.session_start = datetime.now()
        self.requests_this_session = 0
        self.max_requests_per_session = 5
        
        logger.info('🥷 Advanced Instagram scraper initialized')
    
    def setup_stealth_mode(self):
        """Configure maximum stealth settings"""
        self.loader.context.log = lambda *args, **kwargs: None
        self.loader.context.quiet = True
        
        # Use random user agent
        try:
            ua = UserAgent()
            self.user_agent = ua.random
        except:
            self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        
        # Session configuration
        self.loader.context.user_agent = self.user_agent
    
    def adaptive_delay(self, base_multiplier=1.0):
        """Smart delay system that adapts to Instagram's responses"""
        
        # Calculate delay based on recent success/failure ratio
        if self.failure_count > 0:
            failure_ratio = self.failure_count / max(1, self.success_count + self.failure_count)
            delay_multiplier = 1 + (failure_ratio * 5)  # Increase delay if failing
        else:
            delay_multiplier = 0.5  # Reduce delay if succeeding
        
        # Calculate final delay
        calculated_delay = self.current_delay * delay_multiplier * base_multiplier
        final_delay = min(max(calculated_delay, self.base_delay), self.max_delay)
        
        # Add random variation
        random_factor = random.uniform(0.8, 1.5)
        final_delay = final_delay * random_factor
        
        print(f"🔄 Adaptive delay: {final_delay:.1f}s (success: {self.success_count}, failures: {self.failure_count})")
        time.sleep(final_delay)
        
        return final_delay
    
    def check_session_limits(self):
        """Check if we need to reset session"""
        session_duration = datetime.now() - self.session_start
        
        if (self.requests_this_session >= self.max_requests_per_session or 
            session_duration > timedelta(hours=1)):
            
            print("🔄 Session limits reached, taking extended break...")
            
            # Extended break between sessions
            break_time = random.uniform(300, 900)  # 5-15 minutes
            print(f"😴 Extended break: {break_time/60:.1f} minutes")
            time.sleep(break_time)
            
            # Reset session
            self.session_start = datetime.now()
            self.requests_this_session = 0
            self.setup_stealth_mode()  # Refresh stealth settings
            
            return True
        return False
    
    def smart_retry_scrape(self, username, max_attempts=5):
        """Advanced retry system with exponential backoff"""
        
        for attempt in range(max_attempts):
            try:
                print(f"🎯 Attempt {attempt + 1}/{max_attempts} for @{username}")
                
                # Check session limits
                self.check_session_limits()
                
                # Progressive delay increase
                delay_multiplier = (attempt + 1) ** 1.5  # Exponential backoff
                self.adaptive_delay(delay_multiplier)
                
                # Attempt scraping
                profile = instaloader.Profile.from_username(self.loader.context, username)
                
                # Success! Update tracking
                self.success_count += 1
                self.requests_this_session += 1
                self.current_delay = max(self.base_delay, self.current_delay * 0.9)  # Reduce delay on success
                
                profile_data = {
                    'username': profile.username,
                    'full_name': profile.full_name or '',
                    'bio': profile.biography or '',
                    'followers_count': profile.followers,
                    'following_count': profile.followees,
                    'posts_count': profile.mediacount,
                    'is_verified': profile.is_verified,
                    'is_private': profile.is_private,
                    'scraping_success': True,
                    'attempt_number': attempt + 1,
                    'scraped_at': datetime.now(),
                    'scraping_method': 'advanced_stealth',
                    'success_rate': f"{self.success_count}/{self.success_count + self.failure_count}"
                }
                
                print(f"✅ SUCCESS on attempt {attempt + 1}!")
                return profile_data
                
            except Exception as e:
                error_msg = str(e)
                print(f"❌ Attempt {attempt + 1} failed: {error_msg}")
                
                # Update failure tracking
                self.failure_count += 1
                self.current_delay = min(self.max_delay, self.current_delay * 1.5)  # Increase delay on failure
                
                if "401 Unauthorized" in error_msg or "429" in error_msg:
                    print("🛡️ Instagram rate limiting detected")
                    
                    # Implement progressive backoff for rate limits
                    if attempt < max_attempts - 1:
                        backoff_time = min(300, 30 * (2 ** attempt))  # 30s, 60s, 120s, 240s, 300s max
                        print(f"⏰ Rate limit backoff: {backoff_time} seconds...")
                        time.sleep(backoff_time)
                        
                        # Try changing user agent
                        try:
                            ua = UserAgent()
                            self.loader.context.user_agent = ua.random
                            print("🎭 Changed user agent for next attempt")
                        except:
                            pass
                        
                        continue
                    else:
                        print("🚫 All rate limit retry attempts exhausted")
                        break
                        
                elif "Private" in error_msg:
                    return {
                        'scraping_success': False,
                        'error': 'Profile is private',
                        'username': username,
                        'is_private': True
                    }
                
                elif "does not exist" in error_msg.lower():
                    return {
                        'scraping_success': False,
                        'error': 'Profile does not exist',
                        'username': username,
                        'profile_exists': False
                    }
                
                # For other errors, continue trying
                if attempt < max_attempts - 1:
                    wait_time = random.uniform(60, 180)  # 1-3 minutes for other errors
                    print(f"⏳ Waiting {wait_time:.0f}s before next attempt...")
                    time.sleep(wait_time)
        
        # All attempts failed
        return {
            'scraping_success': False,
            'error': f'All {max_attempts} attempts failed - Instagram blocking requests',
            'username': username,
            'attempts_made': max_attempts,
            'success_rate': f"{self.success_count}/{self.success_count + self.failure_count}",
            'recommendation': 'Try again in 2-6 hours or use different IP/VPN'
        }
    
    def get_rate_limit_status(self):
        """Get current rate limiting status"""
        success_rate = self.success_count / max(1, self.success_count + self.failure_count)
        
        status = {
            'success_count': self.success_count,
            'failure_count': self.failure_count,
            'success_rate': f"{success_rate:.1%}",
            'current_delay': self.current_delay,
            'session_requests': self.requests_this_session,
            'session_duration': str(datetime.now() - self.session_start),
            'recommendation': self.get_recommendation(success_rate)
        }
        
        return status
    
    def get_recommendation(self, success_rate):
        """Get recommendation based on current performance"""
        if success_rate > 0.8:
            return "System performing well - continue scraping"
        elif success_rate > 0.5:
            return "Moderate success rate - increase delays"
        elif success_rate > 0.2:
            return "High failure rate - take extended break"
        else:
            return "Severe rate limiting - stop for 2-6 hours or change IP"
