import { useApi, useApiMutation } from './useApi'
import { demographicsService } from '../services/demographicsService'

export const useDemographics = (params = {}) => {
  return useApi(
    ['demographics', params],
    () => demographicsService.getDemographics(params)
  )
}

export const useInfluencerDemographics = (influencerId) => {
  return useApi(
    ['influencer-demographics', influencerId],
    () => demographicsService.getInfluencerDemographics(influencerId),
    {
      enabled: !!influencerId,
    }
  )
}

export const useAgeDistribution = (influencerId) => {
  return useApi(
    ['age-distribution', influencerId],
    () => demographicsService.getAgeDistribution(influencerId),
    {
      enabled: !!influencerId,
    }
  )
}

export const useGenderDistribution = (influencerId) => {
  return useApi(
    ['gender-distribution', influencerId],
    () => demographicsService.getGenderDistribution(influencerId),
    {
      enabled: !!influencerId,
    }
  )
}

export const useGeographicDistribution = (influencerId) => {
  return useApi(
    ['geographic-distribution', influencerId],
    () => demographicsService.getGeographicDistribution(influencerId),
    {
      enabled: !!influencerId,
    }
  )
}

export const useActivityPatterns = (influencerId) => {
  return useApi(
    ['activity-patterns', influencerId],
    () => demographicsService.getActivityPatterns(influencerId),
    {
      enabled: !!influencerId,
    }
  )
}

export const useInferDemographics = () => {
  return useApiMutation(demographicsService.inferDemographics, {
    successMessage: 'Demographics inference started!',
    invalidateQueries: ['demographics', 'influencer-demographics'],
  })
}
