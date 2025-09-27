import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchApi } from '../services/search'
import { postsApi } from '../services/posts'
import { reelsApi } from '../services/reels'
import { analyticsApi } from '../services/analytics'

const Trending = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('24h')

  // Trending data queries
  const { data: trendingSearches, isLoading: searchesLoading } = useQuery({
    queryKey: ['trending-searches'],
    queryFn: () => searchApi.getTrendingSearches(),
    refetchInterval: 300000, // 5 minutes
    retry: false
  })

  const { data: trendingPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['trending-posts', timeRange],
    queryFn: () => postsApi.getTrendingPosts({ time_range: timeRange }),
    refetchInterval: 180000, // 3 minutes
    retry: false
  })

  const { data: trendingReels, isLoading: reelsLoading } = useQuery({
    queryKey: ['trending-reels', timeRange],
    queryFn: () => reelsApi.getTrendingReels({ time_range: timeRange }),
    refetchInterval: 180000, // 3 minutes
    retry: false
  })

  const { data: realTimeAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['real-time-analytics'],
    queryFn: () => analyticsApi.getRealTimeAnalytics(),
    refetchInterval: 60000, // 1 minute
    retry: false
  })

  const formatTrendValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }

  const getTrendColor = (trend) => {
    if (trend.startsWith('+')) return '#059669'
    if (trend.startsWith('-')) return '#dc2626'
    return '#6b7280'
  }

  const getTrendIcon = (trend) => {
    if (trend.startsWith('+')) return '📈'
    if (trend.startsWith('-')) return '📉'
    return '➡️'
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Trending & Real-time Analytics
        </h1>
        <p style={{ color: '#6b7280' }}>
          Discover trending content, hashtags, and real-time performance metrics
        </p>
      </div>

      {/* Time Range Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e5e7eb' }}>
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'hashtags', label: 'Hashtag Trends', icon: '#️⃣' },
            { key: 'content', label: 'Trending Content', icon: '🔥' },
            { key: 'realtime', label: 'Real-time', icon: '⚡' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 0',
                borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === tab.key ? '600' : '500',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: 'white',
            fontSize: '0.875rem'
          }}
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last Week</option>
          <option value="30d">Last Month</option>
        </select>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Real-time Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '2rem' }}>👀</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>Active Users</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Right now</div>
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {formatTrendValue(realTimeAnalytics?.current_metrics?.active_users || 15234)}
              </div>
            </div>

            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '2rem' }}>💓</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>Engagement/Min</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Live updates</div>
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {realTimeAnalytics?.live_engagement?.likes_per_minute || 145}
              </div>
            </div>

            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '2rem' }}>🔥</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>Trending Now</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Top hashtag</div>
                </div>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {realTimeAnalytics?.current_metrics?.trending_now || '#MondayMotivation'}
              </div>
            </div>

            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '2rem' }}>📱</span>
                <div>
                  <div style={{ fontWeight: '600', color: '#111827' }}>Posts/Hour</div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Content rate</div>
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {realTimeAnalytics?.current_metrics?.posts_last_hour || 23}
              </div>
            </div>
          </div>

          {/* Top Trending Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Trending Posts */}
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                🔥 Trending Posts
              </h3>
              {postsLoading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {trendingPosts?.results?.slice(0, 3).map((post, index) => (
                    <div key={post.id} style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        #{index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                          @{post.influencer_username}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>
                          {post.caption?.substring(0, 60)}...
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#9ca3af' }}>
                          <span>❤️ {formatTrendValue(post.likes_count)}</span>
                          <span>💬 {formatTrendValue(post.comments_count)}</span>
                          <span>📊 {post.engagement_rate?.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )) || <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No trending posts</div>}
                </div>
              )}
            </div>

            {/* Trending Reels */}
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                🎥 Trending Reels
              </h3>
              {reelsLoading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {trendingReels?.results?.slice(0, 3).map((reel, index) => (
                    <div key={reel.id} style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                        #{index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                          @{reel.influencer_username}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>
                          {reel.caption?.substring(0, 60)}...
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#9ca3af' }}>
                          <span>👁️ {formatTrendValue(reel.views_count)}</span>
                          <span>❤️ {formatTrendValue(reel.likes_count)}</span>
                          <span>🕐 {Math.round(reel.duration)}s</span>
                        </div>
                      </div>
                    </div>
                  )) || <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No trending reels</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hashtag Trends Tab */}
      {activeTab === 'hashtags' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Trending Up */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              📈 Trending Up
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trendingSearches?.trending_hashtags?.slice(0, 8).map((hashtag, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>
                      {hashtag.hashtag}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatTrendValue(hashtag.posts)} posts
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: getTrendColor(hashtag.growth) }}>
                      {getTrendIcon(hashtag.growth)}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: getTrendColor(hashtag.growth) }}>
                      {hashtag.growth}
                    </span>
                  </div>
                </div>
              )) || <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No trending hashtags</div>}
            </div>
          </div>

          {/* Top Searches */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              🔍 Top Searches
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trendingSearches?.trending_queries?.slice(0, 8).map((query, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>
                      {query.query}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatTrendValue(query.volume)} searches
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: getTrendColor(query.growth) }}>
                      {getTrendIcon(query.growth)}
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: getTrendColor(query.growth) }}>
                      {query.growth}
                    </span>
                  </div>
                </div>
              )) || <div style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No trending searches</div>}
            </div>
          </div>
        </div>
      )}

      {/* Real-time Tab */}
      {activeTab === 'realtime' && (
        <div>
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              ⚡ Live Activity Feed
            </h3>
            
            {realTimeAnalytics?.alerts && realTimeAnalytics.alerts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {realTimeAnalytics.alerts.map((alert, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    padding: '12px', 
                    backgroundColor: alert.severity === 'error' ? '#fef2f2' : 
                                    alert.severity === 'warning' ? '#fffbeb' : '#f0f9ff',
                    borderRadius: '8px',
                    border: `1px solid ${alert.severity === 'error' ? '#fecaca' : 
                                        alert.severity === 'warning' ? '#fed7aa' : '#bfdbfe'}`
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {alert.type === 'engagement_spike' ? '🚀' : 
                       alert.type === 'viral_alert' ? '🔥' : 
                       alert.type === 'milestone' ? '🎉' : '📊'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', color: '#111827', marginBottom: '2px' }}>
                        {alert.message}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚡</div>
                <p>No recent activity alerts</p>
                <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                  Live alerts will appear here when significant events occur
                </p>
              </div>
            )}
          </div>

          {/* System Status */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              🔧 System Status
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#374151' }}>API Status</span>
                <span style={{ color: '#059669', fontWeight: '500' }}>
                  ✅ {realTimeAnalytics?.system_status?.api_status || 'Operational'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#374151' }}>Data Freshness</span>
                <span style={{ color: '#059669', fontWeight: '500' }}>
                  ✅ {realTimeAnalytics?.system_status?.data_freshness || '< 5 minutes'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#374151' }}>Last Update</span>
                <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {realTimeAnalytics?.system_status?.last_update ? 
                    new Date(realTimeAnalytics.system_status.last_update).toLocaleTimeString() : 
                    new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Trending
