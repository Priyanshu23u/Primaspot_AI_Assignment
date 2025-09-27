import React from 'react'
import { Link } from 'react-router-dom'
import { HomeIcon } from '@heroicons/react/24/outline'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <Link 
            to="/dashboard" 
            className="btn btn-primary px-6 py-3 rounded-lg inline-flex items-center gap-2"
          >
            <HomeIcon className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <div>
            <Link to="/" className="text-blue-600 hover:text-blue-700">
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
