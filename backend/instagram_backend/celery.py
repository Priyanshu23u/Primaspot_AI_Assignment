from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings.development')

app = Celery('instagram_backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

# Configure periodic tasks
app.conf.beat_schedule = {
    'update-influencer-data': {
        'task': 'scraping.tasks.update_all_influencers',
        'schedule': 3600.0,  # Every hour
    },
    'process-pending-images': {
        'task': 'analytics.tasks.process_pending_images',
        'schedule': 300.0,  # Every 5 minutes
    },
}
