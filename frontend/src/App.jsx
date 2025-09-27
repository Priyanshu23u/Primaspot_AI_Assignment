import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

// Import Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import InfluencerProfile from './pages/InfluencerProfile'
import Analytics from './pages/Analytics'
import Demographics from './pages/Demographics'
import Reports from './pages/Reports'
import Search from './pages/Search'
import Settings from './pages/Settings'
import Trending from './pages/Trending'
import NotFound from './pages/NotFound'

// Import Layout
import Layout from './components/common/Layout/Layout'

// Import Contexts
import { AppProvider } from './contexts/AppContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Import WebSocket service
import webSocketService from './services/websocket'

// Create Query Client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

function App() {
  console.log('🚀 Instagram Analytics Dashboard starting...')

  // Initialize services
  React.useEffect(() => {
    // WebSocket is disabled by default
    // Uncomment the line below when your Django backend supports WebSocket
    // webSocketService.enable()
    
    console.log('📡 WebSocket disabled - using standard polling mode')
    console.log('💡 To enable real-time updates, implement WebSocket in your Django backend')

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect()
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <Router>
            <div className="App">
              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '14px',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#059669',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#dc2626',
                      secondary: '#fff',
                    },
                  },
                  loading: {
                    duration: Infinity,
                  },
                }}
              />

              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                
                {/* Dashboard Routes with Layout */}
                <Route path="/dashboard/*" element={
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/influencer/:username" element={<InfluencerProfile />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/demographics" element={<Demographics />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/trending" element={<Trending />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Layout>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
          
          {/* React Query DevTools - only in development */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
