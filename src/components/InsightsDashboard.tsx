'use client'

import React from 'react'
import { AnalysisResult } from '@/types/analysis'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

interface InsightsDashboardProps {
  result: AnalysisResult
  onReset: () => void
}

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ result, onReset }) => {
  const { analysis, processingTime } = result

  // Chart configurations
  const sentimentChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          analysis.sentimentDistribution.positive,
          analysis.sentimentDistribution.neutral,
          analysis.sentimentDistribution.negative,
        ],
        backgroundColor: ['#10B981', '#6B7280', '#EF4444'],
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
        label: 'Mentions',
        data: Object.values(analysis.topicDistribution),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  }

  const regionalChartData = analysis.regionalDistribution ? {
    labels: Object.keys(analysis.regionalDistribution),
    datasets: [
      {
        label: 'Feedback Count',
        data: Object.values(analysis.regionalDistribution),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: '#16A34A',
        borderWidth: 1,
      },
    ],
  } : null

  const trendChartData = analysis.timeSeriesData ? {
    labels: analysis.timeSeriesData.map(d => d.date),
    datasets: [
      {
        label: 'Positive',
        data: analysis.timeSeriesData.map(d => d.positive),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      },
      {
        label: 'Neutral',
        data: analysis.timeSeriesData.map(d => d.neutral),
        borderColor: '#6B7280',
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
      },
      {
        label: 'Negative',
        data: analysis.timeSeriesData.map(d => d.negative),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      },
    ],
  } : null

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Consumer Insights Dashboard</h2>
          <p className="text-gray-600 mt-2">
            AI-powered analysis of {analysis.totalFeedback} consumer feedback entries
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Processing Time</p>
            <p className="text-lg font-semibold text-blue-600">{processingTime}</p>
          </div>
          <button
            onClick={onReset}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="insight-card text-center">
          <div className="text-3xl font-bold text-blue-600">{analysis.totalFeedback}</div>
          <div className="text-sm text-gray-600 mt-1">Total Feedback</div>
        </div>
        <div className="insight-card text-center">
          <div className="text-3xl font-bold text-green-600">
            {((analysis.sentimentDistribution.positive / analysis.totalFeedback) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Positive Sentiment</div>
        </div>
        <div className="insight-card text-center">
          <div className="text-3xl font-bold text-purple-600">
            {Object.keys(analysis.topicDistribution).length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Topics Identified</div>
        </div>
        <div className="insight-card text-center">
          <div className="text-3xl font-bold text-orange-600">
            {analysis.businessRecommendations.filter(r => r.priority === 'high').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">High Priority Actions</div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="insight-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🤖 AI-Generated Summary</h3>
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-gray-800 leading-relaxed">
            {analysis.aiSummary || "Based on the analysis of consumer feedback, several key trends emerge. Product quality and taste are the most discussed topics, with generally positive sentiment. Price sensitivity shows regional variations, while packaging feedback indicates opportunities for improvement. Customer service interactions demonstrate strong satisfaction levels across all regions."}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Distribution */}
        <div className="insight-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
          <div className="h-64">
            <Doughnut data={sentimentChartData} options={chartOptions} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm font-medium text-green-600">Positive</div>
              <div className="text-lg font-bold">{analysis.sentimentDistribution.positive}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600">Neutral</div>
              <div className="text-lg font-bold">{analysis.sentimentDistribution.neutral}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-red-600">Negative</div>
              <div className="text-lg font-bold">{analysis.sentimentDistribution.negative}</div>
            </div>
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="insight-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Analysis</h3>
          <div className="h-64">
            <Bar data={topicChartData} options={chartOptions} />
          </div>
        </div>

        {/* Regional Distribution */}
        {regionalChartData && (
          <div className="insight-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
            <div className="h-64">
              <Bar data={regionalChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Trend Analysis */}
        {trendChartData && (
          <div className="insight-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trends Over Time</h3>
            <div className="h-64">
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Key Findings */}
      <div className="insight-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">🔍 Key Findings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.keyFindings.map((finding, index) => (
            <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
              <span className="inline-block w-6 h-6 bg-blue-500 text-white rounded-full text-center text-sm font-bold mr-3 mt-0.5">
                {index + 1}
              </span>
              <p className="text-gray-700 leading-relaxed">{finding}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Categories Overview */}
      {analysis.productDistribution && (
        <div className="insight-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Product Category Performance</h3>
          <div className="space-y-4">
            {Object.entries(analysis.productDistribution).map(([product, count]) => (
              <div key={product} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900 capitalize">
                  {product.replace('_', ' ')}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / analysis.totalFeedback) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="insight-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Dashboard</h3>
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              const jsonData = JSON.stringify(result, null, 2)
              const blob = new Blob([jsonData], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'akasha-consumer-insights.json'
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            📊 Export JSON Data
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            🖨️ Print Dashboard
          </button>
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            📧 Share Insights
          </button>
        </div>
      </div>
    </div>
  )
}

export default InsightsDashboard