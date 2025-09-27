from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post, PostAnalysis
from .serializers import PostSerializer, PostAnalysisSerializer

class PostViewSet(viewsets.ModelViewSet):
    """
    Complete CRUD ViewSet for Post model
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['influencer', 'is_analyzed', 'is_video', 'vibe_classification']
    search_fields = ['caption', 'shortcode', 'influencer__username']
    ordering_fields = ['likes_count', 'comments_count', 'post_date', 'quality_score']
    ordering = ['-post_date']
    
    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        """Trigger AI analysis for specific post"""
        post = self.get_object()
        from analytics.tasks import analyze_single_post
        analyze_single_post.delay(post.id)
        return Response({'message': 'Analysis initiated for post'})
    
    @action(detail=False, methods=['get'])
    def top_performing(self, request):
        """Get top performing posts"""
        top_posts = self.queryset.order_by('-likes_count')[:20]
        serializer = self.get_serializer(top_posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_vibe(self, request):
        """Get posts grouped by vibe classification"""
        vibe = request.query_params.get('vibe')
        if vibe:
            posts = self.queryset.filter(vibe_classification=vibe)
            serializer = self.get_serializer(posts, many=True)
            return Response(serializer.data)
        return Response({'error': 'Vibe parameter required'}, status=400)

class PostAnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only ViewSet for Post Analysis
    """
    queryset = PostAnalysis.objects.all()
    serializer_class = PostAnalysisSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['category', 'mood']
    ordering = ['-created_at']
