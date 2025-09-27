# demographics/urls.py
from django.urls import path
from . import views

app_name = 'demographics'

urlpatterns = [
    # Simple API endpoints without router - WORKING
    path('', views.DemographicsListAPIView.as_view(), name='demographics-list'),
    path('<int:influencer_id>/', views.DemographicsDetailAPIView.as_view(), name='demographics-detail'),
]
