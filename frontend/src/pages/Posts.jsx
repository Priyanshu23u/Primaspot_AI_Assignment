import React, { useState } from 'react'
import { FunnelIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { usePosts } from '../hooks/usePosts'
import Button from '../components/common/UI/Button'
import SearchBar from '../components/common/UI/SearchBar'
import Modal from '../components/common/UI/Modal'
import PostsList from '../components/Posts/PostsList'
import PostFilters from '../components/Posts/PostFilters'
import AIInsights from '../components/Posts/AIInsights'

const Posts = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [filters, setFilters] = useState({
    analyzed_only: false,
    vibe_classification: '',
    category: '',
    min_likes: '',
    max_likes: '',
    quality_score_min: '',
    quality_score_max: '',
    date_from: '',
    date_to: '',
  })

  const { 
    data: postsData, 
    isLoading, 
    error, 
    refetch 
  } = usePosts({ 
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
      category: '',
      min_likes: '',
      max_likes: '',
      quality_score_min: '',
      quality_score_max: '',
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
            Posts Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            AI-powered analysis of Instagram posts with insights and metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowInsights(true)}
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search posts by caption, keywords, or hashtags..."
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
          {filters.category && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Category: {filters.category}
            </span>
          )}
          {filters.min_likes && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
              Min likes: {Number(filters.min_likes).toLocaleString()}
            </span>
          )}
          {filters.quality_score_min && (
            <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
              Min quality: {filters.quality_score_min}/10
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

      {/* Posts List */}
      <PostsList
        data={postsData}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Posts"
        size="lg"
      >
        <PostFilters
          filters={filters}
          onChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      </Modal>

      {/* AI Insights Modal */}
      <Modal
        isOpen={showInsights}
        onClose={() => setShowInsights(false)}
        title="AI Content Insights"
        size="xl"
      >
        <AIInsights
          data={postsData}
          onClose={() => setShowInsights(false)}
        />
      </Modal>
    </div>
  )
}

export default Posts
