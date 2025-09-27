import React, { useState } from 'react'
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  DocumentArrowDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { useEngagementAnalytics, useTrendAnalysis, useExportAnalytics } from '../hooks/useAnalytics'
import { useApp } from '../contexts/AppContext'
import Card from '../components/common/UI/Card'
import Button from '../components/common/UI/Button'
import EngagementAnalytics from '../components/Analytics/EngagementAnalytics'
import ContentPerformance from '../components/Analytics/ContentPerformance'
import TrendAnalysis from '../components/Analytics/TrendAnalysis'
import ComparisonView from '../components/Analytics/ComparisonView'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [activeTab, setActiveTab] = useState('engagement')
  const { selectedInfluencers, filters } = useApp()
  
  const { data: engagementData, isLoading: engagementLoading } = useEngagementAnalytics({
    time_range: timeRange,
    influencers: selectedInfluencers.join(','),
  })

  const { data: trendData, isLoading: trendLoading } = useTrendAnalysis(timeRange)
  const exportMutation = useExportAnalytics()

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ]

  const tabs = [
    { id: 'engagement', label: 'Engagement', icon: ChartBarIcon },
    { id: 'content', label: 'Content Performance', icon: ArrowTrendingUpIcon },
    { id: 'trends', label: 'Trend Analysis', icon: CalendarIcon },
    { id: 'comparison', label: 'Comparison', icon: DocumentArrowDownIcon },
  ]

  const handleExport = async (format = 'csv') => {
    try {
      await exportMutation.mutateAsync({
        format,
        params: {
          time_range: timeRange,
          influencers: selectedInfluencers.join(','),
          tab: activeTab,
        }
      })
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Advanced Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Deep insights into engagement patterns, trends, and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            loading={exportMutation.isLoading}
          >
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            loading={exportMutation.isLoading}
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Range:
            </span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Influencers Info */}
          {selectedInfluencers.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Analyzing {selectedInfluencers.length} selected influencer{selectedInfluencers.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'engagement' && (
          <EngagementAnalytics
            data={engagementData}
            isLoading={engagementLoading}
            timeRange={timeRange}
          />
        )}

        {activeTab === 'content' && (
          <ContentPerformance
            timeRange={timeRange}
            selectedInfluencers={selectedInfluencers}
          />
        )}

        {activeTab === 'trends' && (
          <TrendAnalysis
            data={trendData}
            isLoading={trendLoading}
            timeRange={timeRange}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonView
            selectedInfluencers={selectedInfluencers}
            timeRange={timeRange}
          />
        )}
      </div>
    </div>
  )
}

export default Analytics
