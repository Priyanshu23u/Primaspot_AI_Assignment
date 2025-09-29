import sys
import os
import django

# Setup Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings')
django.setup()

from scraping.complete_extractor import CompleteInstagramExtractor

def test_complete_extraction():
    print("🔍 TESTING COMPLETE INSTAGRAM DATA EXTRACTION")
    print("🎯 Target: @zindagii_gulzar_hai_")
    print("=" * 70)
    
    extractor = CompleteInstagramExtractor()
    
    # Extract complete data
    complete_data = extractor.extract_complete_profile_data("zindagii_gulzar_hai_")
    
    # Display results
    print("\n📊 EXTRACTION RESULTS:")
    print("=" * 70)
    
    # Profile Data
    profile = complete_data['profile_data']
    print("✅ PROFILE INFORMATION:")
    print(f"  • Name: {profile.get('full_name', 'N/A')}")
    print(f"  • Username: @{profile.get('username', 'N/A')}")
    print(f"  • Followers: {profile.get('followers_count', 0):,}")
    print(f"  • Following: {profile.get('following_count', 0):,}")
    print(f"  • Posts: {profile.get('posts_count', 0):,}")
    print(f"  • Verified: {profile.get('is_verified', False)}")
    
    # Posts Data
    posts = complete_data['posts_data']
    print(f"\n✅ POSTS DATA ({len(posts)} posts):")
    for i, post in enumerate(posts[:3], 1):  # Show first 3
        print(f"  📸 Post {i}:")
        print(f"    • Likes: {post.get('likes_count', 0):,}")
        print(f"    • Comments: {post.get('comments_count', 0):,}")
        print(f"    • Caption: {post.get('caption', '')[:50]}...")
        print(f"    • Type: {post.get('media_type', 'photo')}")
    
    # Reels Data
    reels = complete_data['reels_data']
    print(f"\n✅ REELS DATA ({len(reels)} reels):")
    for i, reel in enumerate(reels[:3], 1):  # Show first 3
        print(f"  🎬 Reel {i}:")
        print(f"    • Views: {reel.get('views_count', 0):,}")
        print(f"    • Likes: {reel.get('likes_count', 0):,}")
        print(f"    • Comments: {reel.get('comments_count', 0):,}")
        print(f"    • Duration: {reel.get('duration', 0)}s")
    
    # Engagement Analytics
    if complete_data.get('engagement_analytics'):
        analytics = complete_data['engagement_analytics']
        
        if analytics.get('post_engagement'):
            post_eng = analytics['post_engagement']
            print(f"\n✅ ENGAGEMENT ANALYTICS:")
            print(f"  • Avg Likes per Post: {post_eng.get('avg_likes_per_post', 0):,}")
            print(f"  • Avg Comments per Post: {post_eng.get('avg_comments_per_post', 0):,}")
            print(f"  • Post Engagement Rate: {post_eng.get('post_engagement_rate', 0)}%")
        
        if analytics.get('reel_engagement'):
            reel_eng = analytics['reel_engagement']
            print(f"  • Avg Views per Reel: {reel_eng.get('avg_views_per_reel', 0):,}")
            print(f"  • Avg Likes per Reel: {reel_eng.get('avg_likes_per_reel', 0):,}")
            print(f"  • Reel Engagement Rate: {reel_eng.get('reel_engagement_rate', 0)}%")
        
        if analytics.get('overall_engagement'):
            overall = analytics['overall_engagement']
            print(f"  • Overall Engagement Rate: {overall.get('overall_engagement_rate', 0)}%")
            print(f"  • Performance: {overall.get('content_performance', 'N/A').title()}")
    
    print("\n" + "=" * 70)
    print("🎉 COMPLETE DATA EXTRACTION FINISHED!")
    print(f"✅ Profile: {'✓' if complete_data['profile_data'] else '✗'}")
    print(f"✅ Posts: {'✓' if complete_data['posts_data'] else '✗'} ({len(complete_data['posts_data'])} items)")
    print(f"✅ Reels: {'✓' if complete_data['reels_data'] else '✗'} ({len(complete_data['reels_data'])} items)")
    print(f"✅ Engagement: {'✓' if complete_data['engagement_analytics'] else '✗'}")
    
    # Save data for inspection
    import json
    with open('extracted_instagram_data.json', 'w') as f:
        json.dump(complete_data, f, indent=2, default=str)
    print(f"\n💾 Data saved to: extracted_instagram_data.json")

if __name__ == "__main__":
    test_complete_extraction()
