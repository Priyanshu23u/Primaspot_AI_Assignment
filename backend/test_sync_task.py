# test_sync_task.py
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings')
django.setup()

# Now we can create the sync version
from django.utils import timezone
from influencers.models import Influencer
from posts.models import Post
from reels.models import Reel
from scraping.instagram_scraper import InstagramScraper
import logging
from datetime import datetime

def scrape_influencer_data_sync(influencer_id: int):
    """Synchronous version for testing WITHOUT Redis/Celery"""
    try:
        influencer = Influencer.objects.get(id=influencer_id)
        scraper = InstagramScraper()
        
        print(f"🔍 Starting complete scrape for @{influencer.username}")
        print("=" * 60)
        
        # Scrape profile data
        profile_data = scraper.scrape_user_profile(influencer.username)
        if profile_data:
            # Update profile
            influencer.full_name = profile_data.get('full_name', '')
            influencer.bio = profile_data.get('biography', '')
            influencer.profile_pic_url = profile_data.get('profile_pic_url', '')
            influencer.followers_count = profile_data.get('followers_count', 0)
            influencer.following_count = profile_data.get('following_count', 0)
            influencer.posts_count = profile_data.get('posts_count', 0)
            influencer.is_verified = profile_data.get('is_verified', False)
            influencer.is_private = profile_data.get('is_private', False)
            influencer.website = profile_data.get('website', '')
            influencer.save()
            
            print(f"✅ Profile updated for @{influencer.username}")
            print(f"   Followers: {profile_data['followers_count']:,}")
            print(f"   Following: {profile_data['following_count']:,}")
            print(f"   Posts: {profile_data['posts_count']:,}")
        
        # Scrape posts
        print(f"\n🔍 Scraping posts...")
        posts_data = scraper.scrape_user_posts(influencer.username, max_posts=5)
        posts_created = 0
        
        for post_data in posts_data:
            try:
                post, created = Post.objects.get_or_create(
                    post_id=post_data['post_id'],
                    defaults={
                        'influencer': influencer,
                        'shortcode': post_data['shortcode'],
                        'image_url': post_data['image_url'],
                        'caption': post_data['caption'],
                        'likes_count': post_data['likes_count'],
                        'comments_count': post_data['comments_count'],
                        'post_date': datetime.fromtimestamp(post_data['post_date']),
                        'is_video': post_data['is_video'],
                    }
                )
                
                if not created:
                    # Update engagement metrics
                    post.likes_count = post_data['likes_count']
                    post.comments_count = post_data['comments_count']
                    post.save()
                
                posts_created += 1
                print(f"   ✅ Post {posts_created}: {post_data['shortcode']} ({post_data['likes_count']:,} likes)")
                
            except Exception as e:
                print(f"   ❌ Failed to save post: {e}")
        
        print(f"✅ Created/updated {posts_created} posts")
        
        # Scrape reels
        print(f"\n🔍 Scraping reels...")
        reels_data = scraper.scrape_user_reels(influencer.username, max_reels=3)
        reels_created = 0
        
        for reel_data in reels_data:
            try:
                reel, created = Reel.objects.get_or_create(
                    reel_id=reel_data['reel_id'],
                    defaults={
                        'influencer': influencer,
                        'shortcode': reel_data['shortcode'],
                        'video_url': reel_data['video_url'],
                        'thumbnail_url': reel_data['thumbnail_url'],
                        'caption': reel_data['caption'],
                        'views_count': reel_data.get('views_count', 0),
                        'likes_count': reel_data['likes_count'],
                        'comments_count': reel_data['comments_count'],
                        'post_date': datetime.fromtimestamp(reel_data['post_date']),
                        'duration': reel_data.get('duration', 0),
                    }
                )
                
                reels_created += 1
                print(f"   ✅ Reel {reels_created}: {reel_data['shortcode']} ({reel_data['views_count']:,} views)")
                
            except Exception as e:
                print(f"   ❌ Failed to save reel: {e}")
        
        print(f"✅ Created/updated {reels_created} reels")
        
        # Update metadata
        influencer.last_scraped = timezone.now()
        influencer.scrape_count += 1
        
        # Calculate engagement metrics
        posts = influencer.posts.all()
        if posts.exists():
            total_posts = posts.count()
            total_likes = sum(post.likes_count for post in posts)
            total_comments = sum(post.comments_count for post in posts)
            
            influencer.avg_likes = total_likes / total_posts
            influencer.avg_comments = total_comments / total_posts
            
            if influencer.followers_count > 0:
                influencer.engagement_rate = ((influencer.avg_likes + influencer.avg_comments) / influencer.followers_count) * 100
        
        influencer.save()
        
        scraper.close()
        
        print("=" * 60)
        print(f"🎉 Scraping completed successfully!")
        print(f"📊 Final Stats:")
        print(f"   Total posts in DB: {influencer.posts.count()}")
        print(f"   Total reels in DB: {influencer.reels.count()}")
        print(f"   Engagement rate: {influencer.engagement_rate:.2f}%")
        print(f"   Last scraped: {influencer.last_scraped}")
        
        return f"Successfully scraped @{influencer.username}: {posts_created} posts, {reels_created} reels"
        
    except Influencer.DoesNotExist:
        print(f"❌ Influencer {influencer_id} not found")
        return f"Influencer {influencer_id} not found"
    except Exception as e:
        print(f"❌ Error scraping influencer {influencer_id}: {str(e)}")
        return f"Error scraping: {str(e)}"

def test_sync_task():
    print("🔍 Testing Synchronous Task (Complete Scraping)")
    print("=" * 60)
    
    # Get or create influencer
    username = 'cristiano'
    influencer, created = Influencer.objects.get_or_create(
        username=username,
        defaults={'full_name': 'Cristiano Ronaldo'}
    )
    
    print(f"Testing with influencer ID: {influencer.id}")
    
    # Run synchronous scraping
    result = scrape_influencer_data_sync(influencer.id)
    
    print("\n" + "=" * 60)
    print("FINAL RESULT:", result)
    
    # Show API data that would be returned
    print(f"\n🌐 API Response Preview:")
    print(f"GET /api/v1/influencers/{influencer.id}/")

if __name__ == "__main__":
    test_sync_task()
