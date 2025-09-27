import { useApi, useApiMutation } from './useApi'
import { postService } from '../services/postService'

export const usePosts = (params = {}) => {
  return useApi(
    ['posts', params],
    () => postService.getPosts(params),
    {
      keepPreviousData: true,
    }
  )
}

export const usePost = (id) => {
  return useApi(
    ['post', id],
    () => postService.getPost(id),
    {
      enabled: !!id,
    }
  )
}

export const usePostAnalysis = (id) => {
  return useApi(
    ['post-analysis', id],
    () => postService.getPostAnalysis(id),
    {
      enabled: !!id,
    }
  )
}

export const useAnalyzedPosts = () => {
  return useApi(
    ['analyzed-posts'],
    postService.getAnalyzedPosts
  )
}

export const useAnalyzePost = () => {
  return useApiMutation(postService.analyzePost, {
    successMessage: 'Post analysis started!',
    invalidateQueries: ['posts', 'post-analysis'],
  })
}
