# test_with_mock_data.py
import os
import django
import random
from datetime import datetime, timedelta

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings')
django.setup()

from django.utils import timezone
from influencers.models import Influencer
from posts.models import Post, PostAnalysis
from reels.models import Reel, ReelAnalysis
from demographics.models import AudienceDemographics

def create_mock_data():
    """Create realistic mock data for assignment demonstration"""
    print("🎭 Creating Mock Data for Assignment Demonstration")
    print("=" * 60)
    
    # Get the existing influencer (Cristiano)
    influencer = Influencer.objects.get(username='cristiano')
    print(f"📝 Working with: @{influencer.username}")
    print(f"   Followers: {influencer.followers_count:,}")
    
    # Create realistic mock posts
    mock_posts_data = [
        {
            'post_id': '3456789012345678901',
            'shortcode': 'C-abc123xyz',
            'image_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t51.29350-15/sample1.jpg',
            'caption': 'Training hard for the next match! 💪⚽ #nevergiveup #football #training',
            'likes_count': 8500000,
            'comments_count': 45000,
            'is_video': False,
            'keywords': ['football', 'training', 'sport', 'motivation', 'fitness'],
            'vibe': 'energetic',
            'quality_score': 9.2
        },
        {
            'post_id': '3456789012345678902',
            'shortcode': 'C-def456uvw',
            'image_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t51.29350-15/sample2.jpg',
            'caption': 'Family time is the best time ❤️👨‍👩‍👧‍👦 #family #love #blessed',
            'likes_count': 12000000,
            'comments_count': 67000,
            'is_video': False,
            'keywords': ['family', 'love', 'personal', 'lifestyle', 'happiness'],
            'vibe': 'casual',
            'quality_score': 8.8
        },
        {
            'post_id': '3456789012345678903',
            'shortcode': 'C-ghi789rst',
            'image_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t51.29350-15/sample3.jpg',
            'caption': 'New collection launch! Exclusive designs for champions 🏆✨ #CR7 #fashion #luxury',
            'likes_count': 15000000,
            'comments_count': 89000,
            'is_video': False,
            'keywords': ['fashion', 'luxury', 'brand', 'business', 'style'],
            'vibe': 'luxury',
            'quality_score': 9.5
        },
        {
            'post_id': '3456789012345678904',
            'shortcode': 'C-jkl012mno',
            'image_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t51.29350-15/sample4.jpg',
            'caption': 'Beautiful sunset in Madrid 🌅 Grateful for every moment #sunset #madrid #grateful',
            'likes_count': 7200000,
            'comments_count': 32000,
            'is_video': False,
            'keywords': ['sunset', 'nature', 'madrid', 'travel', 'aesthetic'],
            'vibe': 'aesthetic',
            'quality_score': 9.0
        },
        {
            'post_id': '3456789012345678905',
            'shortcode': 'C-pqr345stu',
            'image_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t51.29350-15/sample5.jpg',
            'caption': 'Champions League victory! 🏆⚽ This is what we work for! #UCL #victory #teamwork',
            'likes_count': 18500000,
            'comments_count': 125000,
            'is_video': False,
            'keywords': ['football', 'victory', 'champions', 'celebration', 'success'],
            'vibe': 'energetic',
            'quality_score': 9.8
        }
    ]
    
    # Create posts
    posts_created = 0
    for post_data in mock_posts_data:
        post, created = Post.objects.get_or_create(
            post_id=post_data['post_id'],
            defaults={
                'influencer': influencer,
                'shortcode': post_data['shortcode'],
                'image_url': post_data['image_url'],
                'caption': post_data['caption'],
                'likes_count': post_data['likes_count'],
                'comments_count': post_data['comments_count'],
                'post_date': timezone.now() - timedelta(days=random.randint(1, 30)),
                'is_video': post_data['is_video'],
                'keywords': post_data['keywords'],
                'vibe_classification': post_data['vibe'],
                'quality_score': post_data['quality_score'],
                'is_analyzed': True,
                'analysis_date': timezone.now()
            }
        )
        
        if created:
            posts_created += 1
            
            # Create detailed post analysis
            PostAnalysis.objects.get_or_create(
                post=post,
                defaults={
                    'lighting_score': round(random.uniform(7.0, 9.5), 1),
                    'composition_score': round(random.uniform(7.5, 9.8), 1),
                    'visual_appeal_score': round(random.uniform(8.0, 9.9), 1),
                    'detected_objects': ['person', 'outdoor' if 'sunset' in post_data['caption'] else 'indoor'],
                    'dominant_colors': ['#FF6B35', '#F7941D', '#FFF200'] if 'sunset' in post_data['caption'] else ['#1E3A8A', '#FFFFFF', '#374151'],
                    'category': post_data['keywords'][0],
                    'mood': 'happy' if 'victory' in post_data['caption'] else 'professional'
                }
            )
    
    print(f"✅ Created {posts_created} mock posts")
    
    # Create realistic mock reels
    mock_reels_data = [
        {
            'reel_id': '2345678901234567801',
            'shortcode': 'C-reel123abc',
            'video_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t50.16885-16/sample1.mp4',
            'thumbnail_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t51.29350-15/reel_thumb1.jpg',
            'caption': 'Training session highlights! 💪⚽ #training #football #skills',
            'views_count': 25000000,
            'likes_count': 3200000,
            'comments_count': 78000,
            'duration': 15,
            'events': ['person_training', 'football_skills', 'gym_workout'],
            'vibe': 'energetic',
            'tags': ['training', 'athletic', 'professional', 'sport']
        },
        {
            'reel_id': '2345678901234567802',
            'shortcode': 'C-reel456def',
            'video_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t50.16885-16/sample2.mp4',
            'thumbnail_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t51.29350-15/reel_thumb2.jpg',
            'caption': 'Behind the scenes of our photoshoot 📸✨ #bts #photoshoot #luxury',
            'views_count': 18000000,
            'likes_count': 2100000,
            'comments_count': 45000,
            'duration': 22,
            'events': ['photoshoot', 'fashion', 'behind_scenes'],
            'vibe': 'luxury',
            'tags': ['fashion', 'luxury', 'photoshoot', 'behind_scenes']
        },
        {
            'reel_id': '2345678901234567803',
            'shortcode': 'C-reel789ghi',
            'video_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t50.16885-16/sample3.mp4',
            'thumbnail_url': 'https://scontent-cdg4-2.cdninstagram.com/v/t51.29350-15/reel_thumb3.jpg',
            'caption': 'Family cooking session! Teaching the kids my favorite recipes 👨‍🍳❤️',
            'views_count': 32000000,
            'likes_count': 4500000,
            'comments_count': 95000,
            'duration': 28,
            'events': ['cooking', 'family_time', 'teaching'],
            'vibe': 'casual_daily_life',
            'tags': ['family', 'cooking', 'lifestyle', 'personal']
        }
    ]
    
    # Create reels
    reels_created = 0
    for reel_data in mock_reels_data:
        reel, created = Reel.objects.get_or_create(
            reel_id=reel_data['reel_id'],
            defaults={
                'influencer': influencer,
                'shortcode': reel_data['shortcode'],
                'video_url': reel_data['video_url'],
                'thumbnail_url': reel_data['thumbnail_url'],
                'caption': reel_data['caption'],
                'views_count': reel_data['views_count'],
                'likes_count': reel_data['likes_count'],
                'comments_count': reel_data['comments_count'],
                'post_date': timezone.now() - timedelta(days=random.randint(1, 15)),
                'duration': reel_data['duration'],
                'detected_events': reel_data['events'],
                'vibe_classification': reel_data['vibe'],
                'descriptive_tags': reel_data['tags'],
                'is_analyzed': True,
                'analysis_date': timezone.now()
            }
        )
        
        if created:
            reels_created += 1
            
            # Create detailed reel analysis
            ReelAnalysis.objects.get_or_create(
                reel=reel,
                defaults={
                    'scene_changes': random.randint(3, 8),
                    'activity_level': 'high' if 'training' in reel_data['caption'] else 'medium',
                    'audio_detected': True,
                    'primary_subject': 'person',
                    'environment': 'outdoor' if 'photoshoot' in reel_data['caption'] else 'indoor',
                    'time_of_day': 'day'
                }
            )
    
    print(f"✅ Created {reels_created} mock reels")
    
    # Create audience demographics (bonus feature)
    demographics, created = AudienceDemographics.objects.get_or_create(
        influencer=influencer,
        defaults={
            'age_13_17': 8.5,
            'age_18_24': 28.3,
            'age_25_34': 35.7,
            'age_35_44': 19.2,
            'age_45_54': 6.8,
            'age_55_plus': 1.5,
            'male_percentage': 67.8,
            'female_percentage': 32.2,
            'top_countries': ['Portugal', 'Spain', 'Brazil', 'Italy', 'France'],
            'top_cities': ['Madrid', 'Lisbon', 'São Paulo', 'Manchester', 'Turin'],
            'peak_activity_hours': [19, 20, 21, 22],
            'most_active_days': ['Sunday', 'Wednesday', 'Saturday'],
            'confidence_score': 8.7
        }
    )
    
    if created:
        print("✅ Created audience demographics")
    
    # Update engagement metrics
    posts = influencer.posts.all()
    if posts.exists():
        total_posts = posts.count()
        total_likes = sum(post.likes_count for post in posts)
        total_comments = sum(post.comments_count for post in posts)
        
        influencer.avg_likes = total_likes / total_posts
        influencer.avg_comments = total_comments / total_posts
        
        if influencer.followers_count > 0:
            influencer.engagement_rate = ((influencer.avg_likes + influencer.avg_comments) / influencer.followers_count) * 100
    
    influencer.last_scraped = timezone.now()
    influencer.save()
    
    print("\n" + "=" * 60)
    print("🎉 MOCK DATA CREATION COMPLETED!")
    print("📊 Final Statistics:")
    print(f"   Influencer: @{influencer.username}")
    print(f"   Followers: {influencer.followers_count:,}")
    print(f"   Posts in DB: {influencer.posts.count()}")
    print(f"   Reels in DB: {influencer.reels.count()}")
    print(f"   Avg Likes: {influencer.avg_likes:,.0f}")
    print(f"   Avg Comments: {influencer.avg_comments:,.0f}")
    print(f"   Engagement Rate: {influencer.engagement_rate:.2f}%")
    print(f"   Demographics Available: {'✅' if hasattr(influencer, 'demographics') else '❌'}")
    
    print("\n🌐 API Endpoints Ready:")
    print(f"   Profile: http://localhost:8000/api/v1/influencers/{influencer.id}/")
    print(f"   Analytics: http://localhost:8000/api/v1/influencers/{influencer.id}/analytics/")
    print(f"   Posts: http://localhost:8000/api/v1/posts/posts/?influencer={influencer.id}")
    print(f"   Reels: http://localhost:8000/api/v1/reels/reels/?influencer={influencer.id}")
    print(f"   Demographics: http://localhost:8000/api/v1/demographics/{influencer.id}/")

if __name__ == "__main__":
    create_mock_data()
