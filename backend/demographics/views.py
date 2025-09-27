# demographics/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import AudienceDemographics
from influencers.models import Influencer
from django.shortcuts import get_object_or_404

class DemographicsListAPIView(APIView):
    """Simple list view for demographics"""
    
    def get(self, request):
        """List all demographics"""
        demographics = AudienceDemographics.objects.all()
        data = []
        for demo in demographics:
            data.append({
                'id': demo.id,
                'influencer_id': demo.influencer.id,
                'username': demo.influencer.username,
                'age_18_24': float(demo.age_18_24),
                'age_25_34': float(demo.age_25_34),
                'male_percentage': float(demo.male_percentage),
                'female_percentage': float(demo.female_percentage),
                'confidence_score': float(demo.confidence_score)
            })
        
        return Response({
            'count': len(data),
            'results': data
        })

class DemographicsDetailAPIView(APIView):
    """Simple detail view for demographics"""
    
    def get(self, request, influencer_id):
        """Get demographics for specific influencer"""
        try:
            influencer = get_object_or_404(Influencer, pk=influencer_id)
            demographics = AudienceDemographics.objects.get(influencer=influencer)
            
            return Response({
                'influencer_id': influencer.id,
                'username': influencer.username,
                'full_name': influencer.full_name,
                'age_distribution': {
                    'age_13_17': float(demographics.age_13_17),
                    'age_18_24': float(demographics.age_18_24),
                    'age_25_34': float(demographics.age_25_34),
                    'age_35_44': float(demographics.age_35_44),
                    'age_45_54': float(demographics.age_45_54),
                    'age_55_plus': float(demographics.age_55_plus),
                },
                'gender_distribution': {
                    'male_percentage': float(demographics.male_percentage),
                    'female_percentage': float(demographics.female_percentage)
                },
                'geographic_distribution': {
                    'top_countries': demographics.top_countries,
                    'top_cities': demographics.top_cities
                },
                'activity_patterns': {
                    'peak_activity_hours': demographics.peak_activity_hours,
                    'most_active_days': demographics.most_active_days
                },
                'confidence_score': float(demographics.confidence_score),
                'inference_date': demographics.inference_date
            })
            
        except AudienceDemographics.DoesNotExist:
            return Response({
                'error': 'Demographics not available for this influencer',
                'message': 'Demographics inference not yet completed'
            }, status=404)
