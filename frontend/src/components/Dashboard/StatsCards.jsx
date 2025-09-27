import React from 'react'
import { 
  UsersIcon, 
  PhotoIcon, 
  PlayIcon, 
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline'
import Card from '../common/UI/Card'
import LoadingSpinner from '../common/UI/LoadingSpinner'

const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  }

  return (
    <Card>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]} text-white`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        {change && (
          <div className={`flex items-center text-sm ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'increase' ? (
              <TrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            {change}
          </div>
        )}
      </div>
    </Card>
  )
}

const StatsCards = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-24 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="text-center py-8">
        <p className="text-red-600">Failed to load statistics</p>
      </Card>
    )
  }

  const stats = [
    {
      title: 'Total Influencers',
      value: data?.total_influencers?.toLocaleString() || '0',
      change: data?.influencers_change || null,
      changeType: data?.influencers_change_type || 'increase',
      icon: UsersIcon,
      color: 'blue',
    },
    {
      title: 'Total Posts',
      value: data?.total_posts?.toLocaleString() || '0',
      change: data?.posts_change || null,
      changeType: data?.posts_change_type || 'increase',
      icon: PhotoIcon,
      color: 'green',
    },
    {
      title: 'Total Reels',
      value: data?.total_reels?.toLocaleString() || '0',
      change: data?.reels_change || null,
      changeType: data?.reels_change_type || 'increase',
      icon: PlayIcon,
      color: 'purple',
    },
    {
      title: 'Avg Engagement',
      value: `${data?.avg_engagement?.toFixed(2) || '0.00'}%`,
      change: data?.engagement_change || null,
      changeType: data?.engagement_change_type || 'increase',
      icon: ChartBarIcon,
      color: 'orange',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}

export default StatsCards
