import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/common/Layout/Layout'
import LoadingSpinner from './components/common/UI/LoadingSpinner'

// Page imports
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Influencers from './pages/Influencers'
import Posts from './pages/Posts'
import Reels from './pages/Reels'
import Analytics from './pages/Analytics'
import Demographics from './pages/Demographics'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Home />} />
        
        {/* Protected routes with layout */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="influencers" element={<Influencers />} />
          <Route path="posts" element={<Posts />} />
          <Route path="reels" element={<Reels />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="demographics" element={<Demographics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
