import api from './api'

export const postService = {
  // Get all posts
  getPosts: async (params = {}) => {
    const response = await api.get('/posts/posts/', { params })
    return response.data
  },

  // Get single post
  getPost: async (id) => {
    const response = await api.get(`/posts/posts/${id}/`)
    return response.data
  },

  // Get post analysis
  getPostAnalysis: async (id) => {
    const response = await api.get(`/posts/${id}/analysis/`)
    return response.data
  },

  // Filter posts by category
  getPostsByCategory: async (category) => {
    const response = await api.get('/posts/posts/', { 
      params: { category } 
    })
    return response.data
  },

  // Filter posts by vibe
  getPostsByVibe: async (vibe) => {
    const response = await api.get('/posts/posts/', { 
      params: { vibe_classification: vibe } 
    })
    return response.data
  },

  // Get analyzed posts only
  getAnalyzedPosts: async () => {
    const response = await api.get('/posts/posts/', { 
      params: { analyzed_only: true } 
    })
    return response.data
  },

  // Trigger post analysis
  analyzePost: async (id) => {
    const response = await api.post(`/posts/${id}/analyze/`)
    return response.data
  },
}
