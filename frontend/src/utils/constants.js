// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  RETRY_ATTEMPTS: 3,
}

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Instagram Analytics Dashboard',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  INFLUENCERS_PER_PAGE: 12,
  POSTS_PER_PAGE: 16,
  REELS_PER_PAGE: 12,
}

// Instagram Specific
export const INSTAGRAM = {
  MAX_CAPTION_LENGTH: 2200,
  MAX_HASHTAGS: 30,
  ENGAGEMENT_THRESHOLDS: {
    HIGH: 3.0,
    MEDIUM: 1.0,
    LOW: 0.5,
  },
  FOLLOWER_TIERS: {
    NANO: { min: 1000, max: 10000, label: 'Nano' },
    MICRO: { min: 10000, max: 100000, label: 'Micro' },
    MACRO: { min: 100000, max: 1000000, label: 'Macro' },
    MEGA: { min: 1000000, max: Infinity, label: 'Mega' },
  },
}

// Content Types
export const CONTENT_TYPES = {
  POST: 'post',
  REEL: 'reel',
  STORY: 'story',
  IGTV: 'igtv',
}

// Vibe Classifications
export const VIBES = {
  ENERGETIC: 'energetic',
  CASUAL: 'casual',
  AESTHETIC: 'aesthetic',
  PROFESSIONAL: 'professional',
  MOTIVATIONAL: 'motivational',
  FUNNY: 'funny',
  EDUCATIONAL: 'educational',
  ROMANTIC: 'romantic',
}

// Content Categories
export const CATEGORIES = {
  LIFESTYLE: 'lifestyle',
  FITNESS: 'fitness',
  FASHION: 'fashion',
  TRAVEL: 'travel',
  FOOD: 'food',
  BEAUTY: 'beauty',
  TECH: 'tech',
  BUSINESS: 'business',
  ART: 'art',
  SPORTS: 'sports',
  EDUCATION: 'education',
  ENTERTAINMENT: 'entertainment',
}

// Quality Score Ranges
export const QUALITY_RANGES = {
  EXCELLENT: { min: 9, max: 10, label: 'Excellent', color: 'success' },
  VERY_GOOD: { min: 8, max: 8.9, label: 'Very Good', color: 'success' },
  GOOD: { min: 6, max: 7.9, label: 'Good', color: 'warning' },
  FAIR: { min: 4, max: 5.9, label: 'Fair', color: 'warning' },
  POOR: { min: 0, max: 3.9, label: 'Poor', color: 'danger' },
}

// Time Ranges
export const TIME_RANGES = {
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  '90d': { label: 'Last 3 months', days: 90 },
  '180d': { label: 'Last 6 months', days: 180 },
  '1y': { label: 'Last year', days: 365 },
}

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  PURPLE: '#8b5cf6',
  PINK: '#ec4899',
  INDIGO: '#6366f1',
}

// Status Types
export const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  SELECTED_INFLUENCERS: 'selected_influencers',
  FILTERS: 'filters',
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully!',
  DELETED: 'Item deleted successfully!',
  UPDATED: 'Update completed successfully!',
  EXPORTED: 'Export completed successfully!',
  IMPORTED: 'Import completed successfully!',
}

// Demographics
export const DEMOGRAPHICS = {
  AGE_GROUPS: {
    '13_17': '13-17',
    '18_24': '18-24',
    '25_34': '25-34',
    '35_44': '35-44',
    '45_54': '45-54',
    '55_plus': '55+',
  },
  GENDERS: {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
  },
}

// Export Formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  JSON: 'json',
  PDF: 'pdf',
}

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
}

// Activity Types
export const ACTIVITY_TYPES = {
  POST_ANALYZED: 'post_analyzed',
  REEL_ANALYZED: 'reel_analyzed',
  INFLUENCER_ADDED: 'influencer_added',
  DEMOGRAPHICS_UPDATED: 'demographics_updated',
  EXPORT_COMPLETED: 'export_completed',
}

export default {
  API_CONFIG,
  APP_CONFIG,
  PAGINATION,
  INSTAGRAM,
  CONTENT_TYPES,
  VIBES,
  CATEGORIES,
  QUALITY_RANGES,
  TIME_RANGES,
  CHART_COLORS,
  STATUS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DEMOGRAPHICS,
  EXPORT_FORMATS,
  NOTIFICATION_TYPES,
  ACTIVITY_TYPES,
}
