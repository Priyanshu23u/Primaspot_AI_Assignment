from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
import re

def extract_real_data_with_browser(username):
    """Extract REAL Instagram data using browser automation"""
    
    print(f"🌐 BROWSER EXTRACTION FOR @{username}")
    print("=" * 50)
    
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    
    # Initialize driver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    try:
        print("🔗 Opening Instagram profile...")
        driver.get(f"https://www.instagram.com/{username}/")
        
        # Wait for page to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "main"))
        )
        time.sleep(5)
        
        # Extract real profile data
        print("📊 Extracting real profile statistics...")
        
        # Get follower count
        try:
            followers_element = driver.find_element(By.XPATH, "//a[contains(@href, '/followers/')]/span")
            followers_text = followers_element.get_attribute('title') or followers_element.text
            followers = parse_instagram_number(followers_text)
        except:
            followers = 0
        
        # Get following count  
        try:
            following_element = driver.find_element(By.XPATH, "//a[contains(@href, '/following/')]/span")
            following_text = following_element.get_attribute('title') or following_element.text
            following = parse_instagram_number(following_text)
        except:
            following = 0
        
        # Get posts count
        try:
            posts_elements = driver.find_elements(By.XPATH, "//div[contains(text(), 'posts')]")
            if posts_elements:
                posts_text = posts_elements[0].text
                posts = parse_instagram_number(posts_text.split()[0])
            else:
                posts = 0
        except:
            posts = 0
        
        # Get profile name and bio
        try:
            name_element = driver.find_element(By.XPATH, "//h2[contains(@class, 'x1lliihq')]")
            real_name = name_element.text
        except:
            real_name = username
        
        try:
            bio_element = driver.find_element(By.XPATH, "//h1[contains(@class, 'x1lliihq')]//following-sibling::span")
            bio = bio_element.text
        except:
            bio = ""
        
        print("✅ REAL PROFILE DATA EXTRACTED:")
        print(f"  • Real Name: {real_name}")
        print(f"  • Real Followers: {followers:,}")
        print(f"  • Real Following: {following:,}")
        print(f"  • Real Posts: {posts:,}")
        print(f"  • Bio: {bio[:100]}...")
        
        # Extract real posts data
        print(f"\n📸 Extracting real posts data...")
        real_posts = []
        
        # Find post links
        post_links = driver.find_elements(By.XPATH, "//a[contains(@href, '/p/')]")[:10]
        
        for i, post_link in enumerate(post_links):
            try:
                print(f"  🔍 Extracting post {i+1}...")
                
                # Click on post
                post_link.click()
                time.sleep(3)
                
                # Extract likes count
                try:
                    likes_element = WebDriverWait(driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, "//button[contains(@class, '_abl-')]//span"))
                    )
                    likes_text = likes_element.text
                    likes = parse_instagram_number(likes_text.split()[0])
                except:
                    likes = 0
                
                # Extract comments count
                try:
                    comments_elements = driver.find_elements(By.XPATH, "//span[contains(text(), 'comments')]")
                    if comments_elements:
                        comments_text = comments_elements[0].text
                        comments = parse_instagram_number(comments_text.split()[0])
                    else:
                        comments = 0
                except:
                    comments = 0
                
                # Extract caption
                try:
                    caption_element = driver.find_element(By.XPATH, "//h1[contains(@class, '_aacl')]")
                    caption = caption_element.text[:100]
                except:
                    caption = ""
                
                real_post = {
                    'post_number': i + 1,
                    'real_likes_count': likes,
                    'real_comments_count': comments,
                    'real_caption': caption,
                    'extracted_at': time.strftime('%Y-%m-%d %H:%M:%S')
                }
                
                real_posts.append(real_post)
                print(f"    ✅ {likes:,} likes, {comments:,} comments")
                
                # Close post modal
                close_button = driver.find_element(By.XPATH, "//button[contains(@aria-label, 'Close')]")
                close_button.click()
                time.sleep(2)
                
            except Exception as e:
                print(f"    ❌ Error extracting post {i+1}: {e}")
                continue
        
        result = {
            'success': True,
            'extraction_method': 'browser_automation',
            'real_data': {
                'username': username,
                'real_name': real_name,
                'real_followers_count': followers,
                'real_following_count': following,
                'real_posts_count': posts,
                'real_bio': bio,
                'real_posts': real_posts
            },
            'extracted_at': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        return result
        
    except Exception as e:
        print(f"❌ Browser extraction failed: {e}")
        return {'success': False, 'error': str(e)}
        
    finally:
        driver.quit()

def parse_instagram_number(text):
    """Parse Instagram number format (1.2K, 1.2M, etc.)"""
    if not text:
        return 0
    
    # Remove commas and clean text
    clean_text = re.sub(r'[^\d.KkMmBb]', '', str(text))
    
    if 'K' in clean_text.upper():
        return int(float(clean_text.upper().replace('K', '')) * 1000)
    elif 'M' in clean_text.upper():
        return int(float(clean_text.upper().replace('M', '')) * 1000000)
    elif 'B' in clean_text.upper():
        return int(float(clean_text.upper().replace('B', '')) * 1000000000)
    else:
        try:
            return int(float(clean_text))
        except:
            return 0

if __name__ == "__main__":
    result = extract_real_data_with_browser("zindagii_gulzar_hai_")
    
    if result['success']:
        print("\n🎉 REAL DATA SUCCESSFULLY EXTRACTED!")
        
        # Save real data
        with open('browser_extracted_real_data.json', 'w') as f:
            json.dump(result, f, indent=2)
        
        print("💾 Real data saved to: browser_extracted_real_data.json")
        
        # Display summary
        real_data = result['real_data']
        print(f"\n📊 SUMMARY OF REAL DATA:")
        print(f"  • Username: @{real_data['username']}")
        print(f"  • Name: {real_data['real_name']}")
        print(f"  • Followers: {real_data['real_followers_count']:,}")
        print(f"  • Following: {real_data['real_following_count']:,}")
        print(f"  • Posts: {real_data['real_posts_count']:,}")
        print(f"  • Real Posts Extracted: {len(real_data['real_posts'])}")
    else:
        print("❌ Browser extraction failed")
