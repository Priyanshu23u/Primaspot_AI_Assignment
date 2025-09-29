from django.shortcuts import render
from django.http import JsonResponse

def health_check(request):
    data = {
        'status': 'healthy',
        'message': 'Instagram Analytics API is running',
        'timestamp': '2024-03-16T10:00:00Z'
    }
    return JsonResponse(data)

def api_info(request):
    data = {
        'name': 'Instagram Analytics API',
        'version': '1.0.0',
        'endpoints': [
            '/api/v1/influencers/',
            '/api/v1/posts/',
            '/api/v1/reels/',
            '/api/v1/demographics/',
        ]
    }
    return JsonResponse(data)
