import api from './api'

export const influencerService = {
  // Get all influencers
  getInfluencers: async (params = {}) => {
    const response = await api.get('/influencers/', { params })
    return response.data
  },

  // Get single influencer
  getInfluencer: async (id) => {
    const response = await api.get(`/influencers/${id}/`)
    return response.data
  },

  // Get influencer analytics
  getInfluencerAnalytics: async (id) => {
    const response = await api.get(`/influencers/${id}/analytics/`)
    return response.data
  },

  // Get influencer posts
  getInfluencerPosts: async (id, params = {}) => {
    const response = await api.get(`/influencers/${id}/posts/`, { params })
    return response.data
  },

  // Get influencer reels
  getInfluencerReels: async (id, params = {}) => {
    const response = await api.get(`/influencers/${id}/reels/`, { params })
    return response.data
  },

  // Search influencers
  searchInfluencers: async (query) => {
    const response = await api.get(`/influencers/search/`, { 
      params: { q: query } 
    })
    return response.data
  },

  // Filter influencers
  filterInfluencers: async (filters) => {
    const response = await api.get('/influencers/', { params: filters })
    return response.data
  },

  // Add new influencer
  addInfluencer: async (data) => {
    const response = await api.post('/influencers/', data)
    return response.data
  },

  // Update influencer
  updateInfluencer: async (id, data) => {
    const response = await api.patch(`/influencers/${id}/`, data)
    return response.data
  },

  // Delete influencer
  deleteInfluencer: async (id) => {
    const response = await api.delete(`/influencers/${id}/`)
    return response.data
  },
}
