import { apiClient, ApiUtils } from './api'

export const demographicsApi = {
  // GET /api/v1/demographics/ - Get all demographics data
  getDemographics: async (params = {}) => {
    try {
      const queryString = ApiUtils.buildQueryString(params)
      const url = queryString ? `/demographics/?${queryString}` : '/demographics/'
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      console.warn('API unavailable, using mock data for demographics')
      return {
        count: 3,
        results: [
          {
            id: 1,
            influencer: 1,
            influencer_username: 'fitness_guru_sarah',
            total_followers_analyzed: 124567,
            confidence_score: 8.9,
            data_points_used: 15420,
            last_updated: '2024-03-15T10:30:00Z'
          },
          {
            id: 2,
            influencer: 2,
            influencer_username: 'tech_reviewer_mike',
            total_followers_analyzed: 88234,
            confidence_score: 8.5,
            data_points_used: 12890,
            last_updated: '2024-03-14T14:20:00Z'
          },
          {
            id: 3,
            influencer: 3,
            influencer_username: 'travel_with_emma',
            total_followers_analyzed: 155432,
            confidence_score: 9.2,
            data_points_used: 18765,
            last_updated: '2024-03-13T18:45:00Z'
          }
        ]
      }
    }
  },

  // GET /api/v1/demographics/by-influencer/{influencer_id}/ - Get demographics by specific influencer
  getInfluencerDemographics: async (influencerId) => {
    try {
      const response = await apiClient.get(`/demographics/by-influencer/${influencerId}/`)
      return response.data
    } catch (error) {
      return {
        id: 1,
        influencer: influencerId,
        influencer_username: 'fitness_guru_sarah',
        total_followers_analyzed: 124567,
        confidence_score: 8.9,
        data_points_used: 15420,
        
        // Age Distribution
        age_13_17: 5.2,
        age_18_24: 28.7,
        age_25_34: 35.4,
        age_35_44: 20.1,
        age_45_54: 8.3,
        age_55_plus: 2.3,
        
        // Gender Distribution  
        male_percentage: 42.6,
        female_percentage: 55.8,
        other_percentage: 1.6,
        
        // Geographic Distribution
        top_countries: [
          { country: 'United States', country_code: 'US', percentage: 35.2, follower_count: 43844 },
          { country: 'Canada', country_code: 'CA', percentage: 12.4, follower_count: 15446 },
          { country: 'United Kingdom', country_code: 'GB', percentage: 8.9, follower_count: 11086 },
          { country: 'Australia', country_code: 'AU', percentage: 6.7, percentage: 8346 },
          { country: 'Germany', country_code: 'DE', percentage: 5.8, follower_count: 7225 }
        ],
        
        top_cities: [
          { city: 'New York', country: 'US', percentage: 8.2, follower_count: 10214 },
          { city: 'Los Angeles', country: 'US', percentage: 6.1, follower_count: 7599 },
          { city: 'Toronto', country: 'CA', percentage: 4.3, follower_count: 5356 },
          { city: 'London', country: 'GB', percentage: 3.9, follower_count: 4858 },
          { city: 'Sydney', country: 'AU', percentage: 2.8, follower_count: 3488 }
        ],
        
        // Language Distribution
        top_languages: [
          { language: 'English', percentage: 78.4, follower_count: 97661 },
          { language: 'Spanish', percentage: 8.9, follower_count: 11086 },
          { language: 'French', percentage: 4.2, follower_count: 5232 },
          { language: 'German', percentage: 3.8, follower_count: 4733 },
          { language: 'Portuguese', percentage: 2.1, follower_count: 2616 }
        ],
        
        // Interest Categories
        interest_categories: [
          { category: 'Fitness & Health', percentage: 89.2, follower_count: 111098 },
          { category: 'Nutrition', percentage: 76.8, follower_count: 95667 },
          { category: 'Lifestyle', percentage: 54.3, follower_count: 67640 },
          { category: 'Wellness', percentage: 48.7, follower_count: 60644 },
          { category: 'Sports', percentage: 42.1, follower_count: 52443 }
        ],
        
        // Device & Platform Data
        device_distribution: {
          mobile: 82.4,
          desktop: 15.2,
          tablet: 2.4
        },
        
        platform_usage: {
          ios: 58.7,
          android: 41.3
        },
        
        // Activity Patterns
        peak_activity_hours: [
          { hour: 6, percentage: 8.2 },
          { hour: 7, percentage: 12.4 },
          { hour: 8, percentage: 15.6 },
          { hour: 12, percentage: 18.9 },
          { hour: 13, percentage: 22.1 },
          { hour: 18, percentage: 28.4 },
          { hour: 19, percentage: 32.7 },
          { hour: 20, percentage: 35.2 },
          { hour: 21, percentage: 28.9 },
          { hour: 22, percentage: 19.6 }
        ],
        
        engagement_by_day: {
          Monday: 6.2,
          Tuesday: 7.1,
          Wednesday: 8.3,
          Thursday: 8.9,
          Friday: 9.2,
          Saturday: 8.7,
          Sunday: 7.8
        },
        
        // Follower Behavior
        avg_session_duration: 24.5,
        stories_completion_rate: 67.8,
        content_sharing_rate: 12.4,
        comment_engagement_rate: 3.8,
        dm_response_rate: 15.6,
        
        // Growth Analysis
        follower_growth_trends: [
          { period: '2024-01', gained: 4567, lost: 234, net: 4333 },
          { period: '2024-02', gained: 5234, lost: 189, net: 5045 },
          { period: '2024-03', gained: 3789, lost: 156, net: 3633 }
        ],
        
        // Audience Quality
        fake_followers_percentage: 2.1,
        inactive_followers_percentage: 8.4,
        high_quality_followers_percentage: 89.5,
        
        last_updated: '2024-03-15T10:30:00Z',
        next_update_scheduled: '2024-03-22T10:30:00Z'
      }
    }
  },

  // GET /api/v1/demographics/age-distribution/ - Get age distribution across platform
  getAgeDistribution: async (params = {}) => {
    try {
      const response = await apiClient.get('/demographics/age-distribution/', { params })
      return response.data
    } catch (error) {
      return {
        overall_distribution: {
          '13-17': 4.8,
          '18-24': 31.2,
          '25-34': 38.7,
          '35-44': 16.9,
          '45-54': 6.8,
          '55+': 1.6
        },
        by_category: {
          fitness: { '18-24': 35.4, '25-34': 42.1, '35-44': 15.2 },
          technology: { '18-24': 28.9, '25-34': 45.6, '35-44': 18.7 },
          travel: { '25-34': 38.2, '35-44': 28.4, '45-54': 18.9 }
        },
        trends: [
          { age_group: '18-24', trend: '+2.3%' },
          { age_group: '25-34', trend: '+1.8%' },
          { age_group: '35-44', trend: '-0.5%' }
        ]
      }
    }
  },

  // GET /api/v1/demographics/gender-distribution/ - Get gender distribution
  getGenderDistribution: async (params = {}) => {
    try {
      const response = await apiClient.get('/demographics/gender-distribution/', { params })
      return response.data
    } catch (error) {
      return {
        overall_distribution: {
          male: 44.2,
          female: 54.1,
          other: 1.7
        },
        by_category: {
          fitness: { male: 42.6, female: 55.8, other: 1.6 },
          technology: { male: 68.4, female: 30.2, other: 1.4 },
          travel: { male: 38.9, female: 59.7, other: 1.4 }
        },
        age_gender_cross: {
          'male_18_24': 12.8,
          'male_25_34': 18.4,
          'female_18_24': 18.4,
          'female_25_34': 20.3
        }
      }
    }
  },

  // GET /api/v1/demographics/geographic/ - Get geographic distribution
  getGeographicData: async (params = {}) => {
    try {
      const response = await apiClient.get('/demographics/geographic/', { params })
      return response.data
    } catch (error) {
      return {
        countries: [
          { name: 'United States', code: 'US', percentage: 38.7, growth: '+2.1%' },
          { name: 'Canada', code: 'CA', percentage: 11.2, growth: '+1.8%' },
          { name: 'United Kingdom', code: 'GB', percentage: 8.9, growth: '+0.9%' },
          { name: 'Australia', code: 'AU', percentage: 6.4, growth: '+1.2%' },
          { name: 'Germany', code: 'DE', percentage: 5.8, growth: '+0.7%' }
        ],
        cities: [
          { name: 'New York', country: 'US', percentage: 7.8, growth: '+1.9%' },
          { name: 'Los Angeles', country: 'US', percentage: 5.9, growth: '+2.3%' },
          { name: 'Toronto', country: 'CA', percentage: 4.1, growth: '+1.6%' },
          { name: 'London', country: 'GB', percentage: 3.7, growth: '+0.8%' },
          { name: 'Sydney', country: 'AU', percentage: 2.9, growth: '+1.1%' }
        ],
        continents: {
          'North America': 52.4,
          'Europe': 28.9,
          'Asia': 12.7,
          'Oceania': 4.2,
          'South America': 1.8
        }
      }
    }
  },

  // GET /api/v1/demographics/interests/ - Get audience interests
  getInterests: async (params = {}) => {
    try {
      const response = await apiClient.get('/demographics/interests/', { params })
      return response.data
    } catch (error) {
      return {
        top_interests: [
          { category: 'Fitness & Health', percentage: 76.4, trend: '+3.2%' },
          { category: 'Technology', percentage: 45.8, trend: '+5.1%' },
          { category: 'Travel', percentage: 42.3, trend: '+1.8%' },
          { category: 'Food & Dining', percentage: 38.9, trend: '+2.4%' },
          { category: 'Fashion & Style', percentage: 35.6, trend: '+1.2%' },
          { category: 'Entertainment', percentage: 32.1, trend: '+0.9%' },
          { category: 'Business & Finance', percentage: 28.7, trend: '+4.3%' },
          { category: 'Education', percentage: 24.5, trend: '+2.8%' }
        ],
        interest_overlap: {
          'Fitness-Technology': 18.4,
          'Travel-Food': 22.7,
          'Fashion-Lifestyle': 28.9
        },
        emerging_interests: [
          { category: 'Sustainability', growth: '+15.7%' },
          { category: 'Mental Health', growth: '+12.3%' },
          { category: 'Remote Work', growth: '+9.8%' }
        ]
      }
    }
  },

  // GET /api/v1/demographics/activity-patterns/ - Get audience activity patterns
  getActivityPatterns: async (params = {}) => {
    try {
      const response = await apiClient.get('/demographics/activity-patterns/', { params })
      return response.data
    } catch (error) {
      return {
        hourly_activity: [
          { hour: 0, percentage: 2.1 }, { hour: 1, percentage: 1.8 },
          { hour: 2, percentage: 1.2 }, { hour: 3, percentage: 0.9 },
          { hour: 4, percentage: 0.7 }, { hour: 5, percentage: 1.4 },
          { hour: 6, percentage: 4.8 }, { hour: 7, percentage: 8.9 },
          { hour: 8, percentage: 12.4 }, { hour: 9, percentage: 9.8 },
          { hour: 10, percentage: 7.2 }, { hour: 11, percentage: 8.9 },
          { hour: 12, percentage: 15.6 }, { hour: 13, percentage: 18.7 },
          { hour: 14, percentage: 12.3 }, { hour: 15, percentage: 9.8 },
          { hour: 16, percentage: 11.4 }, { hour: 17, percentage: 16.8 },
          { hour: 18, percentage: 24.5 }, { hour: 19, percentage: 28.9 },
          { hour: 20, percentage: 32.4 }, { hour: 21, percentage: 26.7 },
          { hour: 22, percentage: 18.9 }, { hour: 23, percentage: 12.1 }
        ],
        daily_activity: {
          Monday: 14.2,
          Tuesday: 15.8,
          Wednesday: 16.4,
          Thursday: 17.1,
          Friday: 15.9,
          Saturday: 12.8,
          Sunday: 11.8
        },
        seasonal_patterns: {
          Spring: { engagement: '+12%', posting: '+8%' },
          Summer: { engagement: '+18%', posting: '+15%' },
          Fall: { engagement: '+5%', posting: '+3%' },
          Winter: { engagement: '-8%', posting: '-5%' }
        },
        content_type_preferences: {
          photos: { peak_time: '19:00', engagement: 4.2 },
          videos: { peak_time: '20:30', engagement: 6.8 },
          stories: { peak_time: '18:30', engagement: 5.4 },
          reels: { peak_time: '21:00', engagement: 7.2 }
        }
      }
    }
  },

  // GET /api/v1/demographics/comparative/ - Compare demographics between influencers
  getComparativeDemographics: async (influencerIds) => {
    try {
      const params = { influencers: influencerIds.join(',') }
      const response = await apiClient.get('/demographics/comparative/', { params })
      return response.data
    } catch (error) {
      return {
        comparison: influencerIds.map(id => ({
          influencer_id: id,
          age_distribution: {
            '18-24': Math.random() * 20 + 25,
            '25-34': Math.random() * 20 + 30,
            '35-44': Math.random() * 15 + 15
          },
          gender_split: {
            male: Math.random() * 30 + 35,
            female: Math.random() * 30 + 35
          },
          top_country: 'United States',
          engagement_peak: Math.floor(Math.random() * 4) + 18
        })),
        similarities: {
          age_overlap: 73.2,
          geographic_overlap: 68.9,
          interest_overlap: 81.4
        },
        differences: {
          primary_age_gap: 5.7,
          gender_split_variance: 12.3,
          geographic_diversity: 'High'
        }
      }
    }
  },

  // POST /api/v1/demographics/refresh/ - Trigger demographics refresh
  refreshDemographics: async (influencerId) => {
    try {
      const response = await apiClient.post(`/demographics/refresh/`, { influencer_id: influencerId })
      return response.data
    } catch (error) {
      throw new Error(`Failed to refresh demographics: ${error.message}`)
    }
  },

  // GET /api/v1/demographics/export/ - Export demographics data
  exportDemographics: async (format = 'csv', filters = {}) => {
    try {
      const params = { format, ...filters }
      const response = await apiClient.get('/demographics/export/', {
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw new Error(`Failed to export demographics: ${error.message}`)
    }
  }
}
