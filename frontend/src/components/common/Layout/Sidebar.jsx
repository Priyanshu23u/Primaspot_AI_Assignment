import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import webSocketService from '../../../services/websocket'

const Sidebar = () => {
  const location = useLocation()
  const [connectionStatus, setConnectionStatus] = useState(webSocketService.getConnectionStatus())
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠', description: 'Overview & metrics' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: '📊', description: 'Performance analytics' },
    { name: 'Demographics', href: '/dashboard/demographics', icon: '👥', description: 'Audience insights' },
    { name: 'Trending', href: '/dashboard/trending', icon: '🔥', description: 'Real-time trends' },
    { name: 'Search', href: '/dashboard/search', icon: '🔍', description: 'Advanced search' },
    { name: 'Reports', href: '/dashboard/reports', icon: '📋', description: 'Generate reports' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️', description: 'Configuration' }
  ]

  // Listen for WebSocket connection changes
  useEffect(() => {
    const unsubscribe = webSocketService.subscribe('connection', () => {
      setConnectionStatus(webSocketService.getConnectionStatus())
    })

    // Update status periodically
    const interval = setInterval(() => {
      setConnectionStatus(webSocketService.getConnectionStatus())
    }, 5000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  const getConnectionStatusInfo = () => {
    if (connectionStatus.isConnected) {
      return { text: 'Live Updates Active', color: '#10b981', icon: '🔴' }
    } else if (connectionStatus.isEnabled) {
      return { text: 'Connecting...', color: '#f59e0b', icon: '🟡' }
    } else {
      return { text: 'Standard Mode', color: '#6b7280', icon: '⚪' }
    }
  }

  const statusInfo = getConnectionStatusInfo()

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '256px', 
      height: '100vh',
      backgroundColor: 'white', 
      borderRight: '1px solid #e5e7eb',
      overflowY: 'auto',
      zIndex: 40
    }}>
      {/* Logo */}
      <div style={{ 
        padding: '24px 20px', 
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            IG
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#111827', fontSize: '18px' }}>
              Instagram
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '24px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                style={{ 
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive ? '#f0f9ff' : 'transparent',
                    border: isActive ? '1px solid #e0f2fe' : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <span style={{ 
                    fontSize: '20px', 
                    marginRight: '12px',
                    filter: isActive ? 'brightness(1.2)' : 'none'
                  }}>
                    {item.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? '#0369a1' : '#374151',
                      marginBottom: '2px'
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: isActive ? '#0284c7' : '#9ca3af'
                    }}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#0ea5e9'
                    }} />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: '20px 16px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: 'white'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '8px',
          fontSize: '12px', 
          color: statusInfo.color,
          marginBottom: '4px'
        }}>
          <span style={{ fontSize: '10px' }}>{statusInfo.icon}</span>
          <span>{statusInfo.text}</span>
        </div>
        <div style={{ 
          textAlign: 'center',
          fontSize: '11px', 
          color: '#d1d5db'
        }}>
          v2.1.0 • Built with ❤️
        </div>
      </div>
    </div>
  )
}

export default Sidebar
