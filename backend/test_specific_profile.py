import sys
import os
import django

# Setup Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings')
django.setup()

from scraping.stealth_scraper import StealthInstagramScraper

print("🔍 Testing Instagram scraping for @zindagii_gulzar_hai_")
print("=" * 60)

scraper = StealthInstagramScraper()

# Test the specific account
username = "zindagii_gulzar_hai_"

print(f"🚀 Starting scrape for @{username}...")
result = scraper.scrape_with_retry(username, max_retries=3)

if result.get('scraping_success'):
    print("✅ SCRAPING SUCCESS!")
    print(f"📊 Profile Data for @{username}:")
    print(f"  • Full Name: {result.get('full_name', 'N/A')}")
    print(f"  • Followers: {result.get('followers_count', 0):,}")
    print(f"  • Following: {result.get('following_count', 0):,}")
    print(f"  • Posts: {result.get('posts_count', 0):,}")
    print(f"  • Verified: {result.get('is_verified', False)}")
    print(f"  • Private: {result.get('is_private', False)}")
    
    bio = result.get('bio', '')
    if bio:
        display_bio = bio[:150] + '...' if len(bio) > 150 else bio
        print(f"  • Bio: {display_bio}")
    
    print(f"  • Category: {result.get('category', 'lifestyle')}")
    print(f"  • Scraped at: {result.get('scraped_at', 'N/A')}")
    
else:
    print("❌ SCRAPING FAILED")
    print(f"Error: {result.get('error', 'Unknown error')}")
    print(f"Suggestion: {result.get('suggestion', 'Try again later')}")

print("\n" + "=" * 60)
print("Test completed!")
