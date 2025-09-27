from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/influencers/', include('influencers.urls')),
    path('api/v1/posts/', include('posts.urls')),
    path('api/v1/reels/', include('reels.urls')),
    path('api/v1/demographics/', include('demographics.urls')),
    path('api/v1/scraping/', include('scraping.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
