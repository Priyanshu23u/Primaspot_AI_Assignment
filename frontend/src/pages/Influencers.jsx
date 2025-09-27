import React, { useState } from 'react'
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { useInfluencers, useSearchInfluencers } from '../hooks/useInfluencers'
import { useDebounce } from '../hooks/useDebounce'
import Button from '../components/common/UI/Button'
import SearchBar from '../components/common/UI/SearchBar'
import Modal from '../components/common/UI/Modal'
import InfluencersList from '../components/Influencers/InfluencersList'
import InfluencerFilters from '../components/Influencers/InfluencerFilters'
import AddInfluencer from '../components/Influencers/AddInfluencer'

const Influencers = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filters, setFilters] = useState({
    verified_only: false,
    min_followers: '',
    max_followers: '',
    engagement_min: '',
    engagement_max: '',
  })

  const debouncedSearch = useDebounce(searchQuery, 300)
  
  // Main influencers query with filters
  const { 
    data: influencersData, 
    isLoading, 
    error, 
    refetch 
  } = useInfluencers({ 
    ...filters,
    search: debouncedSearch 
  })

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({
      verified_only: false,
      min_followers: '',
      max_followers: '',
      engagement_min: '',
      engagement_max: '',
    })
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Influencers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and analyze your influencer network
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Influencer
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search influencers by username, name, or bio..."
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
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.verified_only && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              Verified only
            </span>
          )}
          {filters.min_followers && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Min followers: {Number(filters.min_followers).toLocaleString()}
            </span>
          )}
          {filters.max_followers && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
              Max followers: {Number(filters.max_followers).toLocaleString()}
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

      {/* Influencers List */}
      <InfluencersList
        data={influencersData}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Influencers"
        size="md"
      >
        <InfluencerFilters
          filters={filters}
          onChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      </Modal>

      {/* Add Influencer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Influencer"
        size="lg"
      >
        <AddInfluencer
          onSuccess={() => {
            setShowAddModal(false)
            refetch()
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
    </div>
  )
}

export default Influencers
