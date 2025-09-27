import React from 'react'

const Demographics = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Demographics Analysis
        </h1>
        <p style={{ color: '#6b7280' }}>
          Audience demographics and geographic insights
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
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
            Age Distribution
          </h2>
          <div style={{ 
            height: '192px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '3rem' }}>👥</div>
            <p style={{ color: '#6b7280', textAlign: 'center' }}>
              Age distribution chart
            </p>
          </div>

          {/* Sample Age Data */}
          <div style={{ marginTop: '16px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>18-24 years</span>
              <span style={{ fontWeight: '500' }}>35%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>25-34 years</span>
              <span style={{ fontWeight: '500' }}>28%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>35-44 years</span>
              <span style={{ fontWeight: '500' }}>22%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>45+ years</span>
              <span style={{ fontWeight: '500' }}>15%</span>
            </div>
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
            Geographic Data
          </h2>
          <div style={{ 
            height: '192px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '3rem' }}>🌍</div>
            <p style={{ color: '#6b7280', textAlign: 'center' }}>
              Geographic distribution map
            </p>
          </div>

          {/* Sample Geographic Data */}
          <div style={{ marginTop: '16px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>🇺🇸 United States</span>
              <span style={{ fontWeight: '500' }}>45%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>🇨🇦 Canada</span>
              <span style={{ fontWeight: '500' }}>18%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>🇬🇧 United Kingdom</span>
              <span style={{ fontWeight: '500' }}>12%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>🇦🇺 Australia</span>
              <span style={{ fontWeight: '500' }}>8%</span>
            </div>
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
            Gender Distribution
          </h2>
          <div style={{ 
            height: '192px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '3rem' }}>⚖️</div>
            <p style={{ color: '#6b7280', textAlign: 'center' }}>
              Gender distribution chart
            </p>
          </div>

          {/* Sample Gender Data */}
          <div style={{ marginTop: '16px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>👩 Female</span>
              <span style={{ fontWeight: '500' }}>58%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#6b7280' }}>👨 Male</span>
              <span style={{ fontWeight: '500' }}>40%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>🏳️‍⚧️ Other</span>
              <span style={{ fontWeight: '500' }}>2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Times */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginTop: '32px'
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
          Peak Activity Times
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '16px',
          textAlign: 'center'
        }}>
          {[
            { time: '6-9 AM', activity: '15%', emoji: '🌅' },
            { time: '12-2 PM', activity: '25%', emoji: '☀️' },
            { time: '6-9 PM', activity: '35%', emoji: '🌆' },
            { time: '9-11 PM', activity: '25%', emoji: '🌙' }
          ].map((slot, index) => (
            <div key={index} style={{ 
              padding: '16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{slot.emoji}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>{slot.time}</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>{slot.activity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Demographics
