import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams, Link } from 'react-router-dom'
import { searchApi } from '../services/search'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState({
    content_type: searchParams.get('type') || 'all',
    category: searchParams.get('category') || 'all',
    date_range: searchParams.get('date') || '30d',
    engagement_min: searchParams.get('engagement') || '',
    follower_min: searchParams.get('followers') || ''
  })
  const [activeTab, setActiveTab] = useState('all')

  // Search results
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => searchApi.globalSearch(query, filters),
    enabled: query.length > 2,
    retry: false
  })

  // Search suggestions
  const { data: suggestions } = useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => searchApi.getSearchSuggestions(query),
    enabled: query.length > 0 && query.length < 3,
    retry: false
  })

  // Available filters
  const { data: availableFilters } = useQuery({
    queryKey: ['search-filters'],
    queryFn: () => searchApi.getSearchFilters(),
    retry: false
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      const params = new URLSearchParams({ q: query })
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.set(key, filters[key])
        }
      })
      setSearchParams(params)
    }
  }

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getResultsCount = () => {
    if (!searchResults) return 0
    return searchResults.total_results || 0
  }

  const getTabCount = (type) => {
    if (!searchResults?.results) return 0
    switch (type) {
      case 'influencers': return searchResults.results.influencers?.count || 0
      case 'posts': return searchResults.results.posts?.count || 0
      case 'reels': return searchResults.results.reels?.count || 0
      default: return getResultsCount()
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Search Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Search Instagram Analytics
        </h1>
        <p style={{ color: '#6b7280' }}>
          Find influencers, posts, and reels with advanced filtering
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '32px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for influencers, posts, hashtags..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            🔍 Search
          </button>
        </div>

        {/* Advanced Filters */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '16px',
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Content Type
            </label>
            <select
              value={filters.content_type}
              onChange={(e) => updateFilter('content_type', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Content</option>
              <option value="posts">Posts</option>
              <option value="reels">Reels</option>
              <option value="influencers">Influencers</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Categories</option>
              <option value="fitness">Fitness</option>
              <option value="technology">Technology</option>
              <option value="travel">Travel</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="food">Food</option>
              <option value="fashion">Fashion</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Time Period
            </label>
            <select
              value={filters.date_range}
              onChange={(e) => updateFilter('date_range', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white'
              }}
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last week</option>
              <option value="30d">Last month</option>
              <option value="90d">Last 3 months</option>
              <option value="365d">Last year</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Min Engagement
            </label>
            <input
              type="number"
              value={filters.engagement_min}
              onChange={(e) => updateFilter('engagement_min', e.target.value)}
              placeholder="e.g. 5"
              min="0"
              max="100"
              step="0.1"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white'
              }}
            />
          </div>
        </div>
      </form>

      {/* Search Suggestions */}
      {suggestions && suggestions.suggestions && suggestions.suggestions.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
            Search Suggestions
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestions.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb'
                  e.target.style.borderColor = '#9ca3af'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6'
                  e.target.style.borderColor = '#d1d5db'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <p style={{ color: '#6b7280' }}>Searching...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '8px', 
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#dc2626', marginBottom: '8px' }}>⚠️ Search Error</div>
          <p style={{ color: '#7f1d1d' }}>Failed to search. Please try again.</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults && !isLoading && (
        <div>
          {/* Results Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
              Search Results for "{query}" ({getResultsCount()} found)
            </h2>
          </div>

          {/* Result Tabs */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e5e7eb' }}>
              {[
                { key: 'all', label: 'All Results' },
                { key: 'influencers', label: 'Influencers' },
                { key: 'posts', label: 'Posts' },
                { key: 'reels', label: 'Reels' }
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
                    fontSize: '0.875rem'
                  }}
                >
                  {tab.label} ({getTabCount(tab.key)})
                </button>
              ))}
            </div>
          </div>

          {/* Results Content */}
          <div>
            {(activeTab === 'all' || activeTab === 'influencers') && searchResults.results.influencers?.results?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                  📱 Influencers ({searchResults.results.influencers.count})
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '16px' 
                }}>
                  {searchResults.results.influencers.results.slice(0, activeTab === 'influencers' ? 20 : 6).map(influencer => (
                    <Link
                      key={influencer.id}
                      to={`/dashboard/influencer/${influencer.username}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{ 
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '16px',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <div style={{ 
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.25rem'
                          }}>
                            {influencer.full_name?.[0] || influencer.username[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', color: '#111827' }}>@{influencer.username}</div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              {influencer.followers_count?.toLocaleString()} followers
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '8px' }}>
                          {influencer.bio?.substring(0, 80)}...
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ 
                            backgroundColor: influencer.category === 'fitness' ? '#dcfce7' : 
                                           influencer.category === 'technology' ? '#dbeafe' : '#fef3c7',
                            color: influencer.category === 'fitness' ? '#166534' : 
                                   influencer.category === 'technology' ? '#1d4ed8' : '#92400e',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {influencer.category}
                          </span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#059669' }}>
                            {influencer.engagement_rate?.toFixed(1)}% engagement
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'posts') && searchResults.results.posts?.results?.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                  📸 Posts ({searchResults.results.posts.count})
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '16px' 
                }}>
                  {searchResults.results.posts.results.slice(0, activeTab === 'posts' ? 20 : 6).map(post => (
                    <div key={post.id} style={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ 
                        aspectRatio: '1',
                        background: 'linear-gradient(135deg, #e0e7ff, #fce7f3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem'
                      }}>
                        📸
                      </div>
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                            @{post.influencer_username}
                          </span>
                          <span style={{ 
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '0.75rem'
                          }}>
                            {post.vibe_classification}
                          </span>
                        </div>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          color: '#374151',
                          lineHeight: '1.4',
                          marginBottom: '12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {post.caption}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                          <span>❤️ {post.likes_count?.toLocaleString()}</span>
                          <span>💬 {post.comments_count}</span>
                          <span>⭐ {post.quality_score}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'reels') && searchResults.results.reels?.results?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                  🎥 Reels ({searchResults.results.reels.count})
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '16px' 
                }}>
                  {searchResults.results.reels.results.slice(0, activeTab === 'reels' ? 20 : 6).map(reel => (
                    <div key={reel.id} style={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        aspectRatio: '9/16',
                        background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        position: 'relative'
                      }}>
                        🎥
                        <div style={{ 
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem'
                        }}>
                          {Math.round(reel.duration)}s
                        </div>
                      </div>
                      <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                            @{reel.influencer_username}
                          </span>
                        </div>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          color: '#374151',
                          lineHeight: '1.4',
                          marginBottom: '12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {reel.caption}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
                          <span>👁️ {reel.views_count?.toLocaleString()}</span>
                          <span>❤️ {reel.likes_count?.toLocaleString()}</span>
                          <span>📊 {reel.engagement_rate?.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* No Results */}
          {getResultsCount() === 0 && (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                No results found
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                Try adjusting your search terms or filters
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                {['fitness', 'technology', 'travel', 'lifestyle'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Try "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
