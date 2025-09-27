import React from 'react'
import { Outlet } from 'react-router-dom'
import { useTheme } from '../../../contexts/ThemeContext'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = () => {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen bg-gray-50 ${theme === 'dark' ? 'dark bg-gray-900' : ''}`}>
      {/* Navbar */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 pt-20">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Layout
