import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { influencersApi } from '../services/influencers'
import { postsApi } from '../services/posts'
import { reelsApi } from '../services/reels'

const Dashboard = () => {
  console.log('Dashboard component is rendering')

  // Helper function to safely format numbers
  const safeNumber = (value, decimals = 0) => {
    if (value === null || value === undefined || value === '') return '0'
    const num = parseFloat(value)
    return isNaN(num) ? '0' : decimals > 0 ? num.toFixed(decimals) : num.toString()
  }

  // Helper function to safely format large numbers
  const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') return '0'
    const num = parseInt(value)
    return isNaN(num) ? '0' : num.toLocaleString()
  }

  // Fetch data with error handling
  const { data: influencers, isLoading: influencersLoading, error: influencersError } = useQuery({
    queryKey: ['influencers'],
    queryFn: () => influencersApi.getInfluencers({ limit: 10 }),
    retry: false
  })

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsApi.getPosts({ limit: 6 }),
    retry: false
  })

  const { data: reels, isLoading: reelsLoading } = useQuery({
    queryKey: ['reels'],
    queryFn: () => reelsApi.getReels({ limit: 6 }),
    retry: false
  })

  const stats = [
    {
      label: 'Total Influencers',
      value: influencers?.count || '3',
      icon: '👥',
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      label: 'Total Posts',
      value: posts?.count || '9',
      icon: '📸',
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      label: 'Total Reels',
      value: reels?.count || '2',
      icon: '🎥',
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      label: 'Avg Engagement',
      value: '4.2%',
      icon: '📊',
      color: 'bg-pink-500',
      change: '+3%'
    }
  ]

  // Debug logging
  if (influencers?.results) {
    console.log('Influencer data:', influencers.results[0])
  }

  if (influencersLoading || postsLoading || reelsLoading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Show error message if data loading failed
  if (influencersError) {
    console.error('Error loading influencers:', influencersError)
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Dashboard Overview
        </h1>
        <p style={{ color: '#6b7280' }}>
          Welcome back! Here's what's happening with your Instagram analytics.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '24px',
        marginBottom: '32px' 
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
            border: '1px solid #e5e7eb',
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '24px'
              }} className={stat.color}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>{stat.change}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        {/* Top Influencers */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Top Influencers</h2>
              <Link to="/dashboard/analytics" style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}>
                View All
              </Link>
            </div>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {influencers?.results ? (
                influencers.results.slice(0, 5).map((influencer, index) => (
                  <Link
                    key={influencer.id || index}
                    to={`/dashboard/influencer/${influencer.username}`}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '12px', 
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white', 
                        fontWeight: 'bold' 
                      }}>
                        {influencer.full_name?.[0] || influencer.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', color: '#111827' }}>
                          @{influencer.username || 'unknown'}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {formatNumber(influencer.followers_count)} followers
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                      {safeNumber(influencer.engagement_rate, 1)}%
                    </div>
                  </Link>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                  No influencers data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Recent Posts</h2>
              <Link to="/dashboard/analytics" style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}>
                View All
              </Link>
            </div>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {posts?.results ? (
                posts.results.slice(0, 4).map((post, index) => (
                  <div key={post.id || index} style={{ cursor: 'pointer' }}>
                    <div style={{ 
                      aspectRatio: '1',
                      background: 'linear-gradient(135deg, #e0e7ff, #fce7f3)',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem'
                    }}>
                      📸
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.caption ? `${post.caption.substring(0, 50)}...` : 'No caption'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                      <span>{formatNumber(post.likes_count)} likes</span>
                      <span>{safeNumber(post.quality_score, 1)}/10</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                  No posts data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reels */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Recent Reels</h2>
            <Link to="/dashboard/analytics" style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: '500', textDecoration: 'none' }}>
              View All
            </Link>
          </div>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {reels?.results ? (
              reels.results.slice(0, 3).map((reel, index) => (
                <div key={reel.id || index} style={{ cursor: 'pointer' }}>
                  <div style={{ 
                    aspectRatio: '9/16', 
                    background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ fontSize: '3rem' }}>🎥</div>
                    <div style={{ 
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {safeNumber(reel.duration)}s
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {reel.caption ? `${reel.caption.substring(0, 40)}...` : 'No caption'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>👁️ {formatNumber(reel.views_count)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>❤️ {formatNumber(reel.likes_count)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px', color: '#6b7280' }}>
                No reels data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Debug Info (Remove in production) */}
      <div style={{ 
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #0284c7',
        borderRadius: '8px',
        fontSize: '0.875rem'
      }}>
        <strong>Debug Info:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Influencers loaded: {influencers?.results?.length || 0}</li>
          <li>Posts loaded: {posts?.results?.length || 0}</li>
          <li>Reels loaded: {reels?.results?.length || 0}</li>
          <li>Loading states: {[influencersLoading, postsLoading, reelsLoading].filter(Boolean).length} active</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
