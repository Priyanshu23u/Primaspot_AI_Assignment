import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import Button from './Button'

const ErrorMessage = ({ 
  title = 'Something went wrong',
  message = 'An error occurred while loading the data.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="mx-auto w-12 h-12 text-red-500 mb-4">
        <ExclamationTriangleIcon />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </div>
  )
}

export default ErrorMessage
