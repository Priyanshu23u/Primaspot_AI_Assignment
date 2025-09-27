# instagram_backend/celery.py
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

# Set the default Django settings module for the 'celery' program
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings')

# Create the Celery application
app = Celery('instagram_backend')

# Load task modules from all registered Django app configs
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()

# Celery Beat configuration for scheduled tasks
app.conf.beat_schedule = {
    'daily-influencer-update': {
        'task': 'scraping.tasks.daily_influencer_update',
        'schedule': 86400.0,  # Run daily (86400 seconds)
    },
    'weekly-analytics-report': {
        'task': 'analytics.tasks.generate_weekly_analytics_report',
        'schedule': 604800.0,  # Run weekly (7 days)
    },
    'hourly-engagement-tracking': {
        'task': 'analytics.tasks.track_engagement_metrics',
        'schedule': 3600.0,  # Run hourly
    },
}

app.conf.timezone = 'UTC'

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
