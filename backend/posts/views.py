from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from datetime import datetime
from .models import Post

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    
    def list(self, request):
        posts = Post.objects.all()
        data = []
        for post in posts:
            data.append({
                'id': post.id,
                'shortcode': getattr(post, 'shortcode', ''),
                'caption': getattr(post, 'caption', ''),
                'likes_count': getattr(post, 'likes_count', 0),
                'comments_count': getattr(post, 'comments_count', 0),
                'influencer': post.influencer.username if hasattr(post, 'influencer') else '',
                'media_url': getattr(post, 'media_url', ''),
            })
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        # Get trending posts (mock for now)
        data = [
            {
                'id': 1,
                'shortcode': 'ABC123',
                'caption': 'Trending post',
                'likes_count': 5000,
                'comments_count': 250,
                'engagement_rate': 8.5
            }
        ]
        return Response({'results': data})

class PostAnalyticsAPIView(APIView):
    """Post Analytics API"""
    
    def get(self, request, post_id):
        data = {
            'post_id': post_id,
            'analytics': {
                'engagement_rate': 6.2,
                'reach': 15000,
                'impressions': 25000,
                'saves': 340,
                'shares': 125
            },
            'generated_at': datetime.now().isoformat()
        }
        return Response(data)

def post_list(request):
    posts = Post.objects.all()
    data = {
        'results': [
            {
                'id': post.id,
                'shortcode': getattr(post, 'shortcode', ''),
                'caption': getattr(post, 'caption', ''),
                'likes_count': getattr(post, 'likes_count', 0),
                'comments_count': getattr(post, 'comments_count', 0),
            }
            for post in posts
        ]
    }
    return JsonResponse(data)
