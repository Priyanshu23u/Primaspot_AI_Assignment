import api from './api'

export const demographicsService = {
  // Get all demographics
  getDemographics: async (params = {}) => {
    const response = await api.get('/demographics/', { params })
    return response.data
  },

  // Get demographics for specific influencer
  getInfluencerDemographics: async (influencerId) => {
    const response = await api.get(`/demographics/${influencerId}/`)
    return response.data
  },

  // Get age distribution
  getAgeDistribution: async (influencerId) => {
    const response = await api.get(`/demographics/${influencerId}/age/`)
    return response.data
  },

  // Get gender distribution
  getGenderDistribution: async (influencerId) => {
    const response = await api.get(`/demographics/${influencerId}/gender/`)
    return response.data
  },

  // Get geographic distribution
  getGeographicDistribution: async (influencerId) => {
    const response = await api.get(`/demographics/${influencerId}/geography/`)
    return response.data
  },

  // Get activity patterns
  getActivityPatterns: async (influencerId) => {
    const response = await api.get(`/demographics/${influencerId}/activity/`)
    return response.data
  },

  // Trigger demographics inference
  inferDemographics: async (influencerId) => {
    const response = await api.post(`/demographics/${influencerId}/infer/`)
    return response.data
  },
}
