import { INSTAGRAM, QUALITY_RANGES, TIME_RANGES } from './constants'
import { formatDistanceToNow, format, parseISO } from 'date-fns'

// Number formatting utilities
export const formatNumber = (number, notation = 'compact') => {
  if (number === null || number === undefined) return '0'
  
  return new Intl.NumberFormat('en-US', {
    notation,
    maximumFractionDigits: 1,
  }).format(number)
}

export const formatFollowers = (count) => {
  if (!count) return '0'
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%'
  return `${Number(value).toFixed(decimals)}%`
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Date formatting utilities
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return 'Unknown'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, formatStr)
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid date'
  }
}

export const formatRelativeTime = (date) => {
  if (!date) return 'Unknown'
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch (error) {
    console.error('Relative time formatting error:', error)
    return 'Unknown'
  }
}

// Instagram specific utilities
export const getFollowerTier = (followerCount) => {
  if (!followerCount) return 'Unknown'
  
  for (const [tier, config] of Object.entries(INSTAGRAM.FOLLOWER_TIERS)) {
    if (followerCount >= config.min && followerCount < config.max) {
      return config.label
    }
  }
  return 'Unknown'
}

export const calculateEngagementRate = (likes, comments, followers) => {
  if (!followers || followers === 0) return 0
  const totalEngagement = (likes || 0) + (comments || 0)
  return (totalEngagement / followers) * 100
}

export const getEngagementLevel = (rate) => {
  if (rate >= INSTAGRAM.ENGAGEMENT_THRESHOLDS.HIGH) return 'High'
  if (rate >= INSTAGRAM.ENGAGEMENT_THRESHOLDS.MEDIUM) return 'Medium'
  if (rate >= INSTAGRAM.ENGAGEMENT_THRESHOLDS.LOW) return 'Low'
  return 'Very Low'
}

export const getQualityLabel = (score) => {
  if (score === null || score === undefined) return 'Not Rated'
  
  for (const [key, range] of Object.entries(QUALITY_RANGES)) {
    if (score >= range.min && score <= range.max) {
      return range.label
    }
  }
  return 'Unknown'
}

export const getQualityColor = (score) => {
  if (score === null || score === undefined) return 'default'
  
  for (const [key, range] of Object.entries(QUALITY_RANGES)) {
    if (score >= range.min && score <= range.max) {
      return range.color
    }
  }
  return 'default'
}

// Text utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export const extractHashtags = (text) => {
  if (!text) return []
  const hashtagRegex = /#[a-zA-Z0-9_]+/g
  return text.match(hashtagRegex) || []
}

export const extractMentions = (text) => {
  if (!text) return []
  const mentionRegex = /@[a-zA-Z0-9_.]+/g
  return text.match(mentionRegex) || []
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const value = item[key]
    const group = groups[value] || []
    group.push(item)
    groups[value] = group
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const valueA = a[key]
    const valueB = b[key]
    
    if (direction === 'desc') {
      return valueB > valueA ? 1 : valueB < valueA ? -1 : 0
    }
    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0
  })
}

export const unique = (array, key) => {
  if (key) {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) return false
      seen.add(value)
      return true
    })
  }
  return [...new Set(array)]
}

// Object utilities
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export const pick = (object, keys) => {
  const result = {}
  keys.forEach(key => {
    if (key in object) {
      result[key] = object[key]
    }
  })
  return result
}

export const omit = (object, keys) => {
  const result = { ...object }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/
  return usernameRegex.test(username)
}

export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Color utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export const rgbToHex = (r, g, b) => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }).join("")
}

// Local storage utilities
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`)
    return defaultValue
  }
}

export const setToStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`)
    return false
  }
}

export const removeFromStorage = (key) => {
  try {
    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`)
    return false
  }
}

// Debounce utility
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Download utility
export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Error handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || 'Server error occurred'
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.'
  } else {
    // Something else happened
    return 'An unexpected error occurred'
  }
}

export const logger = {
  info: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data)
    }
  },
  warn: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[WARN] ${message}`, data)
    }
  },
  error: (message, error = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error)
    }
  }
}
