import { useApi, useApiMutation } from './useApi'
import { analyticsService } from '../services/analytics'

export const usePlatformAnalytics = () => {
  return useApi(
    ['platform-analytics'],
    analyticsService.getPlatformAnalytics
  )
}

export const useEngagementAnalytics = (params = {}) => {
  return useApi(
    ['engagement-analytics', params],
    () => analyticsService.getEngagementAnalytics(params)
  )
}

export const usePerformanceMetrics = (influencerId, timeRange = '30d') => {
  return useApi(
    ['performance-metrics', influencerId, timeRange],
    () => analyticsService.getPerformanceMetrics(influencerId, timeRange),
    {
      enabled: !!influencerId,
    }
  )
}

export const useTrendAnalysis = (timeRange = '30d') => {
  return useApi(
    ['trend-analysis', timeRange],
    () => analyticsService.getTrendAnalysis(timeRange)
  )
}

export const useComparisonData = (influencerIds) => {
  return useApi(
    ['comparison-data', influencerIds],
    () => analyticsService.getComparisonData(influencerIds),
    {
      enabled: influencerIds && influencerIds.length > 0,
    }
  )
}

export const useExportAnalytics = () => {
  return useApiMutation(
    ({ format, params }) => analyticsService.exportAnalytics(format, params),
    {
      successMessage: 'Export started! Download will begin shortly.',
    }
  )
}
