import React from 'react'
import { usePlatformAnalytics } from '../hooks/useAnalytics'
import StatsCards from '../components/Dashboard/StatsCards'
import TopInfluencers from '../components/Dashboard/TopInfluencers'
import EngagementChart from '../components/Dashboard/EngagementChart'
import RecentActivity from '../components/Dashboard/RecentActivity'
import QuickActions from '../components/Dashboard/QuickActions'

const Dashboard = () => {
  const { data: analyticsData, isLoading, error, refetch } = usePlatformAnalytics()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back! Here's what's happening with your Instagram analytics.
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Stats Cards */}
      <StatsCards 
        data={analyticsData?.platform_statistics}
        isLoading={isLoading}
        error={error}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-8">
          <EngagementChart 
            data={analyticsData?.engagement_trends}
            isLoading={isLoading}
            error={error}
          />
          <RecentActivity 
            data={analyticsData?.recent_activity}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          <TopInfluencers 
            data={analyticsData}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
