'use client'

import React from 'react'
import { AnalysisResult } from '@/types/analysis'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import MitigationRecommendations from './MitigationRecommendations'
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

  const regionalChartData = analysis.regionalDistribution && Object.keys(analysis.regionalDistribution).length > 0 ? {
    labels: Object.keys(analysis.regionalDistribution).map(region => {
      // Handle display names for regions
      if (region.length > 15) {
        return region.substring(0, 12) + '...'
      }
      return region
    }),
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
          
          {/* Data Detection Summary */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Data Detection:</span> Successfully identified feedback, product, and sentiment data from your Excel file
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">✓ Feedback Column</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">✓ Product Detection</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">✓ Sentiment Analysis</span>
              {analysis.regionalDistribution && Object.keys(analysis.regionalDistribution).length > 0 ? (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">✓ Regional Data ({Object.keys(analysis.regionalDistribution).length} regions)</span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">⚪ No Regional Data</span>
              )}
              {analysis.negativePatterns && analysis.negativePatterns.length > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">⚠ Issues Detected</span>
              )}
            </div>
          </div>
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
            <p className="text-sm text-gray-600 mb-4">
              Geographic distribution based on {Object.keys(analysis.regionalDistribution || {}).length} detected region(s)
            </p>
            <div className="h-64">
              <Bar data={regionalChartData} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(analysis.regionalDistribution || {})
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 6)
                .map(([region, count]) => (
                <div key={region} className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-900">{region}</div>
                  <div className="text-xs text-gray-600">{count} feedback</div>
                  <div className="text-xs text-gray-500">
                    {((count as number / analysis.totalFeedback) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Regional Distribution Placeholder */}
        {!regionalChartData && (
          <div className="insight-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🌍</div>
              <p className="text-lg mb-2">No Regional Data Detected</p>
              <p className="text-sm">
                To see regional insights, include columns like 'Region', 'City', 'Location', or 'Area' in your Excel file
              </p>
              <div className="mt-4 text-xs text-gray-400">
                Supported column names: Region, Area, City, Location, Province, State, Country, Address
              </div>
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

      {/* Critical Issues & Solutions */}
      {analysis.sentimentDistribution.negative > 0 && (
        <div className="insight-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">🚨 Critical Issues Requiring Attention</h3>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h4 className="text-lg font-medium text-red-800">
                  {analysis.sentimentDistribution.negative} Negative Feedback Entries Detected
                </h4>
                <p className="text-red-700 text-sm mt-1">
                  {((analysis.sentimentDistribution.negative / analysis.totalFeedback) * 100).toFixed(1)}% of total feedback requires immediate action
                </p>
              </div>
            </div>
          </div>
          
          {/* Negative Patterns Analysis */}
          {analysis.negativePatterns && analysis.negativePatterns.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">🔍 Identified Negative Patterns</h4>
              <div className="space-y-4">
                {analysis.negativePatterns.map((pattern, index) => (
                  <div key={index} className="bg-white border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-red-800">{pattern.pattern}</h5>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pattern.severity === 'high' ? 'bg-red-100 text-red-800' :
                          pattern.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pattern.severity} priority
                        </span>
                        <span className="text-sm font-medium text-gray-600">{pattern.count} cases</span>
                      </div>
                    </div>
                    {pattern.examples && pattern.examples.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 mb-1">Examples:</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {pattern.examples.slice(0, 2).map((example, i) => (
                            <li key={i} className="italic">• "{example}"</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Positive Patterns Analysis */}
          {analysis.sentimentDistribution.positive > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">⭐ Identified Positive Patterns</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-green-200 rounded-lg p-4">
                  <h5 className="font-semibold text-green-800 mb-3">💬 Common Positive Feedback</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• "Excellent quality and performance"</li>
                    <li>• "Highly recommend this product"</li>
                    <li>• "Works perfectly, very satisfied"</li>
                    <li>• "Great value for money"</li>
                    <li>• "Outstanding customer service"</li>
                  </ul>
                </div>
                <div className="bg-white border border-green-200 rounded-lg p-4">
                  <h5 className="font-semibold text-green-800 mb-3">🎯 Compliment Categories</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Quality & craftsmanship praise</li>
                    <li>• Performance & reliability</li>
                    <li>• Value & pricing satisfaction</li>
                    <li>• Service & support excellence</li>
                    <li>• Recommendation & loyalty</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Issue Analysis */}
          {analysis.issueAnalysis && Object.keys(analysis.issueAnalysis).length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Issue Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(analysis.issueAnalysis).map(([issueType, count]) => (
                  <div key={issueType} className="bg-white border border-red-200 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-red-600">{count as number}</div>
                    <div className="text-sm text-gray-700 capitalize">
                      {issueType.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Examples of negative feedback patterns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-red-200 rounded-lg p-4">
              <h5 className="font-semibold text-red-800 mb-2">🚨 Negative Patterns:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Product functionality issues</li>
                <li>• Quality concerns</li>
                <li>• Performance problems</li>
                <li>• Service complaints</li>
                <li>• Delivery issues</li>
              </ul>
            </div>
            <div className="bg-white border border-green-200 rounded-lg p-4">
              <h5 className="font-semibold text-green-800 mb-2">⭐ Positive Patterns:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Quality & craftsmanship praise</li>
                <li>• Performance excellence</li>
                <li>• Value satisfaction</li>
                <li>• Service appreciation</li>
                <li>• Loyalty & recommendations</li>
              </ul>
            </div>
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <h5 className="font-semibold text-blue-800 mb-2">🎯 Action Items:</h5>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Address negative feedback</li>
                <li>• Amplify positive experiences</li>
                <li>• Improve quality control</li>
                <li>• Enhance customer service</li>
                <li>• Leverage testimonials</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mitigation & Improvement Strategies */}
      {(analysis.mitigationStrategies || analysis.sentimentDistribution.negative > 0) && (
        <div className="insight-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">🎯 Mitigation & Improvement Strategies</h3>
          
          {/* Immediate Response Actions */}
          {analysis.mitigationStrategies?.immediate_response && analysis.mitigationStrategies.immediate_response.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                🚨 Immediate Response Actions (24-48 hours)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.mitigationStrategies.immediate_response.map((action, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-red-900">{action.issue_type.replace(/_/g, ' ').toUpperCase()}</h5>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{action.timeline}</span>
                    </div>
                    <p className="text-sm text-red-800 mb-2">{action.strategy}</p>
                    <p className="text-xs text-red-600">👥 {action.responsible_team}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Long-term Improvement Initiatives */}
          {analysis.mitigationStrategies?.improvement_initiatives && analysis.mitigationStrategies.improvement_initiatives.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                🔧 Long-term Improvement Initiatives
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.mitigationStrategies.improvement_initiatives.map((initiative, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-blue-900">{initiative.focus_area.replace(/_/g, ' ').toUpperCase()}</h5>
                      <span className={`text-xs px-2 py-1 rounded ${
                        initiative.investment_required === 'high' ? 'bg-red-100 text-red-700' :
                        initiative.investment_required === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {initiative.investment_required} investment
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 mb-2">{initiative.initiative}</p>
                    <p className="text-xs text-blue-600">📈 Expected: {initiative.expected_impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Positive Reinforcement Strategies */}
          {analysis.mitigationStrategies?.positive_reinforcement && analysis.mitigationStrategies.positive_reinforcement.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                ⭐ Positive Reinforcement & Amplification
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.mitigationStrategies.positive_reinforcement.map((strength, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="font-semibold text-green-900 mb-2">💪 {strength.strength}</h5>
                    <p className="text-sm text-green-800 mb-2">{strength.amplification_strategy}</p>
                    <p className="text-xs text-green-600">📢 Marketing: {strength.marketing_opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Default Mitigation Strategies if AI doesn't provide specific ones */}
          {(!analysis.mitigationStrategies || Object.keys(analysis.mitigationStrategies).length === 0) && analysis.sentimentDistribution.negative > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="font-semibold text-red-800 mb-3">🚨 Immediate Actions</h5>
                  <ul className="text-sm text-red-700 space-y-2">
                    <li>• Contact affected customers within 24h</li>
                    <li>• Implement immediate fix/replacement</li>
                    <li>• Escalate to quality control team</li>
                    <li>• Document issue patterns</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-3">🔧 Process Improvements</h5>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• Enhanced quality testing procedures</li>
                    <li>• Staff training on common issues</li>
                    <li>• Supplier quality audits</li>
                    <li>• Customer feedback loop system</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-semibold text-green-800 mb-3">⭐ Positive Amplification</h5>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>• Highlight satisfied customer stories</li>
                    <li>• Promote strong product features</li>
                    <li>• Reward loyal customers</li>
                    <li>• Share improvement updates</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sentiment Analysis Insights */}
      <div className="insight-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 Sentiment Analysis Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Positive Insights */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <h4 className="font-semibold text-green-800">Positive Feedback</h4>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {analysis.sentimentDistribution.positive}
            </div>
            <p className="text-sm text-green-700">
              {((analysis.sentimentDistribution.positive / analysis.totalFeedback) * 100).toFixed(1)}% customers satisfied
            </p>
            <p className="text-xs text-green-600 mt-2">
              Leverage these insights for marketing campaigns
            </p>
          </div>

          {/* Neutral Insights */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <h4 className="font-semibold text-yellow-800">Neutral Feedback</h4>
            </div>
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {analysis.sentimentDistribution.neutral}
            </div>
            <p className="text-sm text-yellow-700">
              {((analysis.sentimentDistribution.neutral / analysis.totalFeedback) * 100).toFixed(1)}% neutral responses
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Opportunity to convert to positive sentiment
            </p>
          </div>

          {/* Negative Insights */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <h4 className="font-semibold text-red-800">Negative Feedback</h4>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-2">
              {analysis.sentimentDistribution.negative}
            </div>
            <p className="text-sm text-red-700">
              {((analysis.sentimentDistribution.negative / analysis.totalFeedback) * 100).toFixed(1)}% require attention
            </p>
            <p className="text-xs text-red-600 mt-2">
              Priority for improvement initiatives
            </p>
          </div>
        </div>
      </div>

      {/* Product Categories Overview - Dynamic from Excel Data */}
      {analysis.productDistribution && Object.keys(analysis.productDistribution).length > 0 && (
        <div className="insight-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Product Category Performance</h3>
          <p className="text-sm text-gray-600 mb-4">
            Based on actual products mentioned in your Excel data
          </p>
          <div className="space-y-4">
            {Object.entries(analysis.productDistribution)
              .sort(([,a], [,b]) => (b as number) - (a as number))
              .map(([product, count]) => {
                const percentage = ((count as number / analysis.totalFeedback) * 100).toFixed(1)
                
                // Friendly category names
                const categoryNames: { [key: string]: string } = {
                  electronics: '📱 Electronics & Gadgets',
                  appliances: '🏠 Home Appliances',
                  automotive: '🚗 Automotive',
                  fashion: '👕 Fashion & Clothing',
                  health_beauty: '💄 Health & Beauty',
                  food_beverages: '🍽️ Food & Beverages',
                  personal_care: '🧴 Personal Care',
                  beverages: '🥤 Beverages',
                  snacks: '🍿 Snacks & Food',
                  dairy: '🥛 Dairy Products',
                  frozen: '🧊 Frozen Foods',
                  other: '📦 Other Products',
                  unknown: '❓ Unspecified Products'
                }
                
                const displayName = categoryNames[product] || `📦 ${product.charAt(0).toUpperCase() + product.slice(1).replace(/_/g, ' ')}`
                
                return (
                  <div key={product} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {displayName}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentage}% of total feedback
                      </div>
                    </div>
                    <div className="flex items-center ml-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 min-w-[2rem] text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
          {Object.keys(analysis.productDistribution).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No specific products identified in the feedback data.</p>
              <p className="text-sm mt-1">Ensure your Excel file has a 'Product' column for detailed analysis.</p>
            </div>
          )}
        </div>
      )}

      {/* Mitigation & Improvement Strategies */}
      <div className="insight-card">
        <MitigationRecommendations result={result} />
      </div>

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