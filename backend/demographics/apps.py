# demographics/apps.py
from django.apps import AppConfig

class DemographicsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'demographics'
    verbose_name = 'Audience Demographics'
