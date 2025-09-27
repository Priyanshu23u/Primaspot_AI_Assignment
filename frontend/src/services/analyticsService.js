import api from './api'

export const analyticsService = {
  // Get platform analytics
  getPlatformAnalytics: async () => {
    const response = await api.get('/analytics/')
    return response.data
  },

  // Get engagement analytics
  getEngagementAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/engagement/', { params })
    return response.data
  },

  // Get performance metrics
  getPerformanceMetrics: async (influencerId, timeRange = '30d') => {
    const response = await api.get(`/analytics/performance/${influencerId}/`, {
      params: { time_range: timeRange }
    })
    return response.data
  },

  // Get trend analysis
  getTrendAnalysis: async (timeRange = '30d') => {
    const response = await api.get('/analytics/trends/', {
      params: { time_range: timeRange }
    })
    return response.data
  },

  // Get comparison data
  getComparisonData: async (influencerIds) => {
    const response = await api.get('/analytics/compare/', {
      params: { influencers: influencerIds.join(',') }
    })
    return response.data
  },

  // Export analytics data
  exportAnalytics: async (format = 'csv', params = {}) => {
    const response = await api.get('/analytics/export/', {
      params: { format, ...params },
      responseType: 'blob'
    })
    return response.data
  },
}
