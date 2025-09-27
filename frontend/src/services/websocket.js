import toast from 'react-hot-toast'

class WebSocketService {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 3
    this.reconnectInterval = 5000
    this.listeners = new Map()
    this.isConnected = false
    this.connectionEnabled = false // Disabled by default
  }

  // Enable WebSocket connections (call this when backend supports it)
  enable() {
    console.log('📡 WebSocket support enabled')
    this.connectionEnabled = true
    this.connect()
  }

  // Disable WebSocket connections
  disable() {
    console.log('📡 WebSocket support disabled')
    this.connectionEnabled = false
    this.disconnect()
  }

  connect(url = null) {
    // Don't attempt connection if disabled or already connected
    if (!this.connectionEnabled || this.isConnected) {
      return
    }

    const wsUrl = url || (
      process.env.NODE_ENV === 'production' 
        ? 'wss://your-domain.com/ws/' 
        : 'ws://localhost:8000/ws/'
    )

    try {
      console.log('📡 Attempting WebSocket connection...')
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected successfully')
        this.isConnected = true
        this.reconnectAttempts = 0
        
        // Send authentication if available
        const token = localStorage.getItem('auth_token')
        if (token) {
          this.send({
            type: 'authenticate',
            token: token
          })
        }
        
        // Notify listeners
        this.notifyListeners('connection', { status: 'connected' })
        
        // Show success toast (only once)
        toast.success('🔴 Live updates connected', { 
          id: 'websocket-status',
          duration: 3000 
        })
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('📨 WebSocket message received:', data)
          
          // Route message to appropriate listeners
          this.handleMessage(data)
        } catch (error) {
          console.warn('Failed to parse WebSocket message:', error)
        }
      }

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason)
        this.isConnected = false
        
        // Notify listeners
        this.notifyListeners('connection', { status: 'disconnected' })
        
        // Only attempt to reconnect if connection was enabled and not a clean close
        if (this.connectionEnabled && event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect()
        } else if (event.code === 1006) {
          // Connection failed - likely WebSocket not supported by backend
          console.log('💡 WebSocket not available - using polling mode')
          this.connectionEnabled = false
          toast('📡 Real-time mode unavailable - using standard updates', {
            icon: '💡',
            duration: 4000
          })
        }
      }

      this.ws.onerror = (error) => {
        console.warn('🟡 WebSocket connection failed - this is normal if backend doesn\'t support WebSocket')
        // Don't show error toast for connection failures - they're expected
      }

    } catch (error) {
      console.warn('WebSocket connection attempt failed:', error.message)
      this.connectionEnabled = false
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.connectionEnabled) {
      console.log('⏹️ WebSocket reconnection disabled')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectInterval * this.reconnectAttempts
    
    console.log(`🔄 Attempting WebSocket reconnect in ${delay/1000}s (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    setTimeout(() => {
      if (!this.isConnected && this.connectionEnabled) {
        this.connect()
      }
    }, delay)
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
      return true
    } else {
      console.log('📡 WebSocket not connected - message queued')
      return false
    }
  }

  handleMessage(data) {
    const { type, payload } = data

    switch (type) {
      case 'engagement_update':
        this.notifyListeners('engagement', payload)
        this.showEngagementNotification(payload)
        break
        
      case 'new_post':
        this.notifyListeners('posts', payload)
        this.showNewContentNotification(payload, 'post')
        break
        
      case 'new_reel':
        this.notifyListeners('reels', payload)
        this.showNewContentNotification(payload, 'reel')
        break
        
      case 'viral_alert':
        this.notifyListeners('viral', payload)
        this.showViralAlert(payload)
        break
        
      case 'follower_milestone':
        this.notifyListeners('milestones', payload)
        this.showMilestoneNotification(payload)
        break
        
      case 'analytics_update':
        this.notifyListeners('analytics', payload)
        break
        
      case 'system_notification':
        this.notifyListeners('system', payload)
        this.showSystemNotification(payload)
        break
        
      case 'error':
        console.error('WebSocket error message:', payload)
        toast.error(payload.message || 'An error occurred')
        break
        
      default:
        console.log('Unknown WebSocket message type:', type, payload)
        this.notifyListeners(type, payload)
    }
  }

  showEngagementNotification(payload) {
    if (payload.spike && payload.spike > 50) {
      toast.success(
        `🚀 Engagement spike! ${payload.influencer_username} is getting ${payload.spike}% more engagement than usual`,
        { duration: 6000 }
      )
    }
  }

  showNewContentNotification(payload, contentType) {
    toast(
      `📱 New ${contentType} from @${payload.influencer_username}`,
      {
        icon: contentType === 'post' ? '📸' : '🎥',
        duration: 4000
      }
    )
  }

  showViralAlert(payload) {
    toast.success(
      `🔥 VIRAL ALERT! @${payload.influencer_username}'s ${payload.content_type} is trending with ${payload.engagement_rate}% engagement!`,
      {
        duration: 8000,
        style: {
          background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
          color: '#000'
        }
      }
    )
  }

  showMilestoneNotification(payload) {
    toast.success(
      `🎉 Milestone reached! @${payload.influencer_username} hit ${payload.milestone_type}: ${payload.value.toLocaleString()}`,
      { duration: 6000 }
    )
  }

  showSystemNotification(payload) {
    const { level, message } = payload
    const toastFn = level === 'error' ? toast.error : 
                   level === 'warning' ? toast : 
                   toast.success

    toastFn(message, { duration: 5000 })
  }

  // Subscribe to specific message types
  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set())
    }
    this.listeners.get(eventType).add(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType)
      if (callbacks) {
        callbacks.delete(callback)
        if (callbacks.size === 0) {
          this.listeners.delete(eventType)
        }
      }
    }
  }

  notifyListeners(eventType, data) {
    const callbacks = this.listeners.get(eventType)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in WebSocket listener for ${eventType}:`, error)
        }
      })
    }
  }

  disconnect() {
    if (this.ws) {
      console.log('🔌 Manually disconnecting WebSocket')
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
      this.isConnected = false
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isEnabled: this.connectionEnabled,
      readyState: this.ws?.readyState || WebSocket.CLOSED,
      reconnectAttempts: this.reconnectAttempts
    }
  }

  // Simulate real-time updates when WebSocket is not available
  simulateUpdates() {
    if (this.isConnected || !this.connectionEnabled) return

    console.log('📡 Starting simulated real-time updates')
    
    // Simulate engagement updates every 30 seconds
    setInterval(() => {
      if (!this.isConnected) {
        const mockEngagement = {
          influencer_username: ['fitness_guru_sarah', 'tech_reviewer_mike', 'travel_with_emma'][Math.floor(Math.random() * 3)],
          spike: Math.floor(Math.random() * 100) + 20,
          current_rate: Math.random() * 10 + 2
        }
        
        if (Math.random() > 0.8) { // 20% chance
          this.handleMessage({
            type: 'engagement_update',
            payload: mockEngagement
          })
        }
      }
    }, 30000)

    // Simulate viral alerts every 2 minutes
    setInterval(() => {
      if (!this.isConnected && Math.random() > 0.9) { // 10% chance
        const mockViral = {
          influencer_username: ['fitness_guru_sarah', 'tech_reviewer_mike', 'travel_with_emma'][Math.floor(Math.random() * 3)],
          content_type: Math.random() > 0.5 ? 'post' : 'reel',
          engagement_rate: Math.random() * 5 + 8
        }
        
        this.handleMessage({
          type: 'viral_alert',
          payload: mockViral
        })
      }
    }, 120000)
  }
}

// Create singleton instance
const webSocketService = new WebSocketService()

// React hook for WebSocket integration
export const useWebSocket = () => {
  const [connectionStatus, setConnectionStatus] = React.useState(
    webSocketService.getConnectionStatus()
  )

  React.useEffect(() => {
    const unsubscribe = webSocketService.subscribe('connection', (data) => {
      setConnectionStatus(webSocketService.getConnectionStatus())
    })

    return unsubscribe
  }, [])

  const subscribe = React.useCallback((eventType, callback) => {
    return webSocketService.subscribe(eventType, callback)
  }, [])

  const send = React.useCallback((data) => {
    return webSocketService.send(data)
  }, [])

  return {
    connectionStatus,
    subscribe,
    send,
    connect: () => webSocketService.connect(),
    disconnect: () => webSocketService.disconnect(),
    enable: () => webSocketService.enable(),
    disable: () => webSocketService.disable()
  }
}

export default webSocketService
