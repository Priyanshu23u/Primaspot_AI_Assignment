import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { influencersApi } from '../services/influencers'
import { postsApi } from '../services/posts'
import { reelsApi } from '../services/reels'
import { demographicsApi } from '../services/demographics'

const InfluencerProfile = () => {
  const { username } = useParams()

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

  // Fetch influencer data
  const { data: influencer, isLoading } = useQuery({
    queryKey: ['influencer', username],
    queryFn: () => influencersApi.getInfluencerByUsername(username),
    enabled: !!username,
    retry: false
  })

  const { data: posts } = useQuery({
    queryKey: ['posts', influencer?.id],
    queryFn: () => postsApi.getPostsByInfluencer(influencer.id),
    enabled: !!influencer?.id,
    retry: false
  })

  const { data: reels } = useQuery({
    queryKey: ['reels', influencer?.id],
    queryFn: () => reelsApi.getReelsByInfluencer(influencer.id),
    enabled: !!influencer?.id,
    retry: false
  })

  const { data: demographics } = useQuery({
    queryKey: ['demographics', influencer?.id],
    queryFn: () => demographicsApi.getInfluencerDemographics(influencer.id),
    enabled: !!influencer?.id,
    retry: false
  })

  if (isLoading) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
          <p style={{ color: '#6b7280' }}>Loading influencer profile...</p>
        </div>
      </div>
    )
  }

  if (!influencer) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👤</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
            Influencer not found
          </h3>
          <p style={{ color: '#6b7280' }}>
            The influencer "{username}" doesn't exist in our database.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1536px', margin: '0 auto' }}>
      {/* Profile Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        border: '1px solid #e5e7eb',
        padding: '32px',
        marginBottom: '32px'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          alignItems: window.innerWidth < 768 ? 'center' : 'flex-start',
          gap: '32px',
          textAlign: window.innerWidth < 768 ? 'center' : 'left'
        }}>
          {/* Profile Picture */}
          <div style={{ 
            width: '128px', 
            height: '128px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white', 
            fontSize: '3rem', 
            fontWeight: 'bold',
            border: '4px solid white',
            boxShadow: '0 0 0 2px #e5e7eb'
          }}>
            {influencer.full_name?.[0] || influencer.username?.[0]?.toUpperCase() || '?'}
          </div>
          
          {/* Profile Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                @{influencer.username || 'unknown'}
              </h1>
              {influencer.is_verified && (
                <div style={{ color: '#3b82f6', fontSize: '1.5rem' }}>✓</div>
              )}
            </div>
            
            {influencer.full_name && (
              <h2 style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '16px' }}>
                {influencer.full_name}
              </h2>
            )}
            
            {influencer.bio && (
              <p style={{ color: '#6b7280', marginBottom: '24px', maxWidth: '512px' }}>
                {influencer.bio}
              </p>
            )}
            
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                  {formatNumber(influencer.posts_count)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Posts</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                  {formatNumber(influencer.followers_count)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Followers</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                  {formatNumber(influencer.following_count)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '2rem' }}>📊</div>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: '500',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              padding: '4px 8px',
              borderRadius: '9999px'
            }}>High</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
            {safeNumber(influencer.engagement_rate, 1)}%
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Engagement Rate</div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '2rem' }}>📸</div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
            {posts?.count || '0'}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Posts</div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '2rem' }}>🎥</div>
            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
            {reels?.count || '0'}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Reels</div>
        </div>
      </div>

      {/* Success Message */}
      <div style={{ 
        backgroundColor: '#d1fae5', 
        border: '1px solid #a7f3d0',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        color: '#065f46',
        marginBottom: '32px'
      }}>
        🎉 <strong>Profile loaded successfully!</strong> 
        Showing data for <strong>@{influencer.username}</strong>
      </div>

      {/* Posts Preview */}
      {posts?.results && posts.results.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
          border: '1px solid #e5e7eb',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
            Recent Posts ({posts.count})
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {posts.results.slice(0, 6).map((post, index) => (
              <div key={post.id || index} style={{ 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, #e0e7ff, #fce7f3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ fontSize: '2rem' }}>📸</div>
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>
                    ❤️ {formatNumber(post.likes_count)} • 💬 {formatNumber(post.comments_count)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '500' }}>
                    Quality: {safeNumber(post.quality_score, 1)}/10
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default InfluencerProfile
