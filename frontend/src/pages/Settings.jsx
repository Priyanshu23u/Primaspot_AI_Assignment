import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ApiUtils } from '../services/api'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('api')
  const [apiSettings, setApiSettings] = useState({
    base_url: 'http://localhost:8000/api/v1',
    timeout: 30000,
    retry_attempts: 3,
    enable_real_time: true,
    auto_refresh_interval: 300000
  })
  
  const [notificationSettings, setNotificationSettings] = useState({
    engagement_spikes: true,
    new_content: true,
    viral_alerts: true,
    milestone_alerts: true,
    system_notifications: true,
    email_notifications: false,
    sound_enabled: true
  })

  const [exportSettings, setExportSettings] = useState({
    default_format: 'csv',
    include_images: false,
    compress_files: true,
    auto_cleanup: true,
    retention_days: 30
  })

  // API Health Check
  const { data: apiHealth, isLoading: healthLoading, refetch: checkHealth } = useQuery({
    queryKey: ['api-health'],
    queryFn: () => ApiUtils.healthCheck(),
    retry: false,
    refetchInterval: 60000
  })

  const saveSettingsMutation = useMutation({
    mutationFn: async (settings) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return settings
    },
    onSuccess: () => {
      toast.success('Settings saved successfully')
    },
    onError: () => {
      toast.error('Failed to save settings')
    }
  })

  const testApiConnectionMutation = useMutation({
    mutationFn: async () => {
      return ApiUtils.healthCheck()
    },
    onSuccess: (data) => {
      if (data.status === 'healthy') {
        toast.success('API connection successful!')
      } else {
        toast.error('API connection failed')
      }
    },
    onError: () => {
      toast.error('Failed to connect to API')
    }
  })

  const handleSaveSettings = (settingsType, settings) => {
    saveSettingsMutation.mutate({ type: settingsType, data: settings })
  }

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#059669'
      case 'degraded': return '#f59e0b'
      case 'unavailable': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getHealthStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '?'
      case 'degraded': return '??'
      case 'unavailable': return '?'
      default: return '?'
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Settings & Configuration
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your Instagram Analytics Dashboard preferences and API connections
        </p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e5e7eb' }}>
          {[
            { key: 'api', label: 'API Configuration', icon: '??' },
            { key: 'notifications', label: 'Notifications', icon: '??' },
            { key: 'export', label: 'Export Settings', icon: '??' },
            { key: 'appearance', label: 'Appearance', icon: '??' },
            { key: 'security', label: 'Security', icon: '??' }
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

      {/* API Configuration Tab */}
      {activeTab === 'api' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
              API Configuration
            </h2>
            
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    API Base URL
                  </label>
                  <input
                    type="url"
                    value={apiSettings.base_url}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, base_url: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                    placeholder="http://localhost:8000/api/v1"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Request Timeout (ms)
                    </label>
                    <input
                      type="number"
                      value={apiSettings.timeout}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Retry Attempts
                    </label>
                    <input
                      type="number"
                      value={apiSettings.retry_attempts}
                      onChange={(e) => setApiSettings(prev => ({ ...prev, retry_attempts: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => testApiConnectionMutation.mutate()}
                    disabled={testApiConnectionMutation.isLoading}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      cursor: testApiConnectionMutation.isLoading ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {testApiConnectionMutation.isLoading ? '?? Testing...' : '?? Test Connection'}
                  </button>
                  
                  <button
                    onClick={() => handleSaveSettings('api', apiSettings)}
                    disabled={saveSettingsMutation.isLoading}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: saveSettingsMutation.isLoading ? '#9ca3af' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      cursor: saveSettingsMutation.isLoading ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {saveSettingsMutation.isLoading ? '? Saving...' : '?? Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* API Status Sidebar */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              API Status
            </h3>
            
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '2rem' }}>
                  {getHealthStatusIcon(apiHealth?.status)}
                </span>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>
                    {apiHealth?.status === 'healthy' ? 'Connected' : 
                     apiHealth?.status === 'degraded' ? 'Degraded' :
                     apiHealth?.status === 'unavailable' ? 'Unavailable' : 'Unknown'}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    API Status
                  </div>
                </div>
              </div>
              
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
                <div>Endpoint: {apiSettings.base_url}</div>
                <div>Last checked: {new Date().toLocaleTimeString()}</div>
              </div>
              
              <button
                onClick={() => checkHealth()}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                ?? Refresh Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
            Notification Preferences
          </h2>
          
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { key: 'engagement_spikes', label: 'Engagement Spikes', description: 'Notify when posts get unusual engagement' },
                { key: 'new_content', label: 'New Content', description: 'Notify when influencers post new content' },
                { key: 'viral_alerts', label: 'Viral Alerts', description: 'Notify when content goes viral' },
                { key: 'milestone_alerts', label: 'Milestone Alerts', description: 'Notify when influencers reach milestones' },
                { key: 'system_notifications', label: 'System Notifications', description: 'System updates and maintenance alerts' }
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {item.description}
                    </div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings[item.key]}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: notificationSettings[item.key] ? '#3b82f6' : '#d1d5db',
                      transition: '.4s',
                      borderRadius: '24px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: notificationSettings[item.key] ? '23px' : '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '.4s',
                        borderRadius: '50%'
                      }}></span>
                    </span>
                  </label>
                </div>
              ))}
              
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <button
                  onClick={() => handleSaveSettings('notifications', notificationSettings)}
                  disabled={saveSettingsMutation.isLoading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: saveSettingsMutation.isLoading ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: saveSettingsMutation.isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {saveSettingsMutation.isLoading ? '? Saving...' : '?? Save Notifications'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Settings Tab */}
      {activeTab === 'export' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
            Export & Data Settings
          </h2>
          
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Default Export Format
                </label>
                <select
                  value={exportSettings.default_format}
                  onChange={(e) => setExportSettings(prev => ({ ...prev, default_format: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel</option>
                  <option value="json">JSON</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={exportSettings.include_images}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, include_images: e.target.checked }))}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ color: '#374151', fontWeight: '500' }}>Include Images in Exports</span>
                </label>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={exportSettings.compress_files}
                    onChange={(e) => setExportSettings(prev => ({ ...prev, compress_files: e.target.checked }))}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ color: '#374151', fontWeight: '500' }}>Compress Large Files</span>
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  File Retention (days)
                </label>
                <input
                  type="number"
                  value={exportSettings.retention_days}
                  onChange={(e) => setExportSettings(prev => ({ ...prev, retention_days: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                  min="1"
                  max="365"
                />
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                  Exported files will be automatically deleted after this period
                </p>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                <button
                  onClick={() => handleSaveSettings('export', exportSettings)}
                  disabled={saveSettingsMutation.isLoading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: saveSettingsMutation.isLoading ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: saveSettingsMutation.isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {saveSettingsMutation.isLoading ? '? Saving...' : '?? Save Export Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {(activeTab === 'appearance' || activeTab === 'security') && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
            {activeTab === 'appearance' ? '??' : '??'}
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            {activeTab === 'appearance' ? 'Appearance Settings' : 'Security Settings'}
          </h3>
          <p>Coming soon in future updates</p>
        </div>
      )}
    </div>
  )
}

export default Settings
