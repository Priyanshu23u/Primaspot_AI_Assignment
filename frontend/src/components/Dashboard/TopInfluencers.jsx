import React from 'react'
import { Link } from 'react-router-dom'
import { CheckBadgeIcon, UserIcon } from '@heroicons/react/24/solid'
import Card from '../common/UI/Card'
import Badge from '../common/UI/Badge'
import LoadingSpinner from '../common/UI/LoadingSpinner'

const InfluencerRow = ({ influencer, rank }) => {
  return (
    <div className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold">
          {rank}
        </div>
        <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Link
              to={`/app/influencers/${influencer.id}`}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600"
            >
              @{influencer.username}
            </Link>
            {influencer.is_verified && (
              <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {influencer.full_name}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {influencer.followers_count?.toLocaleString() || '0'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          followers
        </p>
      </div>
    </div>
  )
}

const TopInfluencers = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Influencers
          </h3>
          <Badge variant="primary" size="sm">
            By Followers
          </Badge>
        </div>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading top influencers..." />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Influencers
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load top influencers</p>
        </div>
      </Card>
    )
  }

  const influencers = data?.top_influencers || []

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Top Influencers
        </h3>
        <Badge variant="primary" size="sm">
          By Followers
        </Badge>
      </div>
      
      {influencers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No influencers data available
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {influencers.slice(0, 5).map((influencer, index) => (
            <InfluencerRow
              key={influencer.id}
              influencer={influencer}
              rank={index + 1}
            />
          ))}
        </div>
      )}
      
      {influencers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/app/influencers"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View all influencers →
          </Link>
        </div>
      )}
    </Card>
  )
}

export default TopInfluencers
