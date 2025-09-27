from rest_framework import serializers
from .models import AudienceDemographics

class AudienceDemographicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudienceDemographics
        exclude = ['id', 'influencer']
