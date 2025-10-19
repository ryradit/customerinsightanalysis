'use client'

import React from 'react'
import { AnalysisResult, BusinessRecommendation } from '@/types/analysis'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface AnalysisResultsProps {
  result: AnalysisResult
  onReset: () => void
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onReset }) => {
  const { analysis, processingTime } = result

  // Prepare chart data
  const sentimentChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          analysis.sentimentDistribution.positive,
          analysis.sentimentDistribution.neutral,
          analysis.sentimentDistribution.negative,
        ],
        backgroundColor: [
          '#10B981', // green
          '#6B7280', // gray
          '#EF4444', // red
        ],
        borderWidth: 0,
      },
    ],
  }

  const topicChartData = {
    labels: Object.keys(analysis.topicDistribution).map(key => 
      key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    ),
    datasets: [
      {
        label: 'Number of Mentions',
        data: Object.values(analysis.topicDistribution),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  const getPriorityBadgeClass = (priority: BusinessRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return 'badge-high'
      case 'medium':
        return 'badge-medium'
      case 'low':
        return 'badge-low'
      default:
        return 'badge-medium'
    }
  }

  const getCategoryIcon = (category: BusinessRecommendation['category']) => {
    switch (category) {
      case 'marketing':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        )
      case 'rnd':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      case 'operations':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'customer_service':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Results</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Total Feedback: {analysis.totalFeedback}</span>
              <span>Processing Time: {processingTime}</span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Analyze New File
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <div className="h-64">
            <Doughnut data={sentimentChartData} options={chartOptions} />
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Distribution</h3>
          <div className="h-64">
            <Bar data={topicChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Key Findings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Findings</h3>
        <ul className="space-y-2">
          {analysis.keyFindings.map((finding, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span className="text-gray-700">{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Business Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.businessRecommendations.map((rec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="text-primary-600 mr-2">
                    {getCategoryIcon(rec.category)}
                  </div>
                  <span className="font-medium text-gray-900 capitalize">
                    {rec.category.replace('_', ' ')}
                  </span>
                </div>
                <span className={`recommendation-badge ${getPriorityBadgeClass(rec.priority)}`}>
                  {rec.priority}
                </span>
              </div>
              
              <p className="text-gray-700 mb-3">{rec.recommendation}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Impact:</span>
                  <span className="text-gray-700">{rec.impact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Implementation Cost:</span>
                  <span className="text-gray-700 capitalize">{rec.implementationCost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Results</h3>
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              const jsonData = JSON.stringify(result, null, 2)
              const blob = new Blob([jsonData], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'consumer-insights-analysis.json'
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="bg-accent-600 hover:bg-accent-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Download JSON
          </button>
          <button 
            onClick={() => {
              window.print()
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnalysisResults