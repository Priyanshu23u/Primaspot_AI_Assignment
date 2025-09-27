import React from 'react'
import { Chart as ChartJS } from 'chart.js/auto'
import Card from '../UI/Card'
import LoadingSpinner from '../UI/LoadingSpinner'
import ErrorMessage from '../UI/ErrorMessage'

const ChartWrapper = ({ 
  title, 
  children, 
  isLoading, 
  error, 
  onRetry,
  actions = null 
}) => {
  if (isLoading) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading chart..." />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-96">
        <ErrorMessage
          title="Chart Error"
          message="Failed to load chart data"
          onRetry={onRetry}
        />
      </Card>
    )
  }

  return (
    <Card>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {actions}
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </Card>
  )
}

export default ChartWrapper
