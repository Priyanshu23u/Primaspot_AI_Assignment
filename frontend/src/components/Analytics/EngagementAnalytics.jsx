import React from 'react'
import LineChart from '../common/Charts/LineChart'
import BarChart from '../common/Charts/BarChart'
import Card from '../common/UI/Card'
import Badge from '../common/UI/Badge'
import LoadingSpinner from '../common/UI/LoadingSpinner'

const EngagementMetricCard = ({ title, value, change, changeType, description }) => (
  <Card>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        {change && (
          <Badge variant={changeType === 'increase' ? 'success' : 'danger'} size="sm">
            {changeType === 'increase' ? '+' : ''}{change}
          </Badge>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  </Card>
)

const EngagementAnalytics = ({ data, isLoading, timeRange }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-24 flex items-center justify-center">
              <LoadingSpinner size="sm" />
            </Card>
          ))}
        </div>
        <Card className="h-96 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading engagement analytics..." />
        </Card>
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No engagement data available for the selected time range.
        </p>
      </Card>
    )
  }

  const metrics = [
    {
      title: 'Average Engagement Rate',
      value: `${data.avg_engagement_rate?.toFixed(2) || 0}%`,
      change: data.engagement_rate_change || null,
      changeType: data.engagement_rate_change_type || 'increase',
      description: 'Across all posts and reels',
    },
    {
      title: 'Total Interactions',
      value: data.total_interactions?.toLocaleString() || '0',
      change: data.interactions_change || null,
      changeType: data.interactions_change_type || 'increase',
      description: 'Likes, comments, shares',
    },
    {
      title: 'Peak Engagement Time',
      value: data.peak_engagement_time || 'N/A',
      description: 'Best time to post',
    },
    {
      title: 'Engagement Score',
      value: `${data.engagement_score?.toFixed(1) || 0}/10`,
      change: data.score_change || null,
      changeType: data.score_change_type || 'increase',
      description: 'Overall performance rating',
    },
  ]

  // Prepare engagement trend chart data
  const engagementTrendData = {
    labels: data.engagement_timeline?.labels || [],
    datasets: [
      {
        label: 'Engagement Rate',
        data: data.engagement_timeline?.engagement_rates || [],
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f620',
        tension: 0.4,
      },
      {
        label: 'Posts Count',
        data: data.engagement_timeline?.posts_count || [],
        borderColor: '#10b981',
        backgroundColor: '#10b98120',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  }

  const engagementOptions = {
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Engagement Rate (%)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Posts Count',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  // Prepare engagement by content type chart
  const contentTypeData = {
    labels: ['Posts', 'Reels', 'Stories', 'IGTV'],
    datasets: [
      {
        label: 'Average Engagement Rate',
        data: [
          data.content_type_engagement?.posts || 0,
          data.content_type_engagement?.reels || 0,
          data.content_type_engagement?.stories || 0,
          data.content_type_engagement?.igtv || 0,
        ],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      },
    ],
  }

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <EngagementMetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Engagement Timeline */}
        <div className="lg:col-span-2">
          <LineChart
            data={engagementTrendData}
            title="Engagement Rate Trend"
            options={engagementOptions}
            gradient={true}
            height={400}
          />
        </div>

        {/* Content Type Performance */}
        <BarChart
          data={contentTypeData}
          title="Engagement by Content Type"
          height={300}
        />

        {/* Top Performing Hours */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Peak Engagement Hours
          </h3>
          <div className="space-y-3">
            {data.peak_hours?.slice(0, 5).map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {hour.time}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {hour.engagement_rate.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {hour.posts_count} posts
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No peak hours data available
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Performance Highlights</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Best performing content type: {data.insights?.best_content_type || 'Reels'}</li>
              <li>• Optimal posting time: {data.insights?.optimal_time || '7-9 PM'}</li>
              <li>• Average engagement rate is {data.insights?.performance_vs_benchmark || 'above'} industry benchmark</li>
              <li>• {data.insights?.consistency_rating || 'Good'} posting consistency</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Recommendations</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Focus more on {data.insights?.recommended_content_type || 'Reels'} content</li>
              <li>• Post during peak hours: {data.insights?.recommended_times || '7-9 PM'}</li>
              <li>• Increase {data.insights?.improvement_area || 'video content'} frequency</li>
              <li>• Consider {data.insights?.strategy_suggestion || 'user-generated content'} strategies</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default EngagementAnalytics
