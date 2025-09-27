from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Reel, ReelAnalysis
from .serializers import ReelSerializer, ReelAnalysisSerializer

class ReelViewSet(viewsets.ModelViewSet):
    """
    Complete CRUD ViewSet for Reel model
    """
    queryset = Reel.objects.all()
    serializer_class = ReelSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['influencer', 'is_analyzed', 'vibe_classification']
    search_fields = ['caption', 'shortcode', 'influencer__username']
    ordering_fields = ['views_count', 'likes_count', 'comments_count', 'post_date']
    ordering = ['-post_date']
    
    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        """Trigger AI analysis for specific reel"""
        reel = self.get_object()
        from analytics.tasks import analyze_single_reel
        analyze_single_reel.delay(reel.id)
        return Response({'message': 'Analysis initiated for reel'})
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending reels by views"""
        trending_reels = self.queryset.order_by('-views_count')[:20]
        serializer = self.get_serializer(trending_reels, many=True)
        return Response(serializer.data)

class ReelAnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only ViewSet for Reel Analysis
    """
    queryset = ReelAnalysis.objects.all()
    serializer_class = ReelAnalysisSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['environment', 'time_of_day', 'activity_level']
 