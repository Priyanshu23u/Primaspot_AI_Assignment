import { useApi, useApiMutation } from './useApi'
import { reelService } from '../services/reels'

export const useReels = (params = {}) => {
  return useApi(
    ['reels', params],
    () => reelService.getReels(params),
    {
      keepPreviousData: true,
    }
  )
}

export const useReel = (id) => {
  return useApi(
    ['reel', id],
    () => reelService.getReel(id),
    {
      enabled: !!id,
    }
  )
}

export const useReelAnalysis = (id) => {
  return useApi(
    ['reel-analysis', id],
    () => reelService.getReelAnalysis(id),
    {
      enabled: !!id,
    }
  )
}

export const useAnalyzedReels = () => {
  return useApi(
    ['analyzed-reels'],
    reelService.getAnalyzedReels
  )
}

export const useAnalyzeReel = () => {
  return useApiMutation(reelService.analyzeReel, {
    successMessage: 'Reel analysis started!',
    invalidateQueries: ['reels', 'reel-analysis'],
  })
}
