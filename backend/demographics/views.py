from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from influencers.models import Influencer
from .models import AudienceDemographics
from .serializers import AudienceDemographicsSerializer

class DemographicsDetailView(APIView):
    """
    Get demographics for an influencer
    """
    def get(self, request, influencer_id):
        influencer = get_object_or_404(Influencer, id=influencer_id)
        
        try:
            demographics = influencer.demographics
            serializer = AudienceDemographicsSerializer(demographics)
            return Response(serializer.data)
        except AudienceDemographics.DoesNotExist:
            return Response(
                {'message': 'Demographics not available for this influencer'},
                status=status.HTTP_404_NOT_FOUND
            )
