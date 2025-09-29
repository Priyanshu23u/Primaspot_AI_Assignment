from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from datetime import datetime
from django.utils import timezone
from influencers.models import Influencer
from posts.models import Post
from scraping.rate_limit_bypass import InstagramRateLimitBypass
import logging

logger = logging.getLogger(__name__)

class AdvancedScrapingView(APIView):
    """Advanced scraping with comprehensive rate limit bypass"""
    
    def post(self, request, influencer_id=None):
        username = request.data.get('username', 'zindagii_gulzar_hai_')
        
        try:
            print(f"🚀 Starting ADVANCED SCRAPING for @{username}")
            
            # Initialize bypass system
            bypass_system = InstagramRateLimitBypass()
            
            # Extract data using best available method
            extraction_result = bypass_system.extract_instagram_data(username)
            
            if extraction_result.get('success'):
                # Save to database
                self.save_extracted_data(extraction_result, username)
                
                response_data = {
                    'success': True,
                    'message': f'✅ Advanced extraction successful for @{username}',
                    'username': username,
                    'extraction_method': extraction_result.get('method', 'unknown'),
                    'data_source': 'instagram_advanced_bypass',
                    'extracted_at': extraction_result.get('extracted_at'),
                    
                    # Profile summary
                    'profile_data': extraction_result.get('profile_data', {}),
                    
                    # Posts summary
                    'posts_summary': {
                        'total_posts_extracted': len(extraction_result.get('posts_data', [])),
                        'sample_posts': extraction_result.get('posts_data', [])[:3]
                    },
                    
                    'bypass_status': {
                        'rate_limiting_bypassed': True,
                        'method_used': extraction_result.get('method'),
                        'success_factors': [
                            'Multiple extraction methods',
                            'Dynamic method selection',
                            'Rate limit aware scheduling',
                            'Human behavior simulation'
                        ]
                    }
                }
                
                return Response(response_data, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'message': f'All bypass methods failed for @{username}',
                    'error': extraction_result.get('error', 'Unknown error'),
                    'attempted_methods': ['stealth_instaloader', 'browser_selenium', 'requests_session', 'mobile_simulation'],
                    'recommendation': 'Try again in 2-4 hours or use VPN'
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                
        except Exception as e:
            logger.error(f"Advanced scraping failed: {e}")
            return Response({
                'success': False,
                'error': str(e),
                'message': 'Advanced scraping system error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def save_extracted_data(self, extraction_result, username):
        """Save extracted data to database"""
        try:
            profile_data = extraction_result.get('profile_data', {})
            
            # Create or update influencer
            influencer, created = Influencer.objects.get_or_create(
                username=username,
                defaults={
                    'full_name': profile_data.get('full_name', ''),
                    'bio': profile_data.get('bio', ''),
                    'followers_count': profile_data.get('followers_count', 0),
                    'following_count': profile_data.get('following_count', 0),
                    'posts_count': profile_data.get('posts_count', 0),
                    'is_verified': profile_data.get('is_verified', False),
                    'last_scraped': timezone.now()
                }
            )
            
            if not created:
                # Update existing
                for field, value in profile_data.items():
                    if hasattr(influencer, field):
                        setattr(influencer, field, value)
                influencer.last_scraped = timezone.now()
                influencer.save()
            
            # Save posts data
            posts_data = extraction_result.get('posts_data', [])
            for post_data in posts_data:
                Post.objects.get_or_create(
                    shortcode=post_data.get('shortcode', f"demo_{post_data.get('post_number', 1)}"),
                    influencer=influencer,
                    defaults={
                        'caption': post_data.get('caption', ''),
                        'likes_count': post_data.get('likes_count', 0),
                        'comments_count': post_data.get('comments_count', 0),
                        'media_type': post_data.get('media_type', 'photo'),
                        'posted_at': post_data.get('posted_at', timezone.now())
                    }
                )
            
            logger.info(f"✅ Saved advanced extraction data for @{username}")
            
        except Exception as e:
            logger.error(f"Database save failed: {e}")

class BypassStatusView(APIView):
    """Check rate limit bypass system status"""
    
    def get(self, request):
        try:
            bypass_system = InstagramRateLimitBypass()
            
            # Get method statuses
            method_statuses = []
            for method in bypass_system.methods:
                status_info = {
                    'name': method['name'],
                    'success_rate': f"{method['success_rate']:.1%}",
                    'last_used': method['last_used'].isoformat() if method['last_used'] else 'Never',
                    'cooldown_minutes': method['cooldown_minutes'],
                    'available': bypass_system.get_best_available_method() == method
                }
                method_statuses.append(status_info)
            
            return Response({
                'bypass_system_status': 'operational',
                'available_methods': len([m for m in method_statuses if m['available']]),
                'total_methods': len(method_statuses),
                'methods': method_statuses,
                'recommendation': 'Advanced rate limiting bypass system ready',
                'features': [
                    'Multiple extraction methods',
                    'Dynamic method selection',
                    'Automatic cooldown management',
                    'Success rate tracking',
                    'Browser automation',
                    'Mobile simulation'
                ]
            })
            
        except Exception as e:
            return Response({
                'error': str(e),
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
