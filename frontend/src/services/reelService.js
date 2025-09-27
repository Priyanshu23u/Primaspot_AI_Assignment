import api from './api'

export const reelService = {
  // Get all reels
  getReels: async (params = {}) => {
    const response = await api.get('/reels/reels/', { params })
    return response.data
  },

  // Get single reel
  getReel: async (id) => {
    const response = await api.get(`/reels/reels/${id}/`)
    return response.data
  },

  // Get reel analysis
  getReelAnalysis: async (id) => {
    const response = await api.get(`/reels/${id}/analysis/`)
    return response.data
  },

  // Filter reels by vibe
  getReelsByVibe: async (vibe) => {
    const response = await api.get('/reels/reels/', { 
      params: { vibe_classification: vibe } 
    })
    return response.data
  },

  // Get analyzed reels only
  getAnalyzedReels: async () => {
    const response = await api.get('/reels/reels/', { 
      params: { analyzed_only: true } 
    })
    return response.data
  },

  // Trigger reel analysis
  analyzeReel: async (id) => {
    const response = await api.post(`/reels/${id}/analyze/`)
    return response.data
  },
}
