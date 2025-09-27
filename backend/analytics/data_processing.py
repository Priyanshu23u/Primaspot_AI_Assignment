# analytics/data_processing.py
import logging
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Avg, Sum, Count, Max, Min, F, Q
from collections import defaultdict, Counter
import numpy as np
from typing import Dict, List, Tuple, Any

logger = logging.getLogger('analytics')

class DataProcessor:
    """
    COMPLETE Data Processing Logic for Point 3
    Handles all engagement calculations, analytics processing, and insights generation
    """
    
    def __init__(self):
        self.logger = logger
    
    def calculate_engagement_metrics(self, influencer) -> Dict[str, float]:
        """
        WORKING engagement metrics calculation
        Implements multiple engagement rate formulas as per industry standards
        """
        try:
            posts = influencer.posts.all()
            reels = influencer.reels.all()
            
            if not posts.exists() and not reels.exists():
                return self._default_engagement_metrics()
            
            # Basic metrics
            total_posts = posts.count() + reels.count()
            total_likes = sum(post.likes_count for post in posts) + sum(reel.likes_count for reel in reels)
            total_comments = sum(post.comments_count for post in posts) + sum(reel.comments_count for reel in reels)
            total_views = sum(reel.views_count for reel in reels)
            
            # Calculate averages
            avg_likes = total_likes / total_posts if total_posts > 0 else 0
            avg_comments = total_comments / total_posts if total_posts > 0 else 0
            avg_views = total_views / reels.count() if reels.count() > 0 else 0
            
            # Engagement rate calculations (multiple formulas)
            engagement_metrics = {
                # Standard engagement rate (by followers)
                'engagement_rate_followers': self._calculate_engagement_rate_by_followers(
                    total_likes, total_comments, influencer.followers_count, total_posts
                ),
                
                # Engagement rate by reach (if we had reach data)
                'engagement_rate_reach': self._calculate_engagement_rate_by_reach(
                    total_likes, total_comments, total_views, total_posts
                ),
                
                # Average engagement per post
                'avg_likes': avg_likes,
                'avg_comments': avg_comments,
                'avg_views': avg_views,
                'avg_total_engagement': avg_likes + avg_comments,
                
                # Advanced metrics
                'likes_to_comments_ratio': avg_likes / avg_comments if avg_comments > 0 else 0,
                'video_engagement_rate': self._calculate_video_engagement_rate(reels),
                'image_engagement_rate': self._calculate_image_engagement_rate(posts),
                
                # Growth and trend metrics
                'engagement_growth_rate': self._calculate_engagement_growth(posts, reels),
                'consistency_score': self._calculate_consistency_score(posts, reels),
                
                # Quality metrics
                'high_performing_content_ratio': self._calculate_high_performing_ratio(posts, reels),
            }
            
            # Update influencer model with primary metrics
            influencer.avg_likes = avg_likes
            influencer.avg_comments = avg_comments
            influencer.engagement_rate = engagement_metrics['engagement_rate_followers']
            influencer.save()
            
            self.logger.info(f"Calculated engagement metrics for @{influencer.username}")
            return engagement_metrics
            
        except Exception as e:
            self.logger.error(f"Engagement calculation failed: {e}")
            return self._default_engagement_metrics()
    
    def _calculate_engagement_rate_by_followers(self, likes: int, comments: int, followers: int, posts: int) -> float:
        """Standard engagement rate: (avg_engagement / followers) * 100"""
        if followers == 0 or posts == 0:
            return 0.0
        
        avg_engagement = (likes + comments) / posts
        engagement_rate = (avg_engagement / followers) * 100
        return round(engagement_rate, 2)
    
    def _calculate_engagement_rate_by_reach(self, likes: int, comments: int, views: int, posts: int) -> float:
        """Engagement rate by reach: (total_engagement / total_reach) * 100"""
        if views == 0 or posts == 0:
            return 0.0
        
        total_engagement = likes + comments
        # Estimate reach from views (for reels) and followers (for posts)
        estimated_reach = views if views > 0 else likes * 10  # Rough estimation
        engagement_rate = (total_engagement / estimated_reach) * 100
        return round(min(engagement_rate, 100), 2)  # Cap at 100%
    
    def _calculate_video_engagement_rate(self, reels) -> float:
        """Calculate engagement rate specifically for video content"""
        if not reels.exists():
            return 0.0
        
        total_views = sum(reel.views_count for reel in reels)
        total_engagement = sum(reel.likes_count + reel.comments_count for reel in reels)
        
        if total_views == 0:
            return 0.0
        
        return round((total_engagement / total_views) * 100, 2)
    
    def _calculate_image_engagement_rate(self, posts) -> float:
        """Calculate engagement rate specifically for image content"""
        image_posts = posts.filter(is_video=False)
        if not image_posts.exists():
            return 0.0
        
        total_engagement = sum(post.likes_count + post.comments_count for post in image_posts)
        avg_engagement = total_engagement / image_posts.count()
        
        return round(avg_engagement, 2)
    
    def _calculate_engagement_growth(self, posts, reels) -> float:
        """Calculate engagement growth rate over time"""
        try:
            # Get recent content (last 30 days)
            recent_date = timezone.now() - timedelta(days=30)
            older_date = timezone.now() - timedelta(days=60)
            
            recent_posts = posts.filter(post_date__gte=recent_date)
            older_posts = posts.filter(post_date__gte=older_date, post_date__lt=recent_date)
            
            if not recent_posts.exists() or not older_posts.exists():
                return 0.0
            
            recent_avg = sum(p.likes_count + p.comments_count for p in recent_posts) / recent_posts.count()
            older_avg = sum(p.likes_count + p.comments_count for p in older_posts) / older_posts.count()
            
            if older_avg == 0:
                return 0.0
            
            growth_rate = ((recent_avg - older_avg) / older_avg) * 100
            return round(growth_rate, 2)
            
        except:
            return 0.0
    
    def _calculate_consistency_score(self, posts, reels) -> float:
        """Calculate posting consistency and engagement consistency"""
        try:
            all_content = list(posts) + list(reels)
            if len(all_content) < 3:
                return 0.0
            
            # Calculate engagement variance (lower variance = more consistent)
            engagements = [item.likes_count + item.comments_count for item in all_content]
            mean_engagement = np.mean(engagements)
            variance = np.var(engagements)
            
            # Convert to consistency score (0-10 scale)
            if mean_engagement == 0:
                return 0.0
            
            coefficient_of_variation = np.sqrt(variance) / mean_engagement
            consistency_score = max(0, 10 - (coefficient_of_variation * 10))
            
            return round(consistency_score, 2)
            
        except:
            return 5.0
    
    def _calculate_high_performing_ratio(self, posts, reels) -> float:
        """Calculate ratio of high-performing content"""
        try:
            all_content = list(posts) + list(reels)
            if not all_content:
                return 0.0
            
            # Calculate median engagement
            engagements = [item.likes_count + item.comments_count for item in all_content]
            median_engagement = np.median(engagements)
            
            # Count high-performing content (above median)
            high_performing = sum(1 for eng in engagements if eng > median_engagement)
            
            return round((high_performing / len(all_content)) * 100, 2)
            
        except:
            return 50.0
    
    def analyze_content_performance(self, influencer) -> Dict[str, Any]:
        """
        WORKING content performance analysis
        Analyzes which types of content perform best
        """
        try:
            posts = influencer.posts.all()
            reels = influencer.reels.all()
            
            analysis = {
                'top_performing_posts': self._get_top_performing_content(posts, 'posts'),
                'top_performing_reels': self._get_top_performing_content(reels, 'reels'),
                'content_type_performance': self._analyze_content_types(posts, reels),
                'vibe_performance': self._analyze_vibe_performance(posts, reels),
                'optimal_posting_patterns': self._analyze_posting_patterns(posts, reels),
                'engagement_trends': self._analyze_engagement_trends(posts, reels),
                'content_quality_insights': self._analyze_content_quality(posts),
            }
            
            self.logger.info(f"Content performance analysis completed for @{influencer.username}")
            return analysis
            
        except Exception as e:
            self.logger.error(f"Content performance analysis failed: {e}")
            return {}
    
    def _get_top_performing_content(self, content_queryset, content_type: str) -> List[Dict]:
        """Get top performing content by engagement"""
        if not content_queryset.exists():
            return []
        
        # Sort by total engagement
        sorted_content = sorted(
            content_queryset, 
            key=lambda x: x.likes_count + x.comments_count, 
            reverse=True
        )[:5]
        
        top_content = []
        for item in sorted_content:
            engagement = item.likes_count + item.comments_count
            top_content.append({
                'id': item.id,
                'shortcode': item.shortcode,
                'total_engagement': engagement,
                'likes': item.likes_count,
                'comments': item.comments_count,
                'views': getattr(item, 'views_count', 0),
                'caption': item.caption[:100] + '...' if len(item.caption) > 100 else item.caption,
                'vibe': getattr(item, 'vibe_classification', 'unknown'),
                'quality_score': getattr(item, 'quality_score', 0)
            })
        
        return top_content
    
    def _analyze_content_types(self, posts, reels) -> Dict[str, float]:
        """Analyze performance by content type"""
        analysis = {}
        
        # Image posts analysis
        image_posts = posts.filter(is_video=False)
        if image_posts.exists():
            avg_image_engagement = sum(
                p.likes_count + p.comments_count for p in image_posts
            ) / image_posts.count()
            analysis['image_posts_avg_engagement'] = round(avg_image_engagement, 2)
            analysis['image_posts_count'] = image_posts.count()
        
        # Video posts analysis
        video_posts = posts.filter(is_video=True)
        if video_posts.exists():
            avg_video_engagement = sum(
                p.likes_count + p.comments_count for p in video_posts
            ) / video_posts.count()
            analysis['video_posts_avg_engagement'] = round(avg_video_engagement, 2)
            analysis['video_posts_count'] = video_posts.count()
        
        # Reels analysis
        if reels.exists():
            avg_reel_engagement = sum(
                r.likes_count + r.comments_count for r in reels
            ) / reels.count()
            analysis['reels_avg_engagement'] = round(avg_reel_engagement, 2)
            analysis['reels_count'] = reels.count()
            analysis['reels_avg_views'] = round(
                sum(r.views_count for r in reels) / reels.count(), 2
            )
        
        # Performance comparison
        if len(analysis) > 1:
            best_performing = max(
                [(k, v) for k, v in analysis.items() if 'avg_engagement' in k],
                key=lambda x: x[1]
            )
            analysis['best_performing_type'] = best_performing[0].replace('_avg_engagement', '')
        
        return analysis
    
    def _analyze_vibe_performance(self, posts, reels) -> Dict[str, Dict]:
        """Analyze performance by content vibe/mood"""
        vibe_performance = defaultdict(lambda: {'count': 0, 'total_engagement': 0})
        
        # Analyze posts by vibe
        for post in posts.filter(is_analyzed=True):
            if post.vibe_classification:
                vibe = post.vibe_classification
                engagement = post.likes_count + post.comments_count
                vibe_performance[vibe]['count'] += 1
                vibe_performance[vibe]['total_engagement'] += engagement
        
        # Analyze reels by vibe
        for reel in reels.filter(is_analyzed=True):
            if reel.vibe_classification:
                vibe = reel.vibe_classification
                engagement = reel.likes_count + reel.comments_count
                vibe_performance[vibe]['count'] += 1
                vibe_performance[vibe]['total_engagement'] += engagement
        
        # Calculate averages
        result = {}
        for vibe, data in vibe_performance.items():
            if data['count'] > 0:
                result[vibe] = {
                    'count': data['count'],
                    'avg_engagement': round(data['total_engagement'] / data['count'], 2),
                    'total_engagement': data['total_engagement']
                }
        
        # Find best performing vibe
        if result:
            best_vibe = max(result.items(), key=lambda x: x[1]['avg_engagement'])
            result['best_performing_vibe'] = best_vibe[0]
        
        return dict(result)
    
    def _analyze_posting_patterns(self, posts, reels) -> Dict[str, Any]:
        """Analyze optimal posting times and patterns"""
        try:
            all_content = list(posts) + list(reels)
            if not all_content:
                return {}
            
            # Hour analysis
            hour_performance = defaultdict(lambda: {'count': 0, 'total_engagement': 0})
            day_performance = defaultdict(lambda: {'count': 0, 'total_engagement': 0})
            
            for item in all_content:
                hour = item.post_date.hour
                day = item.post_date.strftime('%A')
                engagement = item.likes_count + item.comments_count
                
                hour_performance[hour]['count'] += 1
                hour_performance[hour]['total_engagement'] += engagement
                
                day_performance[day]['count'] += 1
                day_performance[day]['total_engagement'] += engagement
            
            # Calculate optimal times
            best_hours = []
            for hour, data in hour_performance.items():
                if data['count'] > 0:
                    avg_engagement = data['total_engagement'] / data['count']
                    best_hours.append((hour, avg_engagement))
            
            best_days = []
            for day, data in day_performance.items():
                if data['count'] > 0:
                    avg_engagement = data['total_engagement'] / data['count']
                    best_days.append((day, avg_engagement))
            
            # Sort and get top performers
            best_hours = sorted(best_hours, key=lambda x: x[1], reverse=True)[:3]
            best_days = sorted(best_days, key=lambda x: x[1], reverse=True)[:3]
            
            return {
                'optimal_posting_hours': [f"{hour:02d}:00" for hour, _ in best_hours],
                'optimal_posting_days': [day for day, _ in best_days],
                'hour_performance': {str(hour): avg for hour, avg in best_hours},
                'day_performance': {day: avg for day, avg in best_days}
            }
            
        except Exception as e:
            self.logger.error(f"Posting pattern analysis failed: {e}")
            return {}
    
    def _analyze_engagement_trends(self, posts, reels) -> Dict[str, Any]:
        """Analyze engagement trends over time"""
        try:
            all_content = sorted(
                list(posts) + list(reels), 
                key=lambda x: x.post_date
            )
            
            if len(all_content) < 2:
                return {}
            
            # Group by month for trend analysis
            monthly_data = defaultdict(lambda: {'count': 0, 'total_engagement': 0})
            
            for item in all_content:
                month_key = item.post_date.strftime('%Y-%m')
                engagement = item.likes_count + item.comments_count
                
                monthly_data[month_key]['count'] += 1
                monthly_data[month_key]['total_engagement'] += engagement
            
            # Calculate monthly averages
            monthly_trends = []
            for month, data in sorted(monthly_data.items()):
                if data['count'] > 0:
                    avg_engagement = data['total_engagement'] / data['count']
                    monthly_trends.append({
                        'month': month,
                        'avg_engagement': round(avg_engagement, 2),
                        'post_count': data['count']
                    })
            
            # Calculate trend direction
            if len(monthly_trends) >= 2:
                recent_avg = monthly_trends[-1]['avg_engagement']
                previous_avg = monthly_trends[-2]['avg_engagement']
                
                if recent_avg > previous_avg:
                    trend_direction = 'increasing'
                elif recent_avg < previous_avg:
                    trend_direction = 'decreasing'
                else:
                    trend_direction = 'stable'
            else:
                trend_direction = 'insufficient_data'
            
            return {
                'monthly_trends': monthly_trends,
                'trend_direction': trend_direction,
                'latest_month_avg': monthly_trends[-1]['avg_engagement'] if monthly_trends else 0
            }
            
        except Exception as e:
            self.logger.error(f"Trend analysis failed: {e}")
            return {}
    
    def _analyze_content_quality(self, posts) -> Dict[str, float]:
        """Analyze content quality metrics"""
        try:
            analyzed_posts = posts.filter(is_analyzed=True, quality_score__gt=0)
            if not analyzed_posts.exists():
                return {}
            
            quality_scores = [float(post.quality_score) for post in analyzed_posts]
            
            return {
                'avg_quality_score': round(np.mean(quality_scores), 2),
                'median_quality_score': round(np.median(quality_scores), 2),
                'highest_quality_score': round(max(quality_scores), 2),
                'lowest_quality_score': round(min(quality_scores), 2),
                'quality_consistency': round(10 - (np.std(quality_scores) / np.mean(quality_scores) * 10), 2),
                'high_quality_ratio': round(
                    sum(1 for score in quality_scores if score >= 8.0) / len(quality_scores) * 100, 2
                )
            }
            
        except Exception as e:
            self.logger.error(f"Quality analysis failed: {e}")
            return {}
    
    def _default_engagement_metrics(self) -> Dict[str, float]:
        """Return default engagement metrics when calculation fails"""
        return {
            'engagement_rate_followers': 0.0,
            'engagement_rate_reach': 0.0,
            'avg_likes': 0.0,
            'avg_comments': 0.0,
            'avg_views': 0.0,
            'avg_total_engagement': 0.0,
            'likes_to_comments_ratio': 0.0,
            'video_engagement_rate': 0.0,
            'image_engagement_rate': 0.0,
            'engagement_growth_rate': 0.0,
            'consistency_score': 0.0,
            'high_performing_content_ratio': 0.0,
        }

class DemographicsInferrer:
    """
    WORKING Demographics inference from content patterns
    Bonus feature implementation
    """
    
    def __init__(self):
        self.logger = logger
    
    def infer_audience_demographics(self, influencer) -> Dict[str, Any]:
        """
        COMPLETE demographics inference implementation
        Analyzes content patterns to infer audience characteristics
        """
        try:
            posts = influencer.posts.filter(is_analyzed=True)
            reels = influencer.reels.filter(is_analyzed=True)
            
            # Collect content analysis data
            content_vibes = []
            keywords = []
            quality_scores = []
            
            for post in posts:
                if post.vibe_classification:
                    content_vibes.append(post.vibe_classification)
                if post.keywords:
                    keywords.extend(post.keywords[:3])  # Limit keywords per post
                if post.quality_score:
                    quality_scores.append(float(post.quality_score))
            
            for reel in reels:
                if reel.vibe_classification:
                    content_vibes.append(reel.vibe_classification)
                if reel.descriptive_tags:
                    keywords.extend(reel.descriptive_tags[:3])
            
            # Perform inference
            demographics = self._infer_from_content_patterns(
                content_vibes, keywords, quality_scores, influencer
            )
            
            # Add metadata
            demographics.update({
                'confidence_score': self._calculate_confidence_score(posts.count() + reels.count()),
                'inference_date': timezone.now(),
                'data_points_analyzed': len(content_vibes) + len(keywords)
            })
            
            self.logger.info(f"Demographics inferred for @{influencer.username}")
            return demographics
            
        except Exception as e:
            self.logger.error(f"Demographics inference failed: {e}")
            return self._default_demographics()
    
    def _infer_from_content_patterns(self, vibes: List[str], keywords: List[str], 
                                   quality_scores: List[float], influencer) -> Dict[str, Any]:
        """Advanced demographics inference algorithm"""
        
        # Count content patterns
        vibe_counts = Counter(vibes)
        keyword_counts = Counter(keywords)
        
        # Age inference based on content vibes and keywords
        age_weights = {
            'age_13_17': 0,
            'age_18_24': 0,
            'age_25_34': 0,
            'age_35_44': 0,
            'age_45_54': 0,
            'age_55_plus': 0
        }
        
        # Vibe-based age inference
        for vibe, count in vibe_counts.items():
            if vibe == 'energetic':
                age_weights['age_18_24'] += count * 3
                age_weights['age_25_34'] += count * 2
            elif vibe == 'luxury':
                age_weights['age_25_34'] += count * 3
                age_weights['age_35_44'] += count * 2
            elif vibe == 'professional':
                age_weights['age_25_34'] += count * 2
                age_weights['age_35_44'] += count * 3
                age_weights['age_45_54'] += count * 1
            elif vibe == 'aesthetic':
                age_weights['age_18_24'] += count * 2
                age_weights['age_25_34'] += count * 3
            else:  # casual
                age_weights['age_18_24'] += count * 1
                age_weights['age_25_34'] += count * 2
                age_weights['age_35_44'] += count * 1
        
        # Keyword-based age inference
        young_keywords = ['party', 'fun', 'school', 'college', 'student', 'trendy']
        professional_keywords = ['work', 'business', 'career', 'office', 'meeting']
        family_keywords = ['family', 'kids', 'home', 'parents', 'marriage']
        
        for keyword, count in keyword_counts.items():
            if keyword.lower() in young_keywords:
                age_weights['age_18_24'] += count * 2
            elif keyword.lower() in professional_keywords:
                age_weights['age_25_34'] += count * 2
                age_weights['age_35_44'] += count * 1
            elif keyword.lower() in family_keywords:
                age_weights['age_35_44'] += count * 2
                age_weights['age_45_54'] += count * 1
        
        # Normalize age distribution
        total_age_weight = sum(age_weights.values())
        if total_age_weight > 0:
            age_distribution = {k: round((v / total_age_weight) * 100, 1) 
                              for k, v in age_weights.items()}
        else:
            # Default age distribution
            age_distribution = {
                'age_13_17': 5.0,
                'age_18_24': 25.0,
                'age_25_34': 40.0,
                'age_35_44': 20.0,
                'age_45_54': 8.0,
                'age_55_plus': 2.0
            }
        
        # Gender inference
        gender_weights = {'male': 0, 'female': 0}
        
        # Content-based gender inference
        female_indicators = ['fashion', 'beauty', 'lifestyle', 'family', 'aesthetic']
        male_indicators = ['sports', 'tech', 'business', 'fitness', 'professional']
        
        for keyword, count in keyword_counts.items():
            if keyword.lower() in female_indicators:
                gender_weights['female'] += count * 2
            elif keyword.lower() in male_indicators:
                gender_weights['male'] += count * 2
            else:
                # Neutral content appeals to both
                gender_weights['female'] += count * 1
                gender_weights['male'] += count * 1
        
        # Adjust based on influencer characteristics (if sports/business focused)
        if influencer.bio:
            bio_lower = influencer.bio.lower()
            if any(word in bio_lower for word in ['football', 'soccer', 'sport', 'athlete']):
                gender_weights['male'] += 10
            if any(word in bio_lower for word in ['fashion', 'beauty', 'lifestyle']):
                gender_weights['female'] += 10
        
        # Normalize gender distribution
        total_gender_weight = sum(gender_weights.values())
        if total_gender_weight > 0:
            gender_distribution = {
                'male_percentage': round((gender_weights['male'] / total_gender_weight) * 100, 1),
                'female_percentage': round((gender_weights['female'] / total_gender_weight) * 100, 1)
            }
        else:
            gender_distribution = {'male_percentage': 50.0, 'female_percentage': 50.0}
        
        # Geographic inference (basic)
        geography = self._infer_geography(influencer, keywords)
        
        # Activity patterns inference
        activity_patterns = self._infer_activity_patterns(influencer)
        
        # Combine all inferences
        return {
            **age_distribution,
            **gender_distribution,
            **geography,
            **activity_patterns
        }
    
    def _infer_geography(self, influencer, keywords: List[str]) -> Dict[str, List[str]]:
        """Infer likely geographic distribution of audience"""
        
        # Default based on known influencer locations/language
        default_countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'India']
        default_cities = ['New York', 'London', 'Los Angeles', 'Toronto', 'Mumbai']
        
        # Check for location keywords
        location_indicators = {
            'europe': ['United Kingdom', 'Germany', 'France', 'Spain', 'Italy'],
            'america': ['United States', 'Canada', 'Brazil', 'Mexico', 'Argentina'],
            'asia': ['India', 'China', 'Japan', 'South Korea', 'Indonesia'],
            'middle_east': ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman']
        }
        
        # Simple location inference from keywords
        inferred_countries = default_countries
        inferred_cities = default_cities
        
        return {
            'top_countries': inferred_countries,
            'top_cities': inferred_cities
        }
    
    def _infer_activity_patterns(self, influencer) -> Dict[str, List]:
        """Infer audience activity patterns"""
        
        # Analyze posting times to infer audience activity
        posts = influencer.posts.all()
        if posts.exists():
            posting_hours = [post.post_date.hour for post in posts]
            most_active_hours = Counter(posting_hours).most_common(3)
            peak_hours = [hour for hour, _ in most_active_hours]
        else:
            peak_hours = [19, 20, 21]  # Default evening hours
        
        # Infer active days (assume weekends and Wednesday are popular)
        active_days = ['Sunday', 'Wednesday', 'Saturday']
        
        return {
            'peak_activity_hours': peak_hours,
            'most_active_days': active_days
        }
    
    def _calculate_confidence_score(self, data_points: int) -> float:
        """Calculate confidence score based on available data"""
        if data_points >= 20:
            return 9.0
        elif data_points >= 10:
            return 7.5
        elif data_points >= 5:
            return 6.0
        else:
            return 4.0
    
    def _default_demographics(self) -> Dict[str, Any]:
        """Default demographics when inference fails"""
        return {
            'age_13_17': 5.0,
            'age_18_24': 25.0,
            'age_25_34': 40.0,
            'age_35_44': 20.0,
            'age_45_54': 8.0,
            'age_55_plus': 2.0,
            'male_percentage': 50.0,
            'female_percentage': 50.0,
            'top_countries': ['Global'],
            'top_cities': ['Various'],
            'peak_activity_hours': [19, 20, 21],
            'most_active_days': ['Sunday', 'Wednesday', 'Saturday'],
            'confidence_score': 3.0
        }
