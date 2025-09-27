import { useApi, useApiMutation } from './useApi'
import { influencerService } from '../services/influencers'

export const useInfluencers = (params = {}) => {
  return useApi(
    ['influencers', params],
    () => influencerService.getInfluencers(params),
    {
      keepPreviousData: true,
    }
  )
}

export const useInfluencer = (id) => {
  return useApi(
    ['influencer', id],
    () => influencerService.getInfluencer(id),
    {
      enabled: !!id,
    }
  )
}

export const useInfluencerAnalytics = (id) => {
  return useApi(
    ['influencer-analytics', id],
    () => influencerService.getInfluencerAnalytics(id),
    {
      enabled: !!id,
    }
  )
}

export const useInfluencerPosts = (id, params = {}) => {
  return useApi(
    ['influencer-posts', id, params],
    () => influencerService.getInfluencerPosts(id, params),
    {
      enabled: !!id,
      keepPreviousData: true,
    }
  )
}

export const useInfluencerReels = (id, params = {}) => {
  return useApi(
    ['influencer-reels', id, params],
    () => influencerService.getInfluencerReels(id, params),
    {
      enabled: !!id,
      keepPreviousData: true,
    }
  )
}

export const useAddInfluencer = () => {
  return useApiMutation(influencerService.addInfluencer, {
    successMessage: 'Influencer added successfully!',
    invalidateQueries: ['influencers'],
  })
}

export const useUpdateInfluencer = () => {
  return useApiMutation(
    ({ id, data }) => influencerService.updateInfluencer(id, data),
    {
      successMessage: 'Influencer updated successfully!',
      invalidateQueries: ['influencers', 'influencer'],
    }
  )
}

export const useDeleteInfluencer = () => {
  return useApiMutation(influencerService.deleteInfluencer, {
    successMessage: 'Influencer deleted successfully!',
    invalidateQueries: ['influencers'],
  })
}

export const useSearchInfluencers = () => {
  return useApiMutation(influencerService.searchInfluencers)
}
