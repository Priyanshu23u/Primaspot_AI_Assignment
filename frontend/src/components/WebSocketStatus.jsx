import React, { useState, useEffect } from 'react'
import webSocketService from '../services/websocket'
import toast from 'react-hot-toast'

const WebSocketStatus = () => {
  const [status, setStatus] = useState(webSocketService.getConnectionStatus())

  useEffect(() => {
    const unsubscribe = webSocketService.subscribe('connection', () => {
      setStatus(webSocketService.getConnectionStatus())
    })

    return unsubscribe
  }, [])

  const handleToggle = () => {
    if (status.isEnabled) {
      webSocketService.disable()
      toast.success('🔌 WebSocket disabled')
    } else {
      webSocketService.enable()
      toast.loading('🔄 Connecting to WebSocket...', { id: 'ws-connecting' })
    }
  }

  const handleTestMessage = () => {
    if (status.isConnected) {
      webSocketService.send({
        type: 'test',
        message: 'Hello from frontend!'
      })
      toast.success('📤 Test message sent')
    } else {
      toast.error('❌ WebSocket not connected')
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 1000,
      minWidth: '250px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
        🔗 WebSocket Status
      </h4>
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Status: <span style={{ 
            color: status.isConnected ? '#059669' : status.isEnabled ? '#f59e0b' : '#6b7280',
            fontWeight: '500'
          }}>
            {status.isConnected ? '🟢 Connected' : 
             status.isEnabled ? '🟡 Connecting...' : '⚪ Disabled'}
          </span>
        </div>
        {status.reconnectAttempts > 0 && (
          <div style={{ fontSize: '12px', color: '#f59e0b' }}>
            Reconnect attempts: {status.reconnectAttempts}
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <button
          onClick={handleToggle}
          style={{
            padding: '6px 12px',
            backgroundColor: status.isEnabled ? '#dc2626' : '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          {status.isEnabled ? 'Disable' : 'Enable'} WebSocket
        </button>
        
        {status.isConnected && (
          <button
            onClick={handleTestMessage}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Send Test Message
          </button>
        )}
      </div>
      
      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
        💡 Enable this when your Django backend supports WebSocket
      </div>
    </div>
  )
}

export default WebSocketStatus
