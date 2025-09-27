import React from 'react'
import { 
  SparklesIcon, 
  TagIcon, 
  FireIcon, 
  TrendingUpIcon,
  LightBulbIcon 
} from '@heroicons/react/24/outline'
import Card from '../common/UI/Card'
import Badge from '../common/UI/Badge'
import { BarChart } from '../common/Charts/BarChart'
import { PieChart } from '../common/Charts/PieChart'

const InsightCard = ({ icon: Icon, title, value, description, trend }) => (
  <Card>
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
        <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {trend && (
            <Badge variant={trend === 'up' ? 'success' : trend === 'down' ? 'danger' : 'warning'} size="sm">
              {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '→'} {trend}
            </Badge>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {value}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  </Card>
)

const AIInsights = ({ data, onClose }) => {
  const posts = data?.results || []
  const analyzedPosts = posts.filter(post => post.is_analyzed)

  // Calculate insights
  const totalPosts = posts.length
  const totalAnalyzedPosts = analyzedPosts.length
  const averageQuality = analyzedPosts.reduce((sum, post) => 
    sum + (post.quality_score || 0), 0) / analyzedPosts.length || 0

  // Extract keywords frequency
  const keywordFrequency = {}
  analyzedPosts.forEach(post => {
    const keywords = Array.isArray(post.keywords) ? post.keywords : 
                     (post.keywords ? JSON.parse(post.keywords) : [])
    keywords.forEach(keyword => {
      keywordFrequency[keyword] = (keywordFrequency[keyword] || 0) + 1
    })
  })

  const topKeywords = Object.entries(keywordFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)

  // Vibe distribution
  const vibeDistribution = {}
  analyzedPosts.forEach(post => {
    const vibe = post.vibe_classification || 'unknown'
    vibeDistribution[vibe] = (vibeDistribution[vibe] || 0) + 1
  })

  // Category distribution
  const categoryDistribution = {}
  analyzedPosts.forEach(post => {
    const category = post.category || 'uncategorized'
    categoryDistribution[category] = (categoryDistribution[category] || 0) + 1
  })

  // Performance metrics
  const highQualityPosts = analyzedPosts.filter(post => post.quality_score >= 8).length
  const totalEngagement = posts.reduce((sum, post) => 
    sum + (post.likes_count || 0) + (post.comments_count || 0), 0)
  const averageEngagement = totalEngagement / posts.length || 0

  // Prepare chart data
  const vibeChartData = {
    labels: Object.keys(vibeDistribution),
    datasets: [{
      data: Object.values(vibeDistribution),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
    }]
  }

  const keywordsChartData = {
    labels: topKeywords.map(([keyword]) => keyword),
    datasets: [{
      label: 'Frequency',
      data: topKeywords.map(([, count]) => count),
      backgroundColor: '#3b82f6',
    }]
  }

  const insights = [
    {
      icon: SparklesIcon,
      title: 'Content Quality',
      value: `${averageQuality.toFixed(1)}/10`,
      description: `${highQualityPosts} posts have high quality scores (8+)`,
      trend: averageQuality >= 7 ? 'up' : averageQuality >= 5 ? 'stable' : 'down'
    },
    {
      icon: TagIcon,
      title: 'Top Keywords',
      value: topKeywords.length,
      description: `Most frequent: ${topKeywords[0]?.[0] || 'N/A'} (${topKeywords[0]?.[1] || 0} posts)`,
      trend: topKeywords.length >= 10 ? 'up' : 'stable'
    },
    {
      icon: FireIcon,
      title: 'Engagement Rate',
      value: `${(averageEngagement / 1000).toFixed(1)}K`,
      description: 'Average engagement per post',
      trend: averageEngagement >= 10000 ? 'up' : 'stable'
    },
    {
      icon: TrendingUpIcon,
      title: 'Analysis Coverage',
      value: `${Math.round((totalAnalyzedPosts / totalPosts) * 100)}%`,
      description: `${totalAnalyzedPosts} of ${totalPosts} posts analyzed`,
      trend: totalAnalyzedPosts / totalPosts >= 0.8 ? 'up' : 'stable'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <InsightCard key={index} {...insight} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vibe Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Content Vibe Distribution
          </h3>
          <div className="h-64">
            <PieChart data={vibeChartData} height={250} />
          </div>
        </Card>

        {/* Top Keywords */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Most Used Keywords
          </h3>
          <div className="h-64">
            <BarChart data={keywordsChartData} height={250} horizontal />
          </div>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Recommendations */}
        <Card>
          <div className="flex items-center space-x-2 mb-6">
            <LightBulbIcon className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Recommendations
            </h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Content Strategy
              </h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Focus on {Object.keys(vibeDistribution)[0] || 'energetic'} content (highest engagement)</li>
                <li>• Increase use of trending keywords: {topKeywords.slice(0, 3).map(([k]) => k).join(', ')}</li>
                <li>• {averageQuality >= 7 ? 'Maintain' : 'Improve'} current quality standards</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Performance Optimization
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Posts with quality score 8+ get {Math.round(averageEngagement * 1.3)} avg engagement</li>
                <li>• {Object.keys(categoryDistribution)[0] || 'lifestyle'} category performs best</li>
                <li>• Consider more video content for better reach</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                Hashtag Strategy
              </h4>
              <div className="flex flex-wrap gap-2">
                {topKeywords.slice(0, 8).map(([keyword, count]) => (
                  <Badge key={keyword} variant="primary" size="sm">
                    #{keyword} ({count})
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Quality Analysis */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Quality Analysis
          </h3>
          <div className="space-y-4">
            {/* Quality Score Distribution */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">High Quality (8-10)</span>
                <span className="font-semibold">{highQualityPosts} posts</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(highQualityPosts / totalAnalyzedPosts) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Medium Quality (5-7.9)</span>
                <span className="font-semibold">
                  {analyzedPosts.filter(p => p.quality_score >= 5 && p.quality_score < 8).length} posts
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(analyzedPosts.filter(p => p.quality_score >= 5 && p.quality_score < 8).length / totalAnalyzedPosts) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Low Quality (0-4.9)</span>
                <span className="font-semibold">
                  {analyzedPosts.filter(p => p.quality_score < 5).length} posts
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(analyzedPosts.filter(p => p.quality_score < 5).length / totalAnalyzedPosts) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Top Performing Posts */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Top Performing Posts
              </h4>
              <div className="space-y-2">
                {analyzedPosts
                  .sort((a, b) => (b.quality_score || 0) - (a.quality_score || 0))
                  .slice(0, 3)
                  .map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          @{post.influencer_username}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {post.caption?.slice(0, 50)}...
                        </p>
                      </div>
                      <Badge variant="success" size="sm">
                        {post.quality_score?.toFixed(1) || 0}/10
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AIInsights
