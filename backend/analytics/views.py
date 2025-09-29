from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from datetime import datetime, timedelta

class AnalyticsOverviewAPIView(APIView):
    """Analytics Overview API - Main endpoint"""
    
    def get(self, request):
        data = {
            'overview': {
                'total_influencers': 25,
                'total_posts': 1250,
                'total_reels': 340,
                'avg_engagement_rate': 4.2,
                'total_reach': 2500000,
                'growth_rate': 12.5
            },
            'top_performers': [
                {
                    'username': 'fitness_guru_sarah',
                    'engagement_rate': 8.9,
                    'followers': 125000
                },
                {
                    'username': 'tech_reviewer_mike', 
                    'engagement_rate': 7.2,
                    'followers': 89000
                }
            ],
            'generated_at': datetime.now().isoformat()
        }
        return Response(data)

class EngagementTrendsAPIView(APIView):
    """Engagement Trends API"""
    
    def get(self, request):
        # Generate trend data for the last 7 days
        base_date = datetime.now() - timedelta(days=7)
        trend_data = []
        
        for i in range(7):
            date = base_date + timedelta(days=i)
            trend_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'engagement_rate': round(4.0 + (i * 0.2) + (i % 3 * 0.3), 2),
                'likes_per_post': 1200 + (i * 50),
                'comments_per_post': 85 + (i * 5),
                'shares_per_post': 20 + (i * 2),
                'saves_per_post': 45 + (i * 3)
            })
        
        data = {
            'engagement_trends': {
                'daily_trends': trend_data,
                'weekly_average': 4.5,
                'growth_rate': 12.3,
                'best_performing_day': 'Friday',
                'peak_engagement_hour': 18
            },
            'content_performance': {
                'posts': {
                    'avg_engagement_rate': 4.2,
                    'total_posts': 890,
                    'trend': 'increasing'
                },
                'reels': {
                    'avg_engagement_rate': 6.8,
                    'total_reels': 340,
                    'trend': 'increasing'
                },
                'stories': {
                    'avg_engagement_rate': 3.1,
                    'total_stories': 1200,
                    'trend': 'stable'
                }
            },
            'audience_insights': {
                'peak_activity_hours': [9, 12, 18, 21],
                'most_active_days': ['Monday', 'Wednesday', 'Friday'],
                'engagement_by_age_group': {
                    '18-24': 35.2,
                    '25-34': 42.1,
                    '35-44': 15.7,
                    '45+': 7.0
                }
            },
            'generated_at': datetime.now().isoformat()
        }
        return Response(data)

class ContentInsightsAPIView(APIView):
    """Content Insights API"""
    
    def get(self, request):
        data = {
            'content_analysis': {
                'top_performing_categories': [
                    {'category': 'fitness', 'avg_engagement': 8.2, 'post_count': 245},
                    {'category': 'technology', 'avg_engagement': 6.9, 'post_count': 189},
                    {'category': 'travel', 'avg_engagement': 7.5, 'post_count': 156},
                    {'category': 'food', 'avg_engagement': 5.8, 'post_count': 134},
                    {'category': 'fashion', 'avg_engagement': 6.2, 'post_count': 201}
                ],
                'content_themes': {
                    'motivational': 28.5,
                    'educational': 23.2,
                    'entertainment': 19.8,
                    'promotional': 15.1,
                    'behind_the_scenes': 13.4
                },
                'optimal_posting_times': {
                    'weekdays': [9, 12, 18],
                    'weekends': [10, 14, 19],
                    'best_overall': 18
                }
            },
            'hashtag_performance': {
                'top_hashtags': [
                    {'hashtag': '#fitness', 'usage_count': 456, 'avg_engagement': 7.8},
                    {'hashtag': '#motivation', 'usage_count': 389, 'avg_engagement': 8.1},
                    {'hashtag': '#tech', 'usage_count': 267, 'avg_engagement': 6.4},
                    {'hashtag': '#travel', 'usage_count': 234, 'avg_engagement': 7.2},
                    {'hashtag': '#lifestyle', 'usage_count': 445, 'avg_engagement': 5.9}
                ],
                'trending_hashtags': [
                    '#mondaymotivation',
                    '#techtuesday', 
                    '#wanderlust',
                    '#selfcare',
                    '#productivity'
                ]
            },
            'content_format_insights': {
                'carousel_posts': {
                    'engagement_rate': 7.2,
                    'optimal_slide_count': 5,
                    'best_performing_type': 'educational'
                },
                'single_image_posts': {
                    'engagement_rate': 4.8,
                    'best_performing_style': 'lifestyle'
                },
                'video_posts': {
                    'engagement_rate': 6.1,
                    'optimal_duration': '15-30 seconds'
                },
                'reels': {
                    'engagement_rate': 9.3,
                    'optimal_duration': '15-30 seconds',
                    'best_performing_type': 'entertainment'
                }
            },
            'audience_behavior': {
                'average_time_spent': '2.5 minutes',
                'scroll_through_rate': 75.2,
                'save_rate': 12.8,
                'share_rate': 8.4,
                'comment_rate': 5.6
            },
            'generated_at': datetime.now().isoformat()
        }
        return Response(data)

# Backup simple views
@api_view(['GET'])
def analytics_overview(request):
    data = {
        'message': 'Analytics overview endpoint',
        'total_influencers': 25,
        'total_posts': 1250,
        'avg_engagement': 4.2
    }
    return Response(data)

def analytics_list(request):
    data = {
        'results': [
            {'metric': 'engagement_rate', 'value': 4.2},
            {'metric': 'total_reach', 'value': 2500000},
            {'metric': 'growth_rate', 'value': 12.5}
        ],
        'message': 'Analytics data available'
    }
    return JsonResponse(data)
