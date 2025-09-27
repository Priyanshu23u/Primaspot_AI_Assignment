import { apiClient, ApiUtils } from './api'

export const influencersApi = {
  // GET /api/v1/influencers/ - List all influencers with filters
  getInfluencers: async (params = {}) => {
    try {
      const queryString = ApiUtils.buildQueryString(params)
      const url = queryString ? `/influencers/?${queryString}` : '/influencers/'
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.warn('API unavailable, using mock data for influencers')
      return {
        count: 3,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            username: 'fitness_guru_sarah',
            full_name: 'Sarah Johnson',
            bio: '💪 Fitness Coach | 🥗 Nutrition Expert | 🏃‍♀️ Marathon Runner',
            profile_pic_url: null,
            followers_count: 125000,
            following_count: 890,
            posts_count: 245,
            is_verified: true,
            is_private: false,
            category: 'fitness',
            engagement_rate: 4.8,
            avg_likes: 2400,
            avg_comments: 180,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-03-15T14:20:00Z',
            last_scraped: '2024-03-15T14:20:00Z'
          },
          {
            id: 2,
            username: 'tech_reviewer_mike',
            full_name: 'Michael Chen',
            bio: '📱 Tech Reviews | 💻 Gadget Testing | 🎮 Gaming Content',
            profile_pic_url: null,
            followers_count: 89000,
            following_count: 567,
            posts_count: 189,
            is_verified: false,
            is_private: false,
            category: 'technology',
            engagement_rate: 3.9,
            avg_likes: 1800,
            avg_comments: 145,
            created_at: '2024-02-20T14:15:00Z',
            updated_at: '2024-03-14T18:45:00Z',
            last_scraped: '2024-03-14T18:45:00Z'
          },
          {
            id: 3,
            username: 'travel_with_emma',
            full_name: 'Emma Rodriguez',
            bio: '✈️ Travel Blogger | 📸 Photography | 🌍 World Explorer',
            profile_pic_url: null,
            followers_count: 156000,
            following_count: 1234,
            posts_count: 312,
            is_verified: true,
            is_private: false,
            category: 'travel',
            engagement_rate: 5.2,
            avg_likes: 3200,
            avg_comments: 280,
            created_at: '2024-01-10T08:45:00Z',
            updated_at: '2024-03-13T20:30:00Z',
            last_scraped: '2024-03-13T20:30:00Z'
          }
        ]
      }
    }
  },

  // GET /api/v1/influencers/{id}/ - Get single influencer by ID
  getInfluencer: async (id) => {
    try {
      const response = await apiClient.get(`/influencers/${id}/`)
      return response.data
    } catch (error) {
      const mockInfluencers = await influencersApi.getInfluencers()
      return mockInfluencers.results.find(inf => inf.id === parseInt(id))
    }
  },

  // GET /api/v1/influencers/by-username/{username}/ - Get influencer by username
  getInfluencerByUsername: async (username) => {
    try {
      const response = await apiClient.get(`/influencers/by-username/${username}/`)
      return response.data
    } catch (error) {
      const mockInfluencers = await influencersApi.getInfluencers()
      return mockInfluencers.results.find(inf => inf.username === username)
    }
  },

  // POST /api/v1/influencers/ - Add new influencer
  addInfluencer: async (influencerData) => {
    try {
      const response = await apiClient.post('/influencers/', influencerData)
      return response.data
    } catch (error) {
      throw new Error(`Failed to add influencer: ${error.message}`)
    }
  },

  // PATCH /api/v1/influencers/{id}/ - Update influencer
  updateInfluencer: async (id, data) => {
    try {
      const response = await apiClient.patch(`/influencers/${id}/`, data)
      return response.data
    } catch (error) {
      throw new Error(`Failed to update influencer: ${error.message}`)
    }
  },

  // DELETE /api/v1/influencers/{id}/ - Delete influencer
  deleteInfluencer: async (id) => {
    try {
      const response = await apiClient.delete(`/influencers/${id}/`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to delete influencer: ${error.message}`)
    }
  },

  // POST /api/v1/influencers/{id}/scrape/ - Trigger scraping for specific influencer
  scrapeInfluencer: async (id) => {
    try {
      const response = await apiClient.post(`/influencers/${id}/scrape/`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to scrape influencer: ${error.message}`)
    }
  },

  // GET /api/v1/influencers/{id}/analytics/ - Get influencer analytics
  getInfluencerAnalytics: async (id, params = {}) => {
    try {
      const queryString = ApiUtils.buildQueryString(params)
      const url = queryString ? `/influencers/${id}/analytics/?${queryString}` : `/influencers/${id}/analytics/`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      // Return mock analytics data
      return {
        id: id,
        total_posts: 45,
        total_reels: 12,
        avg_engagement_rate: 4.5,
        avg_likes: 2100,
        avg_comments: 180,
        follower_growth_rate: 2.3,
        engagement_growth_rate: 1.8,
        best_posting_time: '18:00',
        best_posting_day: 'Friday',
        top_hashtags: ['#fitness', '#health', '#motivation', '#lifestyle', '#wellness'],
        engagement_by_content_type: {
          photo: 3.8,
          video: 5.2,
          carousel: 4.1
        },
        monthly_metrics: [
          { month: '2024-01', posts: 15, avg_engagement: 4.2 },
          { month: '2024-02', posts: 18, avg_engagement: 4.5 },
          { month: '2024-03', posts: 12, avg_engagement: 4.8 }
        ]
      }
    }
  },

  // GET /api/v1/influencers/{id}/posts/ - Get influencer's posts
  getInfluencerPosts: async (id, params = {}) => {
    try {
      const queryString = ApiUtils.buildQueryString(params)
      const url = queryString ? `/influencers/${id}/posts/?${queryString}` : `/influencers/${id}/posts/`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      // Fallback to posts API
      const { postsApi } = await import('./posts')
      return postsApi.getPostsByInfluencer(id, params)
    }
  },

  // GET /api/v1/influencers/{id}/reels/ - Get influencer's reels
  getInfluencerReels: async (id, params = {}) => {
    try {
      const queryString = ApiUtils.buildQueryString(params)
      const url = queryString ? `/influencers/${id}/reels/?${queryString}` : `/influencers/${id}/reels/`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      // Fallback to reels API
      const { reelsApi } = await import('./reels')
      return reelsApi.getReelsByInfluencer(id, params)
    }
  },

  // GET /api/v1/influencers/search/ - Search influencers
  searchInfluencers: async (query, filters = {}) => {
    try {
      const params = { q: query, ...filters }
      const response = await apiClient.get('/influencers/search/', { params })
      return response.data
    } catch (error) {
      const allInfluencers = await influencersApi.getInfluencers()
      const filteredResults = allInfluencers.results.filter(inf => 
        inf.username.toLowerCase().includes(query.toLowerCase()) ||
        inf.full_name?.toLowerCase().includes(query.toLowerCase()) ||
        inf.bio?.toLowerCase().includes(query.toLowerCase())
      )
      return {
        count: filteredResults.length,
        results: filteredResults
      }
    }
  },

  // GET /api/v1/influencers/trending/ - Get trending influencers
  getTrendingInfluencers: async (params = {}) => {
    try {
      const response = await apiClient.get('/influencers/trending/', { params })
      return response.data
    } catch (error) {
      const allInfluencers = await influencersApi.getInfluencers()
      // Sort by engagement rate for trending
      const trendingResults = [...allInfluencers.results]
        .sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0))
        .slice(0, 10)
      
      return {
        count: trendingResults.length,
        results: trendingResults
      }
    }
  },

  // GET /api/v1/influencers/categories/ - Get available categories
  getCategories: async () => {
    try {
      const response = await apiClient.get('/influencers/categories/')
      return response.data
    } catch (error) {
      return {
        categories: [
          { name: 'fitness', count: 1, description: 'Fitness and Health' },
          { name: 'technology', count: 1, description: 'Technology and Gadgets' },
          { name: 'travel', count: 1, description: 'Travel and Adventure' },
          { name: 'food', count: 0, description: 'Food and Cooking' },
          { name: 'fashion', count: 0, description: 'Fashion and Style' },
          { name: 'lifestyle', count: 0, description: 'Lifestyle and Entertainment' }
        ]
      }
    }
  },

  // GET /api/v1/influencers/stats/ - Get platform statistics
  getPlatformStats: async () => {
    try {
      const response = await apiClient.get('/influencers/stats/')
      return response.data
    } catch (error) {
      return {
        total_influencers: 3,
        total_verified: 2,
        avg_followers: 123333,
        avg_engagement_rate: 4.6,
        total_posts_tracked: 746,
        total_reels_tracked: 89,
        categories_count: 6,
        last_updated: new Date().toISOString()
      }
    }
  }
}
