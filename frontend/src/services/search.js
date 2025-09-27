import { apiClient, ApiUtils } from './api'

export const searchApi = {
  // GET /api/v1/search/global/ - Global search across all content
  globalSearch: async (query, filters = {}) => {
    try {
      const params = { q: query, ...filters }
      const response = await apiClient.get('/search/global/', { params })
      return response.data
    } catch (error) {
      // Fallback to individual API searches
      const [influencers, posts, reels] = await Promise.allSettled([
        import('./influencers').then(({ influencersApi }) => 
          influencersApi.searchInfluencers(query, filters)
        ),
        import('./posts').then(({ postsApi }) => 
          postsApi.searchPosts(query, filters)
        ),
        import('./reels').then(({ reelsApi }) => 
          reelsApi.searchReels(query, filters)
        )
      ])

      return {
        query,
        total_results: 
          (influencers.value?.count || 0) + 
          (posts.value?.count || 0) + 
          (reels.value?.count || 0),
        results: {
          influencers: influencers.value || { count: 0, results: [] },
          posts: posts.value || { count: 0, results: [] },
          reels: reels.value || { count: 0, results: [] }
        },
        suggestions: [
          'fitness motivation',
          'tech reviews',
          'travel photography',
          'lifestyle tips'
        ]
      }
    }
  },

  // GET /api/v1/search/suggestions/ - Get search suggestions
  getSearchSuggestions: async (partial_query) => {
    try {
      const response = await apiClient.get('/search/suggestions/', {
        params: { q: partial_query }
      })
      return response.data
    } catch (error) {
      // Return mock suggestions based on partial query
      const suggestions = [
        'fitness motivation', 'fitness workout', 'fitness tips',
        'tech review', 'tech news', 'tech tutorials',
        'travel photography', 'travel tips', 'travel destinations',
        'lifestyle blogger', 'lifestyle tips', 'lifestyle content'
      ].filter(s => s.includes(partial_query.toLowerCase()))
      
      return {
        suggestions: suggestions.slice(0, 10),
        trending: ['#MondayMotivation', '#TechTuesday', '#WanderlustWednesday']
      }
    }
  },

  // GET /api/v1/search/trending/ - Get trending searches
  getTrendingSearches: async () => {
    try {
      const response = await apiClient.get('/search/trending/')
      return response.data
    } catch (error) {
      return {
        trending_queries: [
          { query: 'fitness motivation', volume: 15234, growth: '+234%' },
          { query: 'tech reviews', volume: 12456, growth: '+189%' },
          { query: 'travel photography', volume: 9876, growth: '+156%' },
          { query: 'sustainable living', volume: 7654, growth: '+298%' },
          { query: 'mental health', volume: 6543, growth: '+267%' }
        ],
        trending_hashtags: [
          { hashtag: '#MondayMotivation', posts: 2340, growth: '+45%' },
          { hashtag: '#TechTuesday', posts: 1890, growth: '+67%' },
          { hashtag: '#WanderlustWednesday', posts: 2156, growth: '+89%' },
          { hashtag: '#ThrowbackThursday', posts: 1765, growth: '+23%' },
          { hashtag: '#FridayFeeling', posts: 2456, growth: '+34%' }
        ],
        trending_topics: [
          'AI Technology', 'Sustainable Fashion', 'Mental Wellness',
          'Remote Work', 'Plant-Based Lifestyle', 'Digital Minimalism'
        ]
      }
    }
  },

  // GET /api/v1/search/filters/ - Get available search filters
  getSearchFilters: async () => {
    try {
      const response = await apiClient.get('/search/filters/')
      return response.data
    } catch (error) {
      return {
        content_types: ['posts', 'reels', 'stories', 'igtv'],
        categories: ['fitness', 'technology', 'travel', 'food', 'fashion', 'lifestyle'],
        date_ranges: [
          { label: 'Last 24 hours', value: '1d' },
          { label: 'Last week', value: '7d' },
          { label: 'Last month', value: '30d' },
          { label: 'Last 3 months', value: '90d' },
          { label: 'Last year', value: '365d' },
          { label: 'All time', value: 'all' }
        ],
        engagement_ranges: [
          { label: 'Low (0-2%)', min: 0, max: 2 },
          { label: 'Medium (2-5%)', min: 2, max: 5 },
          { label: 'High (5-10%)', min: 5, max: 10 },
          { label: 'Viral (10%+)', min: 10, max: 100 }
        ],
        follower_ranges: [
          { label: 'Micro (1K-10K)', min: 1000, max: 10000 },
          { label: 'Mid-tier (10K-100K)', min: 10000, max: 100000 },
          { label: 'Macro (100K-1M)', min: 100000, max: 1000000 },
          { label: 'Mega (1M+)', min: 1000000, max: null }
        ],
        quality_scores: [
          { label: 'Excellent (9-10)', min: 9, max: 10 },
          { label: 'Good (7-8)', min: 7, max: 8 },
          { label: 'Average (5-6)', min: 5, max: 6 },
          { label: 'Below Average (0-4)', min: 0, max: 4 }
        ]
      }
    }
  },

  // POST /api/v1/search/save/ - Save search query
  saveSearch: async (searchData) => {
    try {
      const response = await apiClient.post('/search/save/', searchData)
      return response.data
    } catch (error) {
      throw new Error(`Failed to save search: ${error.message}`)
    }
  },

  // GET /api/v1/search/saved/ - Get saved searches
  getSavedSearches: async () => {
    try {
      const response = await apiClient.get('/search/saved/')
      return response.data
    } catch (error) {
      return {
        saved_searches: [
          {
            id: 1,
            name: 'High Engagement Fitness Posts',
            query: 'fitness',
            filters: { engagement_min: 5, content_type: 'posts' },
            created_at: '2024-03-10T15:30:00Z',
            last_used: '2024-03-15T09:20:00Z'
          },
          {
            id: 2,
            name: 'Tech Review Reels',
            query: 'tech review',
            filters: { content_type: 'reels', category: 'technology' },
            created_at: '2024-03-08T11:45:00Z',
            last_used: '2024-03-14T16:10:00Z'
          }
        ]
      }
    }
  }
}
