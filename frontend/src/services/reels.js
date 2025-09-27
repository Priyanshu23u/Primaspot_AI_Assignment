import { apiClient, ApiUtils } from './api'

export const reelsApi = {
  // GET /api/v1/reels/ - List all reels with filters
  getReels: async (params = {}) => {
    try {
      const queryString = ApiUtils.buildQueryString(params)
      const url = queryString ? `/reels/?${queryString}` : '/reels/'
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.warn('API unavailable, using mock data for reels')
      return {
        count: 3,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            shortcode: 'CgHrxwzJYnN',
            influencer: 1,
            influencer_username: 'fitness_guru_sarah',
            caption: '30-second HIIT workout you can do anywhere! 🔥 No equipment needed, just your bodyweight and determination. Try this circuit 3 times and feel the burn! Who\'s joining me? #HIITWorkout #FitnessMotivation #WorkoutAtHome #BodyweightTraining #FitnessChallenge',
            media_url: null,
            thumbnail_url: null,
            duration: 28.5,
            views_count: 45678,
            likes_count: 3456,
            comments_count: 267,
            shares_count: 123,
            saves_count: 567,
            engagement_rate: 6.2,
            play_count: 45678,
            posted_at: '2024-03-12T16:30:00Z',
            is_analyzed: true,
            analysis_status: 'completed',
            vibe_classification: 'energetic',
            audio_name: 'Energetic Workout Mix',
            audio_artist: 'Fitness Beats',
            audio_duration: 30.0,
            audio_is_original: false,
            has_captions: true,
            is_branded_content: false,
            scene_changes: 12,
            activity_level: 8.5,
            face_time_percentage: 85.2,
            text_overlay_detected: true,
            hashtags: ['HIITWorkout', 'FitnessMotivation', 'WorkoutAtHome', 'BodyweightTraining', 'FitnessChallenge'],
            mentions: [],
            effects_used: ['Speed Ramp', 'Text Animation'],
            created_at: '2024-03-12T16:35:00Z',
            updated_at: '2024-03-12T16:45:00Z'
          },
          {
            id: 2,
            shortcode: 'CgHsxwzJYoO',
            influencer: 2,
            influencer_username: 'tech_reviewer_mike',
            caption: 'Unboxing the new MacBook Pro M3! 💻⚡ The performance improvements are mind-blowing. Watch till the end for my first impressions! Full review coming this week. #MacBookPro #M3Chip #TechReview #Apple #Unboxing #TechTok',
            media_url: null,
            thumbnail_url: null,
            duration: 45.2,
            views_count: 32145,
            likes_count: 2134,
            comments_count: 189,
            shares_count: 67,
            saves_count: 234,
            engagement_rate: 5.8,
            play_count: 32145,
            posted_at: '2024-03-11T20:15:00Z',
            is_analyzed: true,
            analysis_status: 'completed',
            vibe_classification: 'professional',
            audio_name: 'Tech Vibes',
            audio_artist: 'ProductivityBeats',
            audio_duration: 60.0,
            audio_is_original: true,
            has_captions: true,
            is_branded_content: true,
            scene_changes: 8,
            activity_level: 6.2,
            face_time_percentage: 45.8,
            text_overlay_detected: true,
            hashtags: ['MacBookPro', 'M3Chip', 'TechReview', 'Apple', 'Unboxing', 'TechTok'],
            mentions: ['@apple'],
            effects_used: ['Zoom In', 'Product Highlight'],
            created_at: '2024-03-11T20:20:00Z',
            updated_at: '2024-03-11T20:30:00Z'
          },
          {
            id: 3,
            shortcode: 'CgHtxwzJYpP',
            influencer: 3,
            influencer_username: 'travel_with_emma',
            caption: 'Hidden gems of Mykonos 🏝️✨ Beyond the famous beaches, this island has so many secret spots waiting to be discovered. Swipe to see my favorite hidden cafe! Save this for your next Greek adventure 🇬🇷 #Mykonos #Greece #HiddenGems #TravelSecrets #GreekIslands',
            media_url: null,
            thumbnail_url: null,
            duration: 52.8,
            views_count: 67890,
            likes_count: 4567,
            comments_count: 345,
            shares_count: 234,
            saves_count: 891,
            engagement_rate: 7.1,
            play_count: 67890,
            posted_at: '2024-03-10T14:22:00Z',
            is_analyzed: true,
            analysis_status: 'completed',
            vibe_classification: 'aesthetic',
            audio_name: 'Greek Summer Vibes',
            audio_artist: 'Mediterranean Sounds',
            audio_duration: 60.0,
            audio_is_original: false,
            has_captions: false,
            is_branded_content: false,
            scene_changes: 15,
            activity_level: 4.8,
            face_time_percentage: 35.6,
            text_overlay_detected: true,
            hashtags: ['Mykonos', 'Greece', 'HiddenGems', 'TravelSecrets', 'GreekIslands'],
            mentions: [],
            effects_used: ['Cinematic', 'Color Grading', 'Transition'],
            created_at: '2024-03-10T14:27:00Z',
            updated_at: '2024-03-10T14:37:00Z'
          }
        ]
      }
    }
  },

  // GET /api/v1/reels/{id}/ - Get single reel
  getReel: async (id) => {
    try {
      const response = await apiClient.get(`/reels/${id}/`)
      return response.data
    } catch (error) {
      const mockReels = await reelsApi.getReels()
      return mockReels.results.find(reel => reel.id === parseInt(id))
    }
  },

  // GET /api/v1/reels/by-shortcode/{shortcode}/ - Get reel by shortcode
  getReelByShortcode: async (shortcode) => {
    try {
      const response = await apiClient.get(`/reels/by-shortcode/${shortcode}/`)
      return response.data
    } catch (error) {
      const mockReels = await reelsApi.getReels()
      return mockReels.results.find(reel => reel.shortcode === shortcode)
    }
  },

  // GET /api/v1/reels/by-influencer/{influencer_id}/ - Get reels by influencer
  getReelsByInfluencer: async (influencerId, params = {}) => {
    try {
      const queryString = ApiUtils.buildQueryString(params)
      const url = queryString ? `/reels/by-influencer/${influencerId}/?${queryString}` : `/reels/by-influencer/${influencerId}/`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      const mockReels = await reelsApi.getReels()
      const filteredReels = mockReels.results.filter(reel => reel.influencer === parseInt(influencerId))
      return {
        count: filteredReels.length,
        next: null,
        previous: null,
        results: filteredReels
      }
    }
  },

  // POST /api/v1/reels/{id}/analyze/ - Trigger reel analysis
  analyzeReel: async (id) => {
    try {
      const response = await apiClient.post(`/reels/${id}/analyze/`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to analyze reel: ${error.message}`)
    }
  },

  // GET /api/v1/reels/{id}/analysis/ - Get reel analysis results
  getReelAnalysis: async (id) => {
    try {
      const response = await apiClient.get(`/reels/${id}/analysis/`)
      return response.data
    } catch (error) {
      return {
        id: id,
        overall_score: 8.2,
        vibe_classification: 'energetic',
        engagement_prediction: 6.5,
        virality_potential: 7.8,
        video_analysis: {
          scene_changes: 12,
          activity_level: 8.5,
          face_detection_frames: 245,
          face_time_percentage: 85.2,
          motion_intensity: 7.3,
          color_variance: 6.8,
          brightness_consistency: 8.9,
          audio_sync_quality: 9.1
        },
        audio_analysis: {
          audio_energy: 7.8,
          beat_detection: true,
          tempo: 128,
          audio_quality: 8.5,
          voice_clarity: 7.9,
          background_noise: 2.1
        },
        content_analysis: {
          hook_effectiveness: 8.9,
          pacing_score: 8.3,
          story_structure: 7.6,
          call_to_action_strength: 6.4,
          retention_prediction: 75.4,
          completion_rate_prediction: 68.2
        },
        technical_metrics: {
          resolution_quality: 9.2,
          frame_rate: 30,
          aspect_ratio: '9:16',
          file_size_mb: 24.8,
          compression_quality: 8.7,
          loading_speed_score: 9.0
        },
        hashtag_analysis: {
          hashtag_count: 5,
          trending_hashtags: 2,
          niche_relevance: 8.8,
          discoverability_score: 7.5
        },
        recommendations: [
          'Add more trending hashtags for better discoverability',
          'Consider shorter hook duration for better retention',
          'Include subtitles for accessibility',
          'Post during peak hours (7-9 PM) for maximum reach'
        ],
        analyzed_at: new Date().toISOString()
      }
    }
  },

  // GET /api/v1/reels/trending/ - Get trending reels
  getTrendingReels: async (params = {}) => {
    try {
      const response = await apiClient.get('/reels/trending/', { params })
      return response.data
    } catch (error) {
      const allReels = await reelsApi.getReels()
      const trendingReels = [...allReels.results]
        .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
        .slice(0, 10)
      
      return {
        count: trendingReels.length,
        results: trendingReels
      }
    }
  },

  // GET /api/v1/reels/search/ - Search reels
  searchReels: async (query, filters = {}) => {
    try {
      const params = { q: query, ...filters }
      const response = await apiClient.get('/reels/search/', { params })
      return response.data
    } catch (error) {
      const allReels = await reelsApi.getReels()
      const filteredResults = allReels.results.filter(reel => 
        reel.caption?.toLowerCase().includes(query.toLowerCase()) ||
        reel.hashtags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      return {
        count: filteredResults.length,
        results: filteredResults
      }
    }
  },

  // GET /api/v1/reels/by-audio/ - Get reels by audio
  getReelsByAudio: async (audioName, params = {}) => {
    try {
      const allParams = { audio: audioName, ...params }
      const response = await apiClient.get('/reels/by-audio/', { params: allParams })
      return response.data
    } catch (error) {
      const allReels = await reelsApi.getReels()
      const filteredReels = allReels.results.filter(reel => 
        reel.audio_name?.toLowerCase().includes(audioName.toLowerCase())
      )
      return {
        count: filteredReels.length,
        results: filteredReels
      }
    }
  },

  // GET /api/v1/reels/analytics/ - Get reels analytics
  getReelsAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get('/reels/analytics/', { params })
      return response.data
    } catch (error) {
      return {
        total_reels: 89,
        analyzed_reels: 75,
        avg_views: 48571,
        avg_engagement_rate: 6.8,
        avg_duration: 42.3,
        completion_rate: 72.4,
        viral_reels_count: 12,
        content_distribution: {
          educational: 28.1,
          entertainment: 35.9,
          promotional: 18.0,
          lifestyle: 18.0
        },
        audio_trends: {
          original_audio: 34.8,
          trending_audio: 45.2,
          licensed_music: 20.0
        },
        posting_patterns: {
          best_day: 'Wednesday',
          best_time: '19:30',
          avg_reels_per_week: 4.2,
          optimal_duration: '30-45 seconds'
        },
        performance_metrics: {
          top_performing_duration: 35,
          avg_scene_changes: 10.5,
          avg_hook_duration: 3.2,
          retention_rate: 68.7
        }
      }
    }
  },

  // POST /api/v1/reels/bulk-analyze/ - Bulk analyze reels
  bulkAnalyzeReels: async (reelIds) => {
    try {
      const response = await apiClient.post('/reels/bulk-analyze/', { reel_ids: reelIds })
      return response.data
    } catch (error) {
      throw new Error(`Failed to bulk analyze reels: ${error.message}`)
    }
  },

  // GET /api/v1/reels/audio-trends/ - Get audio trends
  getAudioTrends: async (params = {}) => {
    try {
      const response = await apiClient.get('/reels/audio-trends/', { params })
      return response.data
    } catch (error) {
      return {
        trending_audios: [
          {
            name: 'Energetic Workout Mix',
            artist: 'Fitness Beats',
            usage_count: 156,
            avg_views: 52000,
            category: 'fitness'
          },
          {
            name: 'Tech Vibes',
            artist: 'ProductivityBeats',
            usage_count: 89,
            avg_views: 34500,
            category: 'technology'
          },
          {
            name: 'Greek Summer Vibes',
            artist: 'Mediterranean Sounds',
            usage_count: 78,
            avg_views: 67800,
            category: 'travel'
          }
        ],
        original_vs_licensed: {
          original: 34.8,
          licensed: 65.2
        },
        top_categories: [
          'fitness', 'lifestyle', 'travel', 'technology', 'entertainment'
        ]
      }
    }
  }
}
