from celery import shared_task
from django.utils import timezone
from posts.models import Post, PostAnalysis
from reels.models import Reel, ReelAnalysis
from demographics.models import AudienceDemographics
from .image_processing import ImageAnalyzer
from .video_processing import VideoAnalyzer
from .demographics_inference import DemographicsInferrer
import logging

logger = logging.getLogger('analytics')

@shared_task
def analyze_influencer_posts(influencer_id: int):
    """
    CRITICAL: This task performs AI analysis on posts
    This is a CORE requirement from the assignment
    """
    try:
        posts = Post.objects.filter(
            influencer_id=influencer_id, 
            is_analyzed=False
        )
        
        analyzer = ImageAnalyzer()
        processed_count = 0
        
        for post in posts:
            try:
                # Perform AI analysis
                analysis_result = analyzer.analyze_post_image(post.image_url)
                
                # Update post with analysis
                post.keywords = analysis_result['keywords']
                post.vibe_classification = analysis_result['vibe_classification']
                post.quality_score = analysis_result['quality_score']
                post.is_analyzed = True
                post.analysis_date = timezone.now()
                post.save()
                
                # Create detailed analysis record
                PostAnalysis.objects.update_or_create(
                    post=post,
                    defaults={
                        'lighting_score': analysis_result['lighting_score'],
                        'composition_score': analysis_result['composition_score'],
                        'visual_appeal_score': analysis_result['visual_appeal_score'],
                        'detected_objects': analysis_result['detected_objects'],
                        'dominant_colors': analysis_result['dominant_colors'],
                    }
                )
                
                processed_count += 1
                
            except Exception as e:
                logger.error(f"Failed to analyze post {post.id}: {str(e)}")
        
        # Update influencer metrics
        from influencers.models import Influencer
        influencer = Influencer.objects.get(id=influencer_id)
        influencer.update_engagement_metrics()
        
        logger.info(f"Analyzed {processed_count} posts for influencer {influencer_id}")
        return f"Analyzed {processed_count} posts"
        
    except Exception as e:
        logger.error(f"Post analysis task failed: {str(e)}")
        return f"Analysis failed: {str(e)}"

@shared_task
def infer_demographics(influencer_id: int):
    """
    CRITICAL: Demographic inference - BONUS requirement
    """
    try:
        inferrer = DemographicsInferrer()
        demographics = inferrer.infer_audience_demographics(influencer_id)
        
        AudienceDemographics.objects.update_or_create(
            influencer_id=influencer_id,
            defaults=demographics
        )
        
        return f"Demographics inferred for influencer {influencer_id}"
        
    except Exception as e:
        logger.error(f"Demographics inference failed: {str(e)}")
        return f"Demographics inference failed: {str(e)}"
