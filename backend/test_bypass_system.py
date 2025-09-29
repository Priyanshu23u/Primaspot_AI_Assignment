import sys
import os
import django

# Setup Django
sys.path.append('.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings')
django.setup()

from scraping.rate_limit_bypass import InstagramRateLimitBypass

def test_rate_limit_bypass():
    print("🛡️ TESTING ADVANCED RATE LIMIT BYPASS SYSTEM")
    print("=" * 70)
    
    bypass_system = InstagramRateLimitBypass()
    
    # Test with your target account
    username = "zindagii_gulzar_hai_"
    
    print(f"🎯 Target: @{username}")
    print("📋 Available bypass methods:")
    
    for i, method in enumerate(bypass_system.methods, 1):
        print(f"  {i}. {method['name']} (Success Rate: {method['success_rate']:.1%})")
    
    print(f"\n🚀 Starting advanced extraction...")
    
    result = bypass_system.extract_instagram_data(username)
    
    if result.get('success'):
        print("🎉 RATE LIMIT BYPASS SUCCESSFUL!")
        
        profile = result.get('profile_data', {})
        posts = result.get('posts_data', [])
        
        print(f"\n📊 EXTRACTED DATA:")
        print(f"  Method Used: {result.get('method', 'unknown')}")
        print(f"  Profile Name: {profile.get('full_name', 'N/A')}")
        print(f"  Followers: {profile.get('followers_count', 0):,}")
        print(f"  Following: {profile.get('following_count', 0):,}")
        print(f"  Posts: {profile.get('posts_count', 0):,}")
        print(f"  Posts Extracted: {len(posts)}")
        
        if posts:
            print(f"\n📸 SAMPLE POSTS:")
            for post in posts[:3]:
                print(f"    • Post {post.get('post_number', 'X')}: {post.get('likes_count', 0):,} likes, {post.get('comments_count', 0):,} comments")
        
        # Save results
        import json
        with open('bypass_test_results.json', 'w') as f:
            json.dump(result, f, indent=2, default=str)
        
        print(f"\n💾 Results saved to: bypass_test_results.json")
        
    else:
        print("❌ RATE LIMIT BYPASS FAILED")
        print(f"Error: {result.get('error', 'Unknown error')}")
        print("This means Instagram's protection is very strong right now")
        
        print(f"\n💡 RECOMMENDATIONS:")
        print("  1. Try again in 2-4 hours")
        print("  2. Use VPN to change IP address")
        print("  3. Try with mobile hotspot")
        print("  4. Use different target username")

if __name__ == "__main__":
    test_rate_limit_bypass()
