import React from 'react'
import { Link } from 'react-router-dom'
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  SparklesIcon,
  CheckBadgeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Card from '../common/UI/Card'
import Badge from '../common/UI/Badge'
import Button from '../common/UI/Button'
import { formatDistanceToNow } from 'date-fns'

const PostCard = ({ post, onAnalyze, onViewDetails }) => {
  const engagementRate = post.engagement_rate || 0
  const qualityScore = post.quality_score || 0
  const keywords = Array.isArray(post.keywords) ? post.keywords : 
                   (post.keywords ? JSON.parse(post.keywords) : [])

  const getVibeColor = (vibe) => {
    const vibeColors = {
      'energetic': 'danger',
      'casual': 'primary',
      'aesthetic': 'warning',
      'professional': 'info',
      'motivational': 'success',
      'funny': 'warning',
    }
    return vibeColors[vibe] || 'default'
  }

  const getQualityColor = (score) => {
    if (score >= 8) return 'success'
    if (score >= 6) return 'warning'
    if (score >= 4) return 'info'
    return 'danger'
  }

  return (
    <Card className="overflow-hidden hover:shadow-elevated transition-shadow">
      {/* Image */}
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={`Post by @${post.influencer_username}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-4xl">📸</span>
          </div>
        </div>

        {/* AI Analysis Badge */}
        {post.is_analyzed && (
          <div className="absolute top-3 right-3">
            <Badge variant="success" size="sm" className="flex items-center">
              <SparklesIcon className="w-3 h-3 mr-1" />
              AI Analyzed
            </Badge>
          </div>
        )}

        {/* Quality Score */}
        {qualityScore > 0 && (
          <div className="absolute top-3 left-3">
            <Badge variant={getQualityColor(qualityScore)} size="sm">
              {qualityScore.toFixed(1)}/10
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Link
            to={`/app/influencers/${post.influencer_id}`}
            className="flex items-center space-x-2 hover:text-primary-600"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {post.influencer_username?.[0]?.toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              @{post.influencer_username}
            </span>
            {post.influencer_verified && (
              <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
            )}
          </Link>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {post.caption}
          </p>
        )}

        {/* Keywords */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {keywords.slice(0, 3).map((keyword, index) => (
              <Badge key={index} variant="default" size="sm">
                {keyword}
              </Badge>
            ))}
            {keywords.length > 3 && (
              <Badge variant="default" size="sm">
                +{keywords.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Vibe */}
        {post.vibe_classification && (
          <div className="flex items-center space-x-2">
            <Badge variant={getVibeColor(post.vibe_classification)} size="sm">
              {post.vibe_classification}
            </Badge>
            {post.category && (
              <Badge variant="default" size="sm">
                {post.category}
              </Badge>
            )}
          </div>
        )}

        {/* Metrics */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <HeartSolidIcon className="w-4 h-4 text-red-500" />
              <span>{post.likes_count?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span>{post.comments_count?.toLocaleString() || 0}</span>
            </div>
            <div className={`font-medium ${
              engagementRate >= 3 ? 'text-green-600' :
              engagementRate >= 1 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {engagementRate.toFixed(2)}%
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <CalendarIcon className="w-3 h-3" />
            <span>
              {post.post_date ? formatDistanceToNow(new Date(post.post_date), { addSuffix: true }) : 'Unknown'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(post)}
            className="flex-1"
          >
            View Details
          </Button>
          {!post.is_analyzed && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAnalyze(post)}
            >
              <SparklesIcon className="w-4 h-4 mr-1" />
              Analyze
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default PostCard
