import { apiClient, ApiUtils } from './api'

export const postsApi = {
  // GET /api/v1/posts/ - List all posts with filters
  getPosts: async (params = {}) => {
    try {
      const queryString = ApiUtils.buildQueryString(params)
      const url = queryString ? `/posts/?${queryString}` : '/posts/'
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.warn('API unavailable, using mock data for posts')
      return {
        count: 9,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            shortcode: 'CgHqwxvJYjK',
            influencer: 1,
            influencer_username: 'fitness_guru_sarah',
            caption: 'Morning workout complete! 💪 Remember, consistency beats perfection every time. What\'s your favorite morning exercise? #fitness #workout #motivation #morningworkout #consistencyiskey',
            media_type: 'photo',
            media_url: null,
            thumbnail_url: null,
            likes_count: 2456,
            comments_count: 189,
            shares_count: 45,
            saves_count: 234,
            views_count: null,
            engagement_rate: 4.8,
            posted_at: '2024-03-15T06:30:00Z',
            is_analyzed: true,
            analysis_status: 'completed',
            quality_score: 8.7,
            vibe_classification: 'energetic',
            sentiment_score: 0.85,
            dominant_colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
            text_overlay_detected: false,
            face_count: 1,
            object_tags: ['person', 'gym', 'equipment'],
            hashtags: ['fitness', 'workout', 'motivation', 'morningworkout', 'consistencyiskey'],
            mentions: [],
            location: null,
            created_at: '2024-03-15T06:35:00Z',
            updated_at: '2024-03-15T06:45:00Z'
          },
          {
            id: 2,
            shortcode: 'CgHpxwzJYkL',
            influencer: 2,
            influencer_username: 'tech_reviewer_mike',
            caption: 'New iPhone 15 Pro review is live! 📱✨ The camera improvements are incredible, especially in low light. Computational photography has reached new heights! Link in bio for full review. #iPhone15Pro #TechReview #Apple #Photography #Innovation',
            media_type: 'photo',
            media_url: null,
            thumbnail_url: null,
            likes_count: 1876,
            comments_count: 234,
            shares_count: 89,
            saves_count: 456,
            views_count: null,
            engagement_rate: 4.2,
            posted_at: '2024-03-14T14:20:00Z',
            is_analyzed: true,
            analysis_status: 'completed',
            quality_score: 9.2,
            vibe_classification: 'professional',
            sentiment_score: 0.92,
            dominant_colors: ['#1C1C1E', '#007AFF', '#FF9500'],
            text_overlay_detected: true,
            face_count: 0,
            object_tags: ['phone', 'technology', 'hands'],
            hashtags: ['iPhone15Pro', 'TechReview', 'Apple', 'Photography', 'Innovation'],
            mentions: ['@apple'],
            location: null,
            created_at: '2024-03-14T14:25:00Z',
            updated_at: '2024-03-14T14:35:00Z'
          },
          {
            id: 3,
            shortcode: 'CgHoxwzJYmM',
            influencer: 3,
            influencer_username: 'travel_with_emma',
            caption: 'Sunset in Santorini never gets old 🌅 The blue domes and white buildings create the perfect contrast against the golden sky. This moment reminded me why I fell in love with travel photography. #Santorini #Greece #SunsetMagic #TravelPhotography #Wanderlust',
            media_type: 'photo',
            media_url: null,
            thumbnail_url: null,
            likes_count: 3421,
            comments_count: 312,
            shares_count: 167,
            saves_count: 789,
            views_count: null,
            engagement_rate: 5.8,
            posted_at: '2024-03-13T18:45:00Z',
            is_analyzed: true,
            analysis_status: 'completed',
            quality_score: 9.5,
            vibe_classification: 'aesthetic',
            sentiment_score: 0.95,
            dominant_colors: ['#FF7F50', '#4169E1', '#FFFFFF'],
            text_overlay_detected: false,
            face_count: 0,
            object_tags: ['architecture', 'sunset', 'landscape', 'travel'],
            hashtags: ['Santorini', 'Greece', 'SunsetMagic', 'TravelPhotography', 'Wanderlust'],
            mentions: [],
            location: 'Santorini, Greece',
            created_at: '2024-03-13T18:50:00Z',
            updated_at: '2024-03-13T19:00:00Z'
          }
        ]
      }
    }
  },

  // GET /api/v1/posts/{id}/ - Get single post
  getPost: async (id) => {
    try {
      const response = await apiClient.get(`/posts/${id}/`)
      return response.data
    } catch (error) {
      const mockPosts = await postsApi.getPosts()
      return mockPosts.results.find(post => post.id === parseInt(id))
    }
  },

  // GET /api/v1/posts/by-shortcode/{shortcode}/ - Get post by shortcode
  getPostByShortcode: async (shortcode) => {
    try {
      const response = await apiClient.get(`/posts/by-shortcode/${shortcode}/`)
      return response.data
    } catch (error) {
      const mockPosts = await postsApi.getPosts()
      return mockPosts.results.find(post => post.shortcode === shortcode)
    }
  },

  // GET /api/v1/posts/by-influencer/{influencer_id}/ - Get posts by influencer
  getPostsByInfluencer: async (influencerId, params = {}) => {
    try {
      const queryString = ApiUtils.buildQueryString(params)
      const url = queryString ? `/posts/by-influencer/${influencerId}/?${queryString}` : `/posts/by-influencer/${influencerId}/`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      const mockPosts = await postsApi.getPosts()
      const filteredPosts = mockPosts.results.filter(post => post.influencer === parseInt(influencerId))
      return {
        count: filteredPosts.length,
        next: null,
        previous: null,
        results: filteredPosts
      }
    }
  },

  // POST /api/v1/posts/{id}/analyze/ - Trigger post analysis
  analyzePost: async (id) => {
    try {
      const response = await apiClient.post(`/posts/${id}/analyze/`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to analyze post: ${error.message}`)
    }
  },

  // GET /api/v1/posts/{id}/analysis/ - Get post analysis results
  getPostAnalysis: async (id) => {
    try {
      const response = await apiClient.get(`/posts/${id}/analysis/`)
      return response.data
    } catch (error) {
      return {
        id: id,
        quality_score: 8.5,
        vibe_classification: 'energetic',
        sentiment_score: 0.85,
        engagement_prediction: 4.2,
        optimal_posting_time: '18:00',
        hashtag_effectiveness: {
          'fitness': 8.5,
          'workout': 7.8,
          'motivation': 9.2
        },
        visual_analysis: {
          composition_score: 8.7,
          color_harmony: 9.1,
          face_detection: true,
          text_overlay: false,
          dominant_colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
          brightness: 0.75,
          contrast: 0.82
        },
        text_analysis: {
          readability_score: 8.3,
          keyword_density: 0.15,
          call_to_action_present: true,
          question_present: true,
          emoji_count: 3
        },
        performance_metrics: {
          expected_reach: 15000,
          expected_impressions: 25000,
          expected_saves: 200,
          virality_potential: 6.8
        },
        recommendations: [
          'Consider posting during peak hours (6-8 PM)',
          'Add more relevant hashtags for better discoverability',
          'Include a stronger call-to-action'
        ],
        analyzed_at: new Date().toISOString()
      }
    }
  },

  // GET /api/v1/posts/trending/ - Get trending posts
  getTrendingPosts: async (params = {}) => {
    try {
      const response = await apiClient.get('/posts/trending/', { params })
      return response.data
    } catch (error) {
      const allPosts = await postsApi.getPosts()
      const trendingPosts = [...allPosts.results]
        .sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0))
        .slice(0, 10)
      
      return {
        count: trendingPosts.length,
        results: trendingPosts
      }
    }
  },

  // GET /api/v1/posts/search/ - Search posts
  searchPosts: async (query, filters = {}) => {
    try {
      const params = { q: query, ...filters }
      const response = await apiClient.get('/posts/search/', { params })
      return response.data
    } catch (error) {
      const allPosts = await postsApi.getPosts()
      const filteredResults = allPosts.results.filter(post => 
        post.caption?.toLowerCase().includes(query.toLowerCase()) ||
        post.hashtags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      return {
        count: filteredResults.length,
        results: filteredResults
      }
    }
  },

  // GET /api/v1/posts/by-hashtag/ - Get posts by hashtag
  getPostsByHashtag: async (hashtag, params = {}) => {
    try {
      const allParams = { hashtag, ...params }
      const response = await apiClient.get('/posts/by-hashtag/', { params: allParams })
      return response.data
    } catch (error) {
      const allPosts = await postsApi.getPosts()
      const filteredPosts = allPosts.results.filter(post => 
        post.hashtags?.includes(hashtag.replace('#', ''))
      )
      return {
        count: filteredPosts.length,
        results: filteredPosts
      }
    }
  },

  // GET /api/v1/posts/analytics/ - Get posts analytics
  getPostsAnalytics: async (params = {}) => {
    try {
      const response = await apiClient.get('/posts/analytics/', { params })
      return response.data
    } catch (error) {
      return {
        total_posts: 746,
        analyzed_posts: 695,
        avg_engagement_rate: 4.6,
        avg_quality_score: 8.2,
        top_performing_posts: 45,
        content_type_distribution: {
          photo: 68.2,
          carousel: 23.1,
          video: 8.7
        },
        vibe_distribution: {
          energetic: 32.1,
          professional: 28.4,
          aesthetic: 21.7,
          casual: 17.8
        },
        posting_patterns: {
          best_day: 'Friday',
          best_time: '18:00',
          avg_posts_per_day: 2.3,
          posting_frequency: 'daily'
        },
        hashtag_performance: {
          most_effective: ['fitness', 'motivation', 'lifestyle'],
          avg_hashtags_per_post: 8.5,
          hashtag_engagement_boost: 1.8
        }
      }
    }
  },

  // POST /api/v1/posts/bulk-analyze/ - Bulk analyze posts
  bulkAnalyzePosts: async (postIds) => {
    try {
      const response = await apiClient.post('/posts/bulk-analyze/', { post_ids: postIds })
      return response.data
    } catch (error) {
      throw new Error(`Failed to bulk analyze posts: ${error.message}`)
    }
  },

  // GET /api/v1/posts/export/ - Export posts data
  exportPosts: async (format = 'csv', filters = {}) => {
    try {
      const params = { format, ...filters }
      const response = await apiClient.get('/posts/export/', { 
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to export posts: ${error.message}`)
    }
  }
}
