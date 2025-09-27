# analytics/ai_processing.py
import cv2
import numpy as np
from PIL import Image
import requests
from io import BytesIO
import logging

logger = logging.getLogger(__name__)

class ImageProcessor:
    """Real image processing for posts"""
    
    def analyze_image(self, image_url: str) -> dict:
        """Analyze image quality and extract features"""
        try:
            # Download image
            response = requests.get(image_url, timeout=10)
            image = Image.open(BytesIO(response.content))
            
            # Convert to CV2 format
            cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Analyze image quality
            quality_metrics = self._analyze_image_quality(cv_image)
            
            # Extract colors
            colors = self._extract_dominant_colors(cv_image)
            
            # Detect objects (basic)
            objects = self._detect_basic_objects(cv_image)
            
            return {
                'quality_score': quality_metrics['overall_score'],
                'lighting_score': quality_metrics['lighting'],
                'composition_score': quality_metrics['composition'],
                'visual_appeal_score': quality_metrics['visual_appeal'],
                'dominant_colors': colors,
                'detected_objects': objects,
                'processing_success': True
            }
            
        except Exception as e:
            logger.error(f"Image processing failed: {e}")
            return self._fallback_analysis()
    
    def _analyze_image_quality(self, image) -> dict:
        """Analyze image quality metrics"""
        # Convert to grayscale for analysis
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Calculate sharpness (Laplacian variance)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        sharpness_score = min(10, laplacian_var / 100)
        
        # Calculate brightness
        brightness = np.mean(gray)
        brightness_score = 10 - abs(brightness - 127) / 12.7
        
        # Calculate contrast
        contrast = np.std(gray)
        contrast_score = min(10, contrast / 25)
        
        overall_score = (sharpness_score + brightness_score + contrast_score) / 3
        
        return {
            'overall_score': round(overall_score, 1),
            'lighting': round(brightness_score, 1),
            'composition': round(sharpness_score, 1),
            'visual_appeal': round(contrast_score, 1)
        }
    
    def _extract_dominant_colors(self, image) -> list:
        """Extract dominant colors from image"""
        try:
            # Resize image for faster processing
            small_image = cv2.resize(image, (150, 150))
            
            # Convert to RGB
            rgb_image = cv2.cvtColor(small_image, cv2.COLOR_BGR2RGB)
            
            # Reshape for k-means
            data = rgb_image.reshape((-1, 3))
            data = np.float32(data)
            
            # K-means clustering to find dominant colors
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 20, 1.0)
            k = 3
            _, labels, centers = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
            
            # Convert to hex colors
            centers = np.uint8(centers)
            colors = []
            for center in centers:
                hex_color = '#%02x%02x%02x' % (center[0], center[1], center[2])
                colors.append(hex_color)
            
            return colors[:3]
            
        except:
            return ['#FFFFFF', '#000000', '#808080']
    
    def _detect_basic_objects(self, image) -> list:
        """Basic object detection"""
        try:
            # Simple face detection
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            objects = []
            if len(faces) > 0:
                objects.append('person')
                objects.append('face')
            
            # Basic analysis based on image properties
            height, width = image.shape[:2]
            if width > height * 1.5:  # Landscape
                objects.append('landscape')
            elif height > width * 1.3:  # Portrait
                objects.append('portrait')
            
            return objects[:5]
            
        except:
            return ['image', 'content']
    
    def _fallback_analysis(self) -> dict:
        """Fallback when processing fails"""
        return {
            'quality_score': 7.0,
            'lighting_score': 7.0,
            'composition_score': 7.0,
            'visual_appeal_score': 7.0,
            'dominant_colors': ['#FFFFFF', '#000000'],
            'detected_objects': ['content'],
            'processing_success': False
        }

class ContentAnalyzer:
    """Analyze content and classify vibes"""
    
    def analyze_post_content(self, caption: str, keywords: list = None) -> dict:
        """Analyze post content and classify vibe"""
        try:
            # Text analysis
            caption_lower = caption.lower()
            
            # Classify vibe based on content
            vibe = self._classify_vibe(caption_lower)
            
            # Extract keywords from caption
            extracted_keywords = self._extract_keywords(caption_lower)
            
            # Combine with provided keywords
            if keywords:
                extracted_keywords.extend(keywords)
            
            # Remove duplicates and limit
            final_keywords = list(set(extracted_keywords))[:10]
            
            return {
                'vibe_classification': vibe,
                'keywords': final_keywords,
                'category': self._determine_category(final_keywords),
                'mood': self._analyze_mood(caption_lower)
            }
            
        except Exception as e:
            logger.error(f"Content analysis failed: {e}")
            return self._fallback_content_analysis()
    
    def _classify_vibe(self, text: str) -> str:
        """Classify vibe based on text content"""
        vibe_indicators = {
            'luxury': ['luxury', 'expensive', 'premium', 'exclusive', 'high-end', 'designer'],
            'energetic': ['energy', 'exciting', 'dynamic', 'active', 'powerful', 'intense', 'training', 'workout'],
            'aesthetic': ['beautiful', 'stunning', 'gorgeous', 'artistic', 'elegant', 'style', 'fashion'],
            'professional': ['work', 'business', 'professional', 'meeting', 'corporate', 'office'],
            'casual': ['casual', 'relaxed', 'chill', 'everyday', 'simple', 'normal']
        }
        
        vibe_scores = {}
        for vibe, indicators in vibe_indicators.items():
            score = sum(1 for indicator in indicators if indicator in text)
            if score > 0:
                vibe_scores[vibe] = score
        
        if vibe_scores:
            return max(vibe_scores, key=vibe_scores.get)
        
        return 'casual'
    
    def _extract_keywords(self, text: str) -> list:
        """Extract keywords from text"""
        import re
        
        # Common words to filter out
        stop_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'this', 'that'}
        
        # Extract hashtags
        hashtags = re.findall(r'#(\w+)', text)
        
        # Extract meaningful words
        words = re.findall(r'\b[a-zA-Z]+\b', text)
        keywords = [word for word in words if len(word) > 3 and word.lower() not in stop_words]
        
        # Combine and prioritize hashtags
        all_keywords = hashtags + keywords[:5]
        
        return all_keywords[:8]
    
    def _determine_category(self, keywords: list) -> str:
        """Determine content category"""
        categories = {
            'fitness': ['fitness', 'gym', 'workout', 'training', 'exercise'],
            'fashion': ['fashion', 'style', 'outfit', 'clothing', 'designer'],
            'food': ['food', 'cooking', 'recipe', 'meal', 'restaurant'],
            'travel': ['travel', 'vacation', 'trip', 'adventure', 'explore'],
            'lifestyle': ['lifestyle', 'daily', 'life', 'personal', 'home']
        }
        
        for category, indicators in categories.items():
            if any(indicator in ' '.join(keywords).lower() for indicator in indicators):
                return category
        
        return 'lifestyle'
    
    def _analyze_mood(self, text: str) -> str:
        """Analyze mood from text"""
        positive_words = ['happy', 'excited', 'amazing', 'wonderful', 'great', 'fantastic', 'love', 'best']
        negative_words = ['sad', 'tired', 'difficult', 'hard', 'challenging', 'tough']
        
        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
    
    def _fallback_content_analysis(self) -> dict:
        """Fallback content analysis"""
        return {
            'vibe_classification': 'casual',
            'keywords': ['lifestyle', 'content'],
            'category': 'lifestyle',
            'mood': 'neutral'
        }
