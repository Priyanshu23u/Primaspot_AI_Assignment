import React from 'react'

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your Instagram analytics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              👥
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Influencers</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              📸
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">9</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              🎥
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reels</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              📊
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
              <p className="text-2xl font-bold text-gray-900">4.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Engagement Trends
          </h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <div className="text-gray-500 text-center">
              📈 Engagement Chart
              <br />
              <small>Coming soon...</small>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Influencers
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm">
                  S
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">@fitness_guru_sarah</p>
                  <p className="text-xs text-gray-500">125K followers</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">4.8%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                  E
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">@travel_with_emma</p>
                  <p className="text-xs text-gray-500">156K followers</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">5.2%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                  M
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">@tech_reviewer_mike</p>
                  <p className="text-xs text-gray-500">89K followers</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">3.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
