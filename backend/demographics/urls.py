from django.urls import path
from . import views

urlpatterns = [
    path('<int:influencer_id>/', views.DemographicsDetailView.as_view(), name='demographics-detail'),
]
