import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// Create axios instance with comprehensive config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for large data requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth and logging
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log API requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Success: ${response.config.url}`, response.data)
    }
    return response
  },
  (error) => {
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message

    // Handle different HTTP status codes
    switch (error.response?.status) {
      case 401:
        localStorage.removeItem('auth_token')
        toast.error('Authentication failed. Please login again.')
        // Optional: Redirect to login
        break
      case 403:
        toast.error('Access denied. Insufficient permissions.')
        break
      case 404:
        console.warn(`Resource not found: ${error.config?.url}`)
        // Don't show toast for 404s, handle in components
        break
      case 429:
        toast.error('Too many requests. Please wait and try again.')
        break
      case 500:
        toast.error('Server error occurred. Please try again later.')
        break
      case 502:
      case 503:
      case 504:
        toast.error('Service unavailable. Please check your connection.')
        break
      default:
        if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
          console.warn('Network error, using mock data fallback')
          // Don't show error toast, let components handle fallback
        } else {
          toast.error(errorMessage || 'An unexpected error occurred')
        }
    }
    
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorMessage
    })
    
    return Promise.reject(error)
  }
)

// Enhanced API client with retry logic
export const apiClient = {
  // GET with query params support
  get: async (url, config = {}) => {
    try {
      return await api.get(url, config)
    } catch (error) {
      throw error
    }
  },
  
  // POST with data
  post: async (url, data, config = {}) => {
    try {
      return await api.post(url, data, config)
    } catch (error) {
      throw error
    }
  },
  
  // PUT for full updates
  put: async (url, data, config = {}) => {
    try {
      return await api.put(url, data, config)
    } catch (error) {
      throw error
    }
  },
  
  // PATCH for partial updates
  patch: async (url, data, config = {}) => {
    try {
      return await api.patch(url, data, config)
    } catch (error) {
      throw error
    }
  },
  
  // DELETE
  delete: async (url, config = {}) => {
    try {
      return await api.delete(url, config)
    } catch (error) {
      throw error
    }
  },
  
  // File upload support
  upload: async (url, formData, onUploadProgress = null) => {
    try {
      return await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      })
    } catch (error) {
      throw error
    }
  }
}

// Utility functions
export const ApiUtils = {
  // Build query string from object
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        if (Array.isArray(params[key])) {
          params[key].forEach(value => searchParams.append(key, value))
        } else {
          searchParams.append(key, params[key])
        }
      }
    })
    return searchParams.toString()
  },
  
  // Check if API is available
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/health/')
      return response.data
    } catch (error) {
      return { status: 'unavailable', error: error.message }
    }
  }
}

export default api
