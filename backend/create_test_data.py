# create_test_data_fixed.py - SQLite3 Test Data with Error Handling
import json
import traceback
from datetime import datetime, timedelta
from django.utils import timezone

print("🚀 Creating SQLite3-optimized test data with error handling...")

try:
    # Import models with error handling
    try:
        from influencers.models import Influencer
        print("✅ Imported Influencer model")
    except ImportError as e:
        print(f"❌ Failed to import Influencer model: {e}")
        print("💡 Make sure the influencers app is installed and migrated")
        exit(1)
    
    try:
        from posts.models import Post, PostAnalysis
        print("✅ Imported Post models")
    except ImportError as e:
        print(f"❌ Failed to import Post models: {e}")
        print("💡 Make sure the posts app is installed and migrated")
        exit(1)
    
    try:
        from reels.models import Reel, ReelAnalysis
        print("✅ Imported Reel models")
    except ImportError as e:
        print(f"❌ Failed to import Reel models: {e}")
        print("💡 Make sure the reels app is installed and migrated")
        exit(1)
    
    try:
        from demographics.models import AudienceDemographics
        print("✅ Imported Demographics model")
    except ImportError as e:
        print(f"❌ Failed to import Demographics model: {e}")
        print("💡 Make sure the demographics app is installed and migrated")
        exit(1)

    # Create test influencers
    print("\n📝 Creating test influencers...")
    influencers_data = [
        {
            'username': 'fitness_guru_sarah',
            'full_name': 'Sarah Johnson',
            'bio': '💪 Fitness Coach | 🥗 Nutrition Expert | 🏃‍♀️ Marathon Runner',
            'followers_count': 125000,
            'following_count': 890,
            'posts_count': 245,
            'is_verified': True,
            'category': 'fitness'
        },
        {
            'username': 'tech_reviewer_mike',
            'full_name': 'Michael Chen',
            'bio': '📱 Tech Reviews | 💻 Gadget Testing | 🎮 Gaming Content',
            'followers_count': 89000,
            'following_count': 567,
            'posts_count': 189,
            'is_verified': False,
            'category': 'technology'
        },
        {
            'username': 'travel_with_emma',
            'full_name': 'Emma Rodriguez',
            'bio': '✈️ Travel Blogger | 📸 Photography | 🌍 World Explorer',
            'followers_count': 156000,
            'following_count': 1234,
            'posts_count': 312,
            'is_verified': True,
            'category': 'travel'
        }
    ]

    created_influencers = []
    for data in influencers_data:
        try:
            # Check if required fields exist in model
            model_fields = [field.name for field in Influencer._meta.get_fields()]
            
            # Only include fields that exist in the model
            filtered_data = {}
            for key, value in data.items():
                if key in model_fields:
                    filtered_data[key] = value
                else:
                    print(f"⚠️ Skipping field '{key}' - not found in Influencer model")
            
            influencer, created = Influencer.objects.get_or_create(
                username=data['username'],
                defaults=filtered_data
            )
            created_influencers.append(influencer)
            print(f"✅ {'Created' if created else 'Found'} influencer: @{influencer.username}")
            
        except Exception as e:
            print(f"❌ Error creating influencer {data['username']}: {e}")
            # Create minimal influencer
            try:
                influencer, created = Influencer.objects.get_or_create(
                    username=data['username'],
                    defaults={
                        'full_name': data['full_name'],
                        'bio': data['bio'],
                        'followers_count': data['followers_count']
                    }
                )
                created_influencers.append(influencer)
                print(f"✅ Created minimal influencer: @{influencer.username}")
            except Exception as e2:
                print(f"❌ Failed to create minimal influencer: {e2}")
                continue

    if not created_influencers:
        print("❌ No influencers created. Exiting...")
        exit(1)

    # Create test posts with error handling
    print(f"\n📝 Creating test posts for {len(created_influencers)} influencers...")
    posts_data = [
        {
            'caption': 'Morning workout complete! 💪 Remember, consistency beats perfection every time. What\'s your favorite morning exercise?',
            'keywords': json.dumps(['fitness', 'workout', 'morning', 'motivation', 'exercise']),
            'vibe_classification': 'energetic',
            'category': 'fitness',
            'likes_count': 2456,
            'comments_count': 189,
            'quality_score': 8.7,
            'is_analyzed': True
        },
        {
            'caption': 'New iPhone 15 Pro review is live! The camera improvements are incredible 📱✨ Link in bio for full review.',
            'keywords': json.dumps(['iphone', 'review', 'technology', 'camera', 'apple']),
            'vibe_classification': 'professional',
            'category': 'technology',
            'likes_count': 1876,
            'comments_count': 234,
            'quality_score': 9.2,
            'is_analyzed': True
        },
        {
            'caption': 'Sunset in Santorini never gets old 🌅 The blue domes and white buildings create the perfect contrast!',
            'keywords': json.dumps(['santorini', 'sunset', 'travel', 'greece', 'photography']),
            'vibe_classification': 'aesthetic',
            'category': 'travel',
            'likes_count': 3421,
            'comments_count': 312,
            'quality_score': 9.5,
            'is_analyzed': True
        }
    ]

    created_posts = []
    post_model_fields = [field.name for field in Post._meta.get_fields()]
    
    for i, influencer in enumerate(created_influencers):
        for j, post_data in enumerate(posts_data):
            try:
                # Filter post data to only include existing fields
                filtered_post_data = {}
                for key, value in post_data.items():
                    if key in post_model_fields:
                        filtered_post_data[key] = value
                    else:
                        print(f"⚠️ Skipping post field '{key}' - not found in Post model")
                
                # Create unique posts for each influencer
                filtered_post_data['shortcode'] = f"{influencer.username}_post_{j+1}"
                filtered_post_data['influencer'] = influencer
                filtered_post_data['post_date'] = timezone.now() - timedelta(days=j+1)
                
                post, created = Post.objects.get_or_create(
                    shortcode=filtered_post_data['shortcode'],
                    defaults=filtered_post_data
                )
                
                if created:
                    created_posts.append(post)
                    print(f"✅ Created post: {post.shortcode}")
                    
                    # Create detailed analysis for analyzed posts
                    if hasattr(post, 'is_analyzed') and post.is_analyzed:
                        try:
                            analysis_model_fields = [field.name for field in PostAnalysis._meta.get_fields()]
                            
                            analysis_data = {
                                'post': post,
                            }
                            
                            # Add fields that exist in the model
                            optional_fields = {
                                'dominant_colors': json.dumps(['#FF6B6B', '#4ECDC4', '#45B7D1']),
                                'composition_score': 8.5,
                                'visual_appeal_score': 9.0,
                                'text_readability_score': 7.8,
                                'brand_consistency_score': 8.2,
                                'trend_alignment_score': 8.9,
                                'overall_quality_score': post.quality_score if hasattr(post, 'quality_score') else 8.5,
                                'suggestions': json.dumps([
                                    'Consider adding more contrast',
                                    'Great use of hashtags',
                                    'Perfect posting time'
                                ])
                            }
                            
                            for key, value in optional_fields.items():
                                if key in analysis_model_fields:
                                    analysis_data[key] = value
                            
                            PostAnalysis.objects.get_or_create(
                                post=post,
                                defaults=analysis_data
                            )
                            print(f"✅ Created analysis for post: {post.shortcode}")
                            
                        except Exception as e:
                            print(f"⚠️ Could not create analysis for {post.shortcode}: {e}")
                
            except Exception as e:
                print(f"❌ Error creating post {j+1} for @{influencer.username}: {e}")
                print(f"💡 Traceback: {traceback.format_exc()}")
                continue

    # Create test reels with error handling
    print(f"\n📝 Creating test reels...")
    reels_data = [
        {
            'caption': '30-second HIIT workout you can do anywhere! 🔥 Try this circuit 3 times #HIITWorkout #FitnessMotivation',
            'descriptive_tags': json.dumps(['workout', 'fitness', 'HIIT', 'exercise', 'motivation']),
            'detected_events': json.dumps(['person_exercising', 'fast_movement', 'text_overlay']),
            'vibe_classification': 'energetic',
            'views_count': 45678,
            'likes_count': 3456,
            'comments_count': 267,
            'duration': 28.5,
            'is_analyzed': True
        },
        {
            'caption': 'Unboxing the new MacBook Pro M3! The speed is incredible ⚡ #TechReview #Apple #MacBook',
            'descriptive_tags': json.dumps(['unboxing', 'macbook', 'technology', 'review', 'apple']),
            'detected_events': json.dumps(['unboxing', 'product_showcase', 'hands_demo']),
            'vibe_classification': 'professional',
            'views_count': 32145,
            'likes_count': 2134,
            'comments_count': 189,
            'duration': 45.2,
            'is_analyzed': True
        }
    ]

    reel_model_fields = [field.name for field in Reel._meta.get_fields()]
    created_reels = []
    
    for i, influencer in enumerate(created_influencers[:2]):  # Only first 2 influencers get reels
        try:
            reel_data = reels_data[i].copy()
            
            # Filter reel data
            filtered_reel_data = {}
            for key, value in reel_data.items():
                if key in reel_model_fields:
                    filtered_reel_data[key] = value
                else:
                    print(f"⚠️ Skipping reel field '{key}' - not found in Reel model")
            
            filtered_reel_data['shortcode'] = f"{influencer.username}_reel_1"
            filtered_reel_data['influencer'] = influencer
            filtered_reel_data['post_date'] = timezone.now() - timedelta(days=2)
            
            reel, created = Reel.objects.get_or_create(
                shortcode=filtered_reel_data['shortcode'],
                defaults=filtered_reel_data
            )
            
            if created:
                created_reels.append(reel)
                print(f"✅ Created reel: {reel.shortcode}")
                
                # Create detailed reel analysis
                if hasattr(reel, 'is_analyzed') and reel.is_analyzed:
                    try:
                        analysis_model_fields = [field.name for field in ReelAnalysis._meta.get_fields()]
                        
                        analysis_data = {
                            'reel': reel,
                        }
                        
                        optional_fields = {
                            'scene_changes': 12,
                            'activity_level': 8.5,
                            'audio_energy': 7.8,
                            'visual_engagement': 9.1,
                            'pacing_score': 8.3,
                            'hook_effectiveness': 8.9,
                            'retention_prediction': 75.4,
                            'virality_potential': 8.2
                        }
                        
                        for key, value in optional_fields.items():
                            if key in analysis_model_fields:
                                analysis_data[key] = value
                        
                        ReelAnalysis.objects.get_or_create(
                            reel=reel,
                            defaults=analysis_data
                        )
                        print(f"✅ Created reel analysis: {reel.shortcode}")
                        
                    except Exception as e:
                        print(f"⚠️ Could not create analysis for reel {reel.shortcode}: {e}")
                        
        except Exception as e:
            print(f"❌ Error creating reel for @{influencer.username}: {e}")
            continue

    # Create demographics data with error handling
    print(f"\n📝 Creating demographics data...")
    demo_model_fields = [field.name for field in AudienceDemographics._meta.get_fields()]
    
    for influencer in created_influencers:
        try:
            demographics_data = {
                'influencer': influencer,
            }
            
            # Optional demographic fields
            optional_demo_fields = {
                'age_13_17': 5.2,
                'age_18_24': 28.7,
                'age_25_34': 35.4,
                'age_35_44': 20.1,
                'age_45_54': 8.3,
                'age_55_plus': 2.3,
                'male_percentage': 45.6,
                'female_percentage': 52.8,
                'other_percentage': 1.6,
                'top_countries': json.dumps([
                    {'country': 'United States', 'percentage': 35.2},
                    {'country': 'Canada', 'percentage': 12.4},
                    {'country': 'United Kingdom', 'percentage': 8.9},
                    {'country': 'Australia', 'percentage': 6.7},
                    {'country': 'Germany', 'percentage': 5.8}
                ]),
                'top_cities': json.dumps([
                    {'city': 'New York', 'percentage': 8.2},
                    {'city': 'Los Angeles', 'percentage': 6.1},
                    {'city': 'Toronto', 'percentage': 4.3},
                    {'city': 'London', 'percentage': 3.9},
                    {'city': 'Sydney', 'percentage': 2.8}
                ]),
                'peak_activity_hours': json.dumps([18, 19, 20, 21, 22]),
                'engagement_by_day': json.dumps({
                    'Monday': 6.2,
                    'Tuesday': 7.1,
                    'Wednesday': 8.3,
                    'Thursday': 8.9,
                    'Friday': 9.2,
                    'Saturday': 8.7,
                    'Sunday': 7.8
                }),
                'confidence_score': 8.5,
                'data_points_used': 1247
            }
            
            # Add fields that exist in the model
            for key, value in optional_demo_fields.items():
                if key in demo_model_fields:
                    demographics_data[key] = value
                else:
                    print(f"⚠️ Skipping demo field '{key}' - not found in Demographics model")
            
            demo, created = AudienceDemographics.objects.get_or_create(
                influencer=influencer,
                defaults=demographics_data
            )
            
            if created:
                print(f"✅ Created demographics for: @{influencer.username}")
                
        except Exception as e:
            print(f"❌ Error creating demographics for @{influencer.username}: {e}")
            continue

    # Summary with error handling
    print("\n📊 SQLite3 Test Data Summary:")
    try:
        print(f"✅ Influencers: {Influencer.objects.count()}")
        print(f"✅ Posts: {Post.objects.count()}")
        print(f"✅ Post Analyses: {PostAnalysis.objects.count()}")
        print(f"✅ Reels: {Reel.objects.count()}")
        print(f"✅ Reel Analyses: {ReelAnalysis.objects.count()}")
        print(f"✅ Demographics: {AudienceDemographics.objects.count()}")
    except Exception as e:
        print(f"❌ Error getting summary counts: {e}")

    print("\n🎉 SQLite3 test data creation completed!")
    print("🚀 Your Instagram Analytics backend is ready with SQLite3!")

except Exception as e:
    print(f"\n❌ CRITICAL ERROR: {e}")
    print(f"💡 Full traceback:")
    print(traceback.format_exc())
    print("\n🔧 TROUBLESHOOTING STEPS:")
    print("1. Make sure all migrations are applied: python manage.py migrate")
    print("2. Check that all apps are in INSTALLED_APPS")
    print("3. Verify model relationships match your actual models")
    print("4. Check for any model field name differences")
