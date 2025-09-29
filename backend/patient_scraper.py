import instaloader
import time
import random
from datetime import datetime

def patient_real_data_extractor(username, max_wait_hours=4):
    """Patient scraper that waits for Instagram rate limits to reset"""
    
    print(f"🕐 PATIENT REAL DATA EXTRACTION FOR @{username}")
    print("=" * 60)
    
    loader = instaloader.Instaloader()
    loader.context.quiet = True
    
    # Try every 30 minutes for up to 4 hours
    max_attempts = max_wait_hours * 2
    wait_minutes = 30
    
    for attempt in range(max_attempts):
        try:
            print(f"🔄 Attempt {attempt + 1}/{max_attempts} at {datetime.now().strftime('%H:%M:%S')}")
            
            # Try to get profile
            profile = instaloader.Profile.from_username(loader.context, username)
            
            print("🎉 SUCCESS! Rate limit cleared!")
            print(f"✅ REAL DATA FOR @{username}:")
            print(f"  • Real Name: {profile.full_name}")
            print(f"  • Real Followers: {profile.followers:,}")
            print(f"  • Real Following: {profile.followees:,}")
            print(f"  • Real Posts: {profile.mediacount:,}")
            print(f"  • Verified: {profile.is_verified}")
            
            # Get real posts data
            print(f"\n📸 EXTRACTING REAL POSTS...")
            real_posts = []
            
            for i, post in enumerate(profile.get_posts()):
                if i >= 5:  # Get 5 real posts
                    break
                    
                time.sleep(10)  # Long delay between posts
                
                real_post = {
                    'post_num': i + 1,
                    'real_likes': post.likes,
                    'real_comments': post.comments,
                    'type': 'video' if post.is_video else 'photo',
                    'date': str(post.date),
                    'shortcode': post.shortcode
                }
                
                real_posts.append(real_post)
                print(f"  ✅ Post {i+1}: {post.likes:,} likes, {post.comments:,} comments")
            
            return {
                'success': True,
                'real_profile': {
                    'username': profile.username,
                    'name': profile.full_name,
                    'followers': profile.followers,
                    'following': profile.followees,
                    'posts_count': profile.mediacount,
                    'verified': profile.is_verified,
                    'bio': profile.biography
                },
                'real_posts': real_posts,
                'extraction_time': datetime.now().isoformat()
            }
            
        except Exception as e:
            if "401" in str(e) or "rate" in str(e).lower():
                print(f"⏰ Still rate limited. Waiting {wait_minutes} minutes...")
                print(f"   Next attempt: {datetime.now().replace(minute=datetime.now().minute + wait_minutes).strftime('%H:%M')}")
                time.sleep(wait_minutes * 60)  # Wait 30 minutes
            else:
                print(f"❌ Different error: {e}")
                break
    
    print("❌ All attempts exhausted - Instagram still blocking")
    return {'success': False, 'reason': 'persistent_rate_limiting'}

if __name__ == "__main__":
    # This will try for up to 2 hours
    result = patient_real_data_extractor("zindagii_gulzar_hai_", max_wait_hours=2)
    
    if result['success']:
        print("🎯 REAL DATA SUCCESSFULLY EXTRACTED!")
        import json
        with open('real_instagram_data.json', 'w') as f:
            json.dump(result, f, indent=2)
        print("💾 Real data saved to: real_instagram_data.json")
    else:
        print("⚠️ Need alternative approach")
