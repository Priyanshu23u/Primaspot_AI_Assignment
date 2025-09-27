import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reportsApi } from '../services/reports'
import toast from 'react-hot-toast'

const Reports = () => {
  const queryClient = useQueryClient()
  const [selectedReport, setSelectedReport] = useState(null)
  const [reportConfig, setReportConfig] = useState({
    date_range: '30d',
    format: 'pdf',
    include_images: true,
    filters: {}
  })
  const [activeTab, setActiveTab] = useState('generate')

  // Fetch available reports
  const { data: availableReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['available-reports'],
    queryFn: () => reportsApi.getAvailableReports(),
    retry: false
  })

  // Fetch report history
  const { data: reportHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['report-history'],
    queryFn: () => reportsApi.getReportHistory(),
    retry: false
  })

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: (config) => reportsApi.generateReport(config),
    onSuccess: (data) => {
      toast.success('Report generation started! You will be notified when ready.')
      queryClient.invalidateQueries(['report-history'])
      setSelectedReport(null)
    },
    onError: (error) => {
      toast.error(`Failed to generate report: ${error.message}`)
    }
  })

  // Delete report mutation  
  const deleteReportMutation = useMutation({
    mutationFn: (reportId) => reportsApi.deleteReport(reportId),
    onSuccess: () => {
      toast.success('Report deleted successfully')
      queryClient.invalidateQueries(['report-history'])
    },
    onError: (error) => {
      toast.error(`Failed to delete report: ${error.message}`)
    }
  })

  const handleGenerateReport = () => {
    if (!selectedReport) {
      toast.error('Please select a report type')
      return
    }

    const config = {
      report_type: selectedReport.id,
      ...reportConfig,
      generated_by: 'user'
    }

    generateReportMutation.mutate(config)
  }

  const handleDownloadReport = async (reportId, format) => {
    try {
      await reportsApi.downloadReport(reportId, format)
      toast.success('Report download started')
    } catch (error) {
      toast.error('Failed to download report')
    }
  }

  const handleExportData = async (dataType) => {
    try {
      await reportsApi.exportData(dataType, reportConfig.filters, reportConfig.format)
      toast.success('Data export completed')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#059669'
      case 'generating': return '#f59e0b'  
      case 'failed': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅'
      case 'generating': return '⏳'
      case 'failed': return '❌'
      default: return '📄'
    }
  }

  if (reportsLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
        <p style={{ color: '#6b7280' }}>Loading reports...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Reports & Analytics
        </h1>
        <p style={{ color: '#6b7280' }}>
          Generate comprehensive reports and export your data
        </p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e5e7eb' }}>
          {[
            { key: 'generate', label: 'Generate Reports', icon: '📊' },
            { key: 'history', label: 'Report History', icon: '📚' },
            { key: 'export', label: 'Quick Export', icon: '📤' },
            { key: 'schedule', label: 'Scheduled Reports', icon: '📅' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 0',
                borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === tab.key ? '600' : '500',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Reports Tab */}
      {activeTab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
          {/* Available Reports */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Available Report Types
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {availableReports?.reports?.map(report => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  style={{
                    backgroundColor: 'white',
                    border: selectedReport?.id === report.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedReport?.id !== report.id) {
                      e.currentTarget.style.borderColor = '#9ca3af'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedReport?.id !== report.id) {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                      {report.name}
                    </h3>
                    <span style={{
                      backgroundColor: report.type === 'summary' ? '#dbeafe' :
                                     report.type === 'detailed' ? '#dcfce7' :
                                     report.type === 'analytical' ? '#fef3c7' :
                                     report.type === 'insights' ? '#e0e7ff' : '#f3e8ff',
                      color: report.type === 'summary' ? '#1d4ed8' :
                             report.type === 'detailed' ? '#166534' :
                             report.type === 'analytical' ? '#92400e' :
                             report.type === 'insights' ? '#5b21b6' : '#7c2d12',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {report.type}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '12px', fontSize: '0.875rem' }}>
                    {report.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
                    <span>⏱️ {report.estimated_time}</span>
                    <span>📁 {report.formats.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Configuration */}
          <div style={{ 
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
            height: 'fit-content',
            position: 'sticky',
            top: '24px'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
              Report Configuration
            </h3>
            
            {selectedReport ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ 
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontWeight: '500', color: '#111827', fontSize: '0.875rem', marginBottom: '4px' }}>
                    Selected Report
                  </div>
                  <div style={{ color: '#3b82f6', fontSize: '0.875rem' }}>
                    {selectedReport.name}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Date Range
                  </label>
                  <select
                    value={reportConfig.date_range}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, date_range: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="365d">Last year</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Format
                  </label>
                  <select
                    value={reportConfig.format}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white'
                    }}
                  >
                    {selectedReport.formats.map(format => (
                      <option key={format} value={format}>
                        {format.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                    <input
                      type="checkbox"
                      checked={reportConfig.include_images}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, include_images: e.target.checked }))}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ color: '#374151' }}>Include images</span>
                  </label>
                </div>

                <button
                  onClick={handleGenerateReport}
                  disabled={generateReportMutation.isLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: generateReportMutation.isLoading ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: generateReportMutation.isLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {generateReportMutation.isLoading ? (
                    <>⏳ Generating...</>
                  ) : (
                    <>📊 Generate Report</>
                  )}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
                <p>Select a report type to configure options</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report History Tab */}
      {activeTab === 'history' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
              Report History
            </h2>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Storage: {reportHistory?.storage_used || '0 MB'} / {reportHistory?.storage_limit || '500 MB'}
            </div>
          </div>

          {historyLoading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
              <p style={{ color: '#6b7280' }}>Loading report history...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reportHistory?.reports?.map(report => (
                <div
                  key={report.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ fontSize: '2rem' }}>
                      {getStatusIcon(report.status)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                          {report.name}
                        </h3>
                        <span style={{
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {report.format?.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#6b7280' }}>
                        <span>📅 {new Date(report.generated_at).toLocaleDateString()}</span>
                        {report.file_size && <span>💾 {report.file_size}</span>}
                        {report.download_count > 0 && <span>⬇️ {report.download_count} downloads</span>}
                      </div>
                      {report.error_message && (
                        <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '4px' }}>
                          ⚠️ {report.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {report.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadReport(report.id, report.format)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#059669',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        📥 Download
                      </button>
                    )}
                    <button
                      onClick={() => deleteReportMutation.mutate(report.id)}
                      disabled={deleteReportMutation.isLoading}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'transparent',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              
              {reportHistory?.reports?.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                  <p>No reports generated yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Export Tab */}
      {activeTab === 'export' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
            Quick Data Export
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Export raw data instantly without generating full reports
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[
              { type: 'influencers', name: 'Influencers Data', icon: '👥', description: 'All influencer profiles and metrics' },
              { type: 'posts', name: 'Posts Data', icon: '📸', description: 'All posts with engagement metrics' },
              { type: 'reels', name: 'Reels Data', icon: '🎥', description: 'All reels with performance data' },
              { type: 'analytics', name: 'Analytics Data', icon: '📊', description: 'Platform-wide analytics data' }
            ].map(item => (
              <div
                key={item.type}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {['csv', 'xlsx'].map(format => (
                    <button
                      key={format}
                      onClick={() => handleExportData(item.type)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e5e7eb'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6'
                      }}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Reports Tab */}
      {activeTab === 'schedule' && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            Scheduled Reports
          </h3>
          <p style={{ marginBottom: '16px' }}>
            Automatic report generation feature coming soon
          </p>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'not-allowed'
            }}
            disabled
          >
            Coming Soon
          </button>
        </div>
      )}
    </div>
  )
}

export default Reports
