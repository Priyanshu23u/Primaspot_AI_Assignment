# posts/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Post
from influencers.models import Influencer

class PostViewSet(viewsets.ViewSet):
    """
    Post ViewSet for API - Supports all post-level data requirements
    """
    
    def list(self, request):
        """
        List all posts or posts for specific influencer
        Implements IMPORTANT REQUIREMENTS: Post-Level Data
        """
        influencer_id = request.query_params.get('influencer')
        analyzed_only = request.query_params.get('analyzed_only')
        limit = int(request.query_params.get('limit', 50))
        
        if influencer_id:
            try:
                influencer = get_object_or_404(Influencer, pk=influencer_id)
                posts = influencer.posts.all()
            except:
                return Response({'error': 'Invalid influencer ID'}, status=400)
        else:
            posts = Post.objects.all()
        
        if analyzed_only == 'true':
            posts = posts.filter(is_analyzed=True)
        
        posts = posts.order_by('-post_date')[:limit]
        
        # Build comprehensive response
        posts_data = []
        for post in posts:
            post_data = {
                'id': post.id,
                'influencer_id': post.influencer.id,
                'influencer_username': post.influencer.username,
                'post_id': post.post_id,
                'shortcode': post.shortcode,
                'image_url': post.image_url,
                'caption': post.caption,
                'likes_count': post.likes_count,
                'comments_count': post.comments_count,
                'post_date': post.post_date,
                'is_video': post.is_video,
                'keywords': post.keywords,
                'vibe_classification': post.vibe_classification,
                'quality_score': float(post.quality_score) if post.quality_score else 0.0,
                'is_analyzed': post.is_analyzed,
                'analysis_date': post.analysis_date
            }
            posts_data.append(post_data)
        
        return Response({
            'count': len(posts_data),
            'results': posts_data
        })
