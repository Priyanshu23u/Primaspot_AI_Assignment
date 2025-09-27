import React from 'react'
import { PieChart } from '../common/Charts/PieChart'
import Card from '../common/UI/Card'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import ErrorMessage from '../common/UI/ErrorMessage'

const AgeDistribution = ({ data, isLoading, error, onRetry }) => {
  if (isLoading) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading age distribution..." />
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-96">
        <ErrorMessage
          title="Age Distribution Error"
          message="Failed to load age distribution data"
          onRetry={onRetry}
        />
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No age distribution data available
        </p>
      </Card>
    )
  }

  // Prepare chart data
  const chartData = {
    labels: ['13-17', '18-24', '25-34', '35-44', '45-54', '55+'],
    datasets: [
      {
        data: [
          data.age_13_17 || 0,
          data.age_18_24 || 0,
          data.age_25_34 || 0,
          data.age_35_44 || 0,
          data.age_45_54 || 0,
          data.age_55_plus || 0,
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 2,
      },
    ],
  }

  // Find dominant age group
  const ageGroups = {
    'age_13_17': { label: '13-17', value: data.age_13_17 || 0 },
    'age_18_24': { label: '18-24', value: data.age_18_24 || 0 },
    'age_25_34': { label: '25-34', value: data.age_25_34 || 0 },
    'age_35_44': { label: '35-44', value: data.age_35_44 || 0 },
    'age_45_54': { label: '45-54', value: data.age_45_54 || 0 },
    'age_55_plus': { label: '55+', value: data.age_55_plus || 0 },
  }

  const dominantGroup = Object.values(ageGroups).reduce((max, group) =>
    group.value > max.value ? group : max
  )

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Age Distribution
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Dominant Group
          </div>
          <div className="text-lg font-semibold text-primary-600">
            {dominantGroup.label} ({dominantGroup.value.toFixed(1)}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-64">
          <PieChart data={chartData} height={250} />
        </div>

        {/* Statistics */}
        <div className="space-y-3">
          {Object.values(ageGroups).map((group, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                ></div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {group.label} years
                </span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {group.value.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(group.value * (data.total_audience || 1000) / 100).toLocaleString()} people
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Key Insights
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Primary audience is {dominantGroup.label} years old ({dominantGroup.value.toFixed(1)}%)</li>
          <li>• {(ageGroups.age_18_24.value + ageGroups.age_25_34.value).toFixed(1)}% of audience is in the 18-34 prime demographic</li>
          <li>• {(ageGroups.age_13_17.value + ageGroups.age_18_24.value).toFixed(1)}% represents Gen Z audience</li>
        </ul>
      </div>

      {data.confidence_score && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Confidence Score: {data.confidence_score.toFixed(1)}/10 • Based on {data.data_points_used || 0} data points
        </div>
      )}
    </Card>
  )
}

export default AgeDistribution
