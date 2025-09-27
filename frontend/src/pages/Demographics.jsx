import React from 'react'
import Card from '../components/common/UI/Card'

const Demographics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Demographics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Audience demographics and insights
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Demographics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Demographics visualization will be implemented here.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Demographics
