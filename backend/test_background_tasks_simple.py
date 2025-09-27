# test_background_tasks_simple.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings')
django.setup()

# Override settings for synchronous testing
from django.conf import settings
settings.CELERY_TASK_ALWAYS_EAGER = True
settings.CELERY_TASK_EAGER_PROPAGATES = True

from analytics.tasks import analyze_influencer_posts, analyze_influencer_reels
from influencers.models import Influencer

def test_tasks_synchronously():
    print("🔄 TESTING BACKGROUND TASKS (SYNCHRONOUS MODE)")
    print("=" * 50)
    
    try:
        influencer = Influencer.objects.get(username='cristiano')
        
        print(f"✅ Testing with @{influencer.username}")
        
        # Test post analysis
        print("\n📸 Testing post analysis task...")
        result = analyze_influencer_posts.delay(influencer.id)
        print(f"   Result: {result.get()}")
        
        # Test reel analysis  
        print("\n🎬 Testing reel analysis task...")
        result = analyze_influencer_reels.delay(influencer.id)
        print(f"   Result: {result.get()}")
        
        print("\n🎉 All tasks completed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_tasks_synchronously()
