import React from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import ChartWrapper from './ChartWrapper'

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = ({ 
  data, 
  title, 
  isLoading, 
  error, 
  onRetry,
  height = 300 
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          generateLabels: (chart) => {
            const data = chart.data
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i]
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: data.datasets[0].borderWidth,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i,
                }
              })
            }
            return []
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const value = context.parsed
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: ${new Intl.NumberFormat().format(value)} (${percentage}%)`
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 2,
      },
    },
  }

  return (
    <ChartWrapper
      title={title}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
    >
      <div style={{ height }}>
        <Pie data={data} options={options} />
      </div>
    </ChartWrapper>
  )
}

export default PieChart
