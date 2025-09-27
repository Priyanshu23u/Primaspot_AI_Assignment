import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Import pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Demographics from './pages/Demographics'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/app" element={
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                  <h1 className="text-xl font-bold text-gray-800">
                    Instagram Analytics
                  </h1>
                  <div className="flex space-x-4">
                    <a href="/app/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                    <a href="/profile" className="text-gray-600 hover:text-gray-900">Profile</a>
                    <a href="/settings" className="text-gray-600 hover:text-gray-900">Settings</a>
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto">
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="demographics" element={<Demographics />} />
              </Routes>
            </main>
          </div>
        } />
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/demographics" element={<Demographics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
