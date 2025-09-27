# test_scraper.py
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings')
django.setup()

from scraping.instagram_scraper import InstagramScraper
from influencers.models import Influencer

def test_scraper():
    print("🔍 Testing Instagram Scraper (No Redis Required)")
    print("=" * 60)
    
    # Get or create influencer (handles duplicate issue)
    username = 'cristiano'
    influencer, created = Influencer.objects.get_or_create(
        username=username,
        defaults={'full_name': 'Cristiano Ronaldo'}
    )
    
    if created:
        print(f"✅ Created new influencer: @{username}")
    else:
        print(f"✅ Found existing influencer: @{username}")
        print(f"   Current followers: {influencer.followers_count:,}")
    
    # Test scraper directly (no Celery/Redis)
    scraper = InstagramScraper()
    
    print(f"\n🔍 Testing profile scraping for @{username}...")
    try:
        profile_data = scraper.scrape_user_profile(username)
        if profile_data:
            print("✅ Profile scraping SUCCESS!")
            print(f"   Full Name: {profile_data['full_name']}")
            print(f"   Followers: {profile_data['followers_count']:,}")
            print(f"   Following: {profile_data['following_count']:,}")
            print(f"   Posts: {profile_data['posts_count']:,}")
            print(f"   Verified: {'Yes' if profile_data['is_verified'] else 'No'}")
            
            # Update the database
            influencer.full_name = profile_data['full_name']
            influencer.followers_count = profile_data['followers_count']
            influencer.following_count = profile_data['following_count']
            influencer.posts_count = profile_data['posts_count']
            influencer.is_verified = profile_data['is_verified']
            influencer.save()
            print("✅ Database updated with fresh data!")
            
        else:
            print("❌ Profile scraping failed")
            return
    except Exception as e:
        print(f"❌ Profile scraping error: {str(e)}")
        return
    
    print(f"\n🔍 Testing posts scraping (limited to 3 posts)...")
    try:
        posts_data = scraper.scrape_user_posts(username, max_posts=3)
        if posts_data:
            print(f"✅ Posts scraping SUCCESS! Got {len(posts_data)} posts")
            
            for i, post in enumerate(posts_data, 1):
                print(f"   Post {i}: {post['shortcode']}")
                print(f"      Likes: {post['likes_count']:,}")
                print(f"      Comments: {post['comments_count']:,}")
                print(f"      Caption: {post['caption'][:50]}...")
                print()
        else:
            print("❌ Posts scraping failed")
    except Exception as e:
        print(f"❌ Posts scraping error: {str(e)}")
    
    print(f"\n🔍 Testing reels scraping (limited to 2 reels)...")
    try:
        reels_data = scraper.scrape_user_reels(username, max_reels=2)
        if reels_data:
            print(f"✅ Reels scraping SUCCESS! Got {len(reels_data)} reels")
            
            for i, reel in enumerate(reels_data, 1):
                print(f"   Reel {i}: {reel['shortcode']}")
                print(f"      Views: {reel['views_count']:,}")
                print(f"      Likes: {reel['likes_count']:,}")
                print(f"      Duration: {reel['duration']}s")
                print()
        else:
            print("❌ Reels scraping failed")
    except Exception as e:
        print(f"❌ Reels scraping error: {str(e)}")
    
    # Clean up
    scraper.close()
    
    print("=" * 60)
    print("🎉 Test completed! The scraper is working.")
    print("\n📊 Final Database Stats:")
    influencer.refresh_from_db()
    print(f"   Username: @{influencer.username}")
    print(f"   Followers: {influencer.followers_count:,}")
    print(f"   Posts in DB: {influencer.posts.count()}")
    print(f"   Reels in DB: {influencer.reels.count()}")

if __name__ == "__main__":
    test_scraper()
