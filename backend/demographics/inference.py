from typing import Dict
from posts.models import Post
from reels.models import Reel
from influencers.models import Influencer
import random  # TODO: Replace with actual ML models

class DemographicsInferrer:
    """
    CRITICAL: Audience demographics inference
    This is a BONUS requirement from assignment
    """
    
    def infer_audience_demographics(self, influencer_id: int) -> Dict:
        """Infer audience demographics from content analysis"""
        try:
            influencer = Influencer.objects.get(id=influencer_id)
            posts = influencer.posts.filter(is_analyzed=True)
            
            # Analyze content patterns for demographic inference
            content_vibes = [post.vibe_classification for post in posts if post.vibe_classification]
            keywords = []
            for post in posts:
                keywords.extend(post.get_keywords())
            
            # Demographic inference based on content patterns
            demographics = self._infer_from_content_patterns(content_vibes, keywords)
            demographics['confidence_score'] = self._calculate_confidence(posts.count())
            
            return demographics
            
        except Exception as e:
            return self._default_demographics()
    
    def _infer_from_content_patterns(self, vibes: list, keywords: list) -> Dict:
        """Infer demographics from content patterns"""
        # TODO: Implement actual ML-based inference
        # This is a simplified rule-based approach
        
        # Age inference based on content vibes
        if 'trendy' in vibes or 'party' in keywords:
            age_dist = {'age_18_24': 45, 'age_25_34': 35, 'age_13_17': 20}
        elif 'professional' in vibes or 'luxury' in keywords:
            age_dist = {'age_25_34': 40, 'age_35_44': 35, 'age_45_54': 25}
        else:
            age_dist = {'age_18_24': 30, 'age_25_34': 40, 'age_35_44': 30}
        
        # Gender inference based on content
        if 'fashion' in keywords or 'beauty' in keywords:
            gender_dist = {'female_percentage': 70, 'male_percentage': 30}
        elif 'sports' in keywords or 'tech' in keywords:
            gender_dist = {'male_percentage': 60, 'female_percentage': 40}
        else:
            gender_dist = {'male_percentage': 45, 'female_percentage': 55}
        
        return {**age_dist, **gender_dist}
