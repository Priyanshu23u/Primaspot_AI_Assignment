import sys
import os
import django

# Setup Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings')
django.setup()

print("🕷️ Testing Real Instagram Scraping...")

try:
    from scraping.real_instagram_scraper import RealInstagramScraper
    print("✅ Scraper imported successfully")
    
    # Initialize scraper
    scraper = RealInstagramScraper()
    print("✅ Scraper initialized")
    
    # Test connection
    print("\n🔍 Testing Instagram connection...")
    result = scraper.test_connection()
    
    if result['success']:
        print("✅ Connection successful!")
        profile = result['test_profile']
        print(f"Test profile: @{profile['username']}")
        print(f"Followers: {profile['followers']:,}")
        print(f"Posts: {profile['posts']:,}")
        print(f"Verified: {profile['is_verified']}")
        
        # Test individual profile scraping
        print("\n🔍 Testing profile scraping with NASA...")
        profile_result = scraper.scrape_profile('nasa')
        
        if profile_result.get('scraping_success'):
            print("✅ Profile scraping successful!")
            print(f"NASA Full name: {profile_result['full_name']}")
            print(f"NASA Followers: {profile_result['followers_count']:,}")
            print(f"NASA Posts: {profile_result['posts_count']:,}")
            print(f"NASA Verified: {profile_result['is_verified']}")
            print(f"NASA Category: {profile_result['category']}")
            
            bio = profile_result['bio']
            if len(bio) > 150:
                bio = bio[:150] + '...'
            print(f"NASA Bio: {bio}")
            
        else:
            print(f"❌ Profile scraping failed: {profile_result.get('error')}")
            
    else:
        print(f"❌ Connection failed: {result['error']}")
        print("\nPossible causes:")
        for cause in result.get('possible_causes', []):
            print(f"  • {cause}")
        print("\nSuggestions:")
        for suggestion in result.get('suggestions', []):
            print(f"  💡 {suggestion}")

except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Installing required packages...")
    os.system("pip install instaloader")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print(f"Error type: {type(e).__name__}")
