import { apiClient, ApiUtils } from './api'

export const reportsApi = {
  // GET /api/v1/reports/ - Get available reports
  getAvailableReports: async () => {
    try {
      const response = await apiClient.get('/reports/')
      return response.data
    } catch (error) {
      return {
        reports: [
          {
            id: 'engagement-summary',
            name: 'Engagement Summary Report',
            description: 'Comprehensive engagement metrics across all influencers',
            type: 'summary',
            frequency: ['daily', 'weekly', 'monthly'],
            formats: ['pdf', 'csv', 'xlsx'],
            estimated_time: '2-5 minutes'
          },
          {
            id: 'influencer-performance',
            name: 'Influencer Performance Report',
            description: 'Individual influencer performance breakdown',
            type: 'detailed',
            frequency: ['weekly', 'monthly'],
            formats: ['pdf', 'xlsx'],
            estimated_time: '3-7 minutes'
          },
          {
            id: 'content-analysis',
            name: 'Content Analysis Report',
            description: 'Deep dive into content performance and trends',
            type: 'analytical',
            frequency: ['monthly', 'quarterly'],
            formats: ['pdf', 'xlsx'],
            estimated_time: '5-10 minutes'
          },
          {
            id: 'demographics-insights',
            name: 'Demographics & Audience Insights',
            description: 'Audience demographics and behavior patterns',
            type: 'insights',
            frequency: ['monthly'],
            formats: ['pdf', 'xlsx'],
            estimated_time: '3-6 minutes'
          },
          {
            id: 'roi-analysis',
            name: 'ROI & Business Impact Analysis',
            description: 'Business metrics and return on investment analysis',
            type: 'business',
            frequency: ['monthly', 'quarterly'],
            formats: ['pdf', 'xlsx', 'pptx'],
            estimated_time: '7-12 minutes'
          }
        ]
      }
    }
  },

  // POST /api/v1/reports/generate/ - Generate custom report
  generateReport: async (reportConfig) => {
    try {
      const response = await apiClient.post('/reports/generate/', reportConfig)
      return response.data
    } catch (error) {
      // Mock report generation
      return {
        report_id: 'rpt_' + Date.now(),
        status: 'generating',
        estimated_completion: new Date(Date.now() + 300000).toISOString(), // 5 minutes
        progress: 0,
        message: 'Report generation started. You will receive an email when ready.',
        download_url: null
      }
    }
  },

  // GET /api/v1/reports/{report_id}/status/ - Check report status
  getReportStatus: async (reportId) => {
    try {
      const response = await apiClient.get(`/reports/${reportId}/status/`)
      return response.data
    } catch (error) {
      // Mock report status
      const statuses = ['generating', 'processing', 'completed', 'failed']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      return {
        report_id: reportId,
        status: randomStatus,
        progress: randomStatus === 'completed' ? 100 : Math.floor(Math.random() * 90) + 10,
        estimated_completion: randomStatus === 'completed' ? null : new Date(Date.now() + 120000).toISOString(),
        download_url: randomStatus === 'completed' ? `/reports/${reportId}/download/` : null,
        error_message: randomStatus === 'failed' ? 'Failed to generate report due to data processing error' : null
      }
    }
  },

  // GET /api/v1/reports/{report_id}/download/ - Download report
  downloadReport: async (reportId, format = 'pdf') => {
    try {
      const response = await apiClient.get(`/reports/${reportId}/download/`, {
        params: { format },
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response.data], { 
        type: format === 'pdf' ? 'application/pdf' : 
              format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
              'text/csv'
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `report-${reportId}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true, message: 'Report downloaded successfully' }
    } catch (error) {
      throw new Error(`Failed to download report: ${error.message}`)
    }
  },

  // GET /api/v1/reports/history/ - Get report generation history
  getReportHistory: async (params = {}) => {
    try {
      const response = await apiClient.get('/reports/history/', { params })
      return response.data
    } catch (error) {
      return {
        reports: [
          {
            id: 'rpt_1710589234567',
            name: 'Engagement Summary Report',
            type: 'engagement-summary',
            format: 'pdf',
            status: 'completed',
            generated_at: '2024-03-15T14:30:00Z',
            generated_by: 'system',
            file_size: '2.3 MB',
            download_count: 3,
            expires_at: '2024-04-15T14:30:00Z'
          },
          {
            id: 'rpt_1710502834567',
            name: 'Influencer Performance Report',
            type: 'influencer-performance',
            format: 'xlsx',
            status: 'completed',
            generated_at: '2024-03-14T10:15:00Z',
            generated_by: 'user',
            file_size: '5.7 MB',
            download_count: 1,
            expires_at: '2024-04-14T10:15:00Z'
          },
          {
            id: 'rpt_1710416434567',
            name: 'Content Analysis Report',
            type: 'content-analysis',
            format: 'pdf',
            status: 'failed',
            generated_at: '2024-03-13T08:45:00Z',
            generated_by: 'user',
            error_message: 'Insufficient data for analysis period',
            expires_at: null
          }
        ],
        total_count: 15,
        storage_used: '45.2 MB',
        storage_limit: '500 MB'
      }
    }
  },

  // POST /api/v1/reports/schedule/ - Schedule recurring report
  scheduleReport: async (scheduleConfig) => {
    try {
      const response = await apiClient.post('/reports/schedule/', scheduleConfig)
      return response.data
    } catch (error) {
      throw new Error(`Failed to schedule report: ${error.message}`)
    }
  },

  // GET /api/v1/reports/scheduled/ - Get scheduled reports
  getScheduledReports: async () => {
    try {
      const response = await apiClient.get('/reports/scheduled/')
      return response.data
    } catch (error) {
      return {
        scheduled_reports: [
          {
            id: 'sch_1',
            name: 'Weekly Engagement Summary',
            report_type: 'engagement-summary',
            frequency: 'weekly',
            next_run: '2024-03-22T09:00:00Z',
            format: 'pdf',
            recipients: ['admin@company.com'],
            is_active: true,
            created_at: '2024-03-01T10:00:00Z'
          }
        ]
      }
    }
  },

  // DELETE /api/v1/reports/{report_id}/ - Delete report
  deleteReport: async (reportId) => {
    try {
      const response = await apiClient.delete(`/reports/${reportId}/`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to delete report: ${error.message}`)
    }
  },

  // POST /api/v1/reports/export/ - Quick export data
  exportData: async (dataType, filters = {}, format = 'csv') => {
    try {
      const exportConfig = {
        data_type: dataType, // 'influencers', 'posts', 'reels', 'analytics'
        filters,
        format,
        include_images: false,
        date_range: filters.date_range || '30d'
      }
      
      const response = await apiClient.post('/reports/export/', exportConfig, {
        responseType: 'blob'
      })
      
      // Auto-download
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${dataType}-export-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      throw new Error(`Failed to export data: ${error.message}`)
    }
  }
}
