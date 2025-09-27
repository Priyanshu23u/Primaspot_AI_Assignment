import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  CheckBadgeIcon, 
  UserIcon, 
  ChartBarIcon,
  EyeIcon 
} from '@heroicons/react/24/outline'
import Card from '../common/UI/Card'
import Badge from '../common/UI/Badge'
import Button from '../common/UI/Button'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import ErrorMessage from '../common/UI/ErrorMessage'
import Pagination from '../common/UI/Pagination'
import { usePagination } from '../../hooks/usePagination'

const InfluencerCard = ({ influencer, onClick }) => {
  const engagementRate = influencer.engagement_rate || 0
  const followerTier = influencer.followers_count >= 1000000 ? 'Mega' :
                      influencer.followers_count >= 100000 ? 'Macro' :
                      influencer.followers_count >= 10000 ? 'Micro' : 'Nano'

  return (
    <Card className="hover:shadow-elevated transition-shadow cursor-pointer" onClick={() => onClick(influencer)}>
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          {influencer.is_verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckBadgeIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              @{influencer.username}
            </h3>
            <Badge variant="default" size="sm">
              {followerTier}
            </Badge>
          </div>
          {influencer.full_name && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
              {influencer.full_name}
            </p>
          )}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{influencer.followers_count?.toLocaleString() || 0} followers</span>
            <span>{influencer.posts_count || 0} posts</span>
            <span className={`font-medium ${
              engagementRate >= 3 ? 'text-green-600' :
              engagementRate >= 1 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {engagementRate.toFixed(2)}% engagement
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              // Navigate to analytics
            }}
          >
            <ChartBarIcon className="w-4 h-4 mr-1" />
            Analytics
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onClick(influencer)
            }}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bio */}
      {influencer.bio && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {influencer.bio}
          </p>
        </div>
      )}
    </Card>
  )
}

const InfluencersList = ({ data, isLoading, error, onRetry }) => {
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  const influencers = data?.results || []
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage
  } = usePagination(influencers, 12)

  const handleInfluencerClick = (influencer) => {
    setSelectedInfluencer(influencer)
    // Could open modal or navigate to detail page
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-40 flex items-center justify-center">
            <LoadingSpinner size="md" />
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load influencers"
        message="There was an error loading the influencers data. Please try again."
        onRetry={onRetry}
      />
    )
  }

  if (influencers.length === 0) {
    return (
      <Card className="text-center py-12">
        <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No influencers found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search criteria or filters to find influencers.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {paginatedData.length} of {influencers.length} influencers
        </div>
        {data?.count && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total: {data.count.toLocaleString()} influencers
          </div>
        )}
      </div>

      {/* Influencers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((influencer) => (
          <InfluencerCard
            key={influencer.id}
            influencer={influencer}
            onClick={handleInfluencerClick}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  )
}

export default InfluencersList
