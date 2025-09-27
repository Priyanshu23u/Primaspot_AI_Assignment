import React, { useState } from 'react'
import { FunnelIcon, PlayIcon } from '@heroicons/react/24/outline'
import { useReels } from '../hooks/useReels'
import Button from '../components/common/UI/Button'
import SearchBar from '../components/common/UI/SearchBar'
import Modal from '../components/common/UI/Modal'
import ReelsList from '../components/Reels/ReelsList'
import ReelFilters from '../components/Reels/ReelFilters'
import VideoAnalytics from '../components/Reels/VideoAnalytics'

const Reels = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [filters, setFilters] = useState({
    analyzed_only: false,
    vibe_classification: '',
    min_views: '',
    max_views: '',
    min_duration: '',
    max_duration: '',
    date_from: '',
    date_to: '',
  })

  const { 
    data: reelsData, 
    isLoading, 
    error, 
    refetch 
  } = useReels({ 
    ...filters,
    search: searchQuery 
  })

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      analyzed_only: false,
      vibe_classification: '',
      min_views: '',
      max_views: '',
      min_duration: '',
      max_duration: '',
      date_from: '',
      date_to: '',
    })
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reels Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            AI-powered video content analysis with advanced insights
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAnalytics(true)}
        >
          <PlayIcon className="w-4 h-4 mr-2" />
          Video Analytics
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search reels by caption, events, or tags..."
            onSearch={setSearchQuery}
            value={searchQuery}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(true)}
        >
          <FunnelIcon className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Active Filters Display */}
      {Object.values(filters).some(value => value) && (
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.analyzed_only && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
              AI Analyzed only
            </span>
          )}
          {filters.vibe_classification && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Vibe: {filters.vibe_classification}
            </span>
          )}
          {filters.min_views && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Min views: {Number(filters.min_views).toLocaleString()}
            </span>
          )}
          {filters.min_duration && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
              Min duration: {filters.min_duration}s
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Reels List */}
      <ReelsList
        data={reelsData}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Reels"
        size="lg"
      >
        <ReelFilters
          filters={filters}
          onChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      </Modal>

      {/* Video Analytics Modal */}
      <Modal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        title="Video Analytics Dashboard"
        size="full"
      >
        <VideoAnalytics
          data={reelsData}
          onClose={() => setShowAnalytics(false)}
        />
      </Modal>
    </div>
  )
}

export default Reels
