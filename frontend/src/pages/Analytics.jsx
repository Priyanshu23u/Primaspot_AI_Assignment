import React from 'react'

const Analytics = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Analytics Overview
        </h1>
        <p style={{ color: '#6b7280' }}>
          Comprehensive analytics and insights across all influencers
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '32px' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb',
          padding: '24px' 
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
            Engagement Trends
          </h2>
          <div style={{ 
            height: '256px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '3rem' }}>📊</div>
            <p style={{ color: '#6b7280', textAlign: 'center' }}>
              Chart integration coming soon
            </p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb',
          padding: '24px' 
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
            Performance Metrics
          </h2>
          <div style={{ 
            height: '256px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '3rem' }}>📈</div>
            <p style={{ color: '#6b7280', textAlign: 'center' }}>
              Metrics visualization coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Sample Analytics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '24px',
        marginTop: '32px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
            3
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Active Influencers
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📸</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
            127
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Posts This Month
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💙</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
            4.2%
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Avg Engagement Rate
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎥</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
            45
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Reels This Month
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
