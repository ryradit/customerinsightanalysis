'use client'

import React, { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { AnalysisResult, BusinessRecommendation, WhatIfScenario } from '@/types/analysis'

interface RecommendationsActionsProps {
  result: AnalysisResult
}

const RecommendationsActions: React.FC<RecommendationsActionsProps> = ({ result }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [whatIfQuestion, setWhatIfQuestion] = useState('')
  const [whatIfScenarios, setWhatIfScenarios] = useState<WhatIfScenario[]>([])
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false)
  const [showReportGenerator, setShowReportGenerator] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const departmentIcons = {
    marketing: '📢',
    rnd: '🔬',
    operations: '⚙️',
    customer_service: '🎧',
    product_development: '💡'
  }

  const departmentColors = {
    marketing: 'from-pink-500 to-purple-600',
    rnd: 'from-blue-500 to-cyan-600',
    operations: 'from-green-500 to-teal-600',
    customer_service: 'from-yellow-500 to-orange-600',
    product_development: 'from-indigo-500 to-purple-600'
  }

  const filteredRecommendations = selectedDepartment === 'all' 
    ? result.analysis.businessRecommendations
    : result.analysis.businessRecommendations.filter(rec => rec.category === selectedDepartment)

  const recommendationsByDepartment = result.analysis.businessRecommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) acc[rec.category] = []
    acc[rec.category].push(rec)
    return acc
  }, {} as Record<string, BusinessRecommendation[]>)

  const handleWhatIfSubmit = async () => {
    if (!whatIfQuestion.trim()) return

    setIsGeneratingScenario(true)
    
    // Simulate AI processing for What-If scenario
    setTimeout(() => {
      const newScenario: WhatIfScenario = {
        id: Date.now().toString(),
        question: whatIfQuestion,
        scenario: whatIfQuestion,
        projectedImpact: {
          sentimentChange: Math.random() * 20 - 10, // -10 to +10
          topicShifts: {
            price: Math.random() * 10 - 5,
            quality: Math.random() * 10 - 5,
            taste: Math.random() * 10 - 5,
          },
          recommendation: `Based on this scenario, we project moderate impact on consumer sentiment. Recommend monitoring key metrics for 2-3 months to validate assumptions.`
        }
      }
      
      setWhatIfScenarios([newScenario, ...whatIfScenarios])
      setWhatIfQuestion('')
      setIsGeneratingScenario(false)
    }, 2000)
  }

  const generateComprehensivePDFReport = async () => {
    setIsGeneratingPDF(true)
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.width
    const pageHeight = pdf.internal.pageSize.height
    let yPosition = 20

    // Title Page
    pdf.setFontSize(24)
    pdf.setTextColor(30, 58, 138)
    pdf.text('AKASHA INDONESIA', 20, 30)
    
    pdf.setFontSize(18)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Consumer Insights Report', 20, 45)
    
    pdf.setFontSize(12)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Analysis Period: ${new Date().toLocaleDateString()}`, 20, 55)
    pdf.text(`Total Feedback Analyzed: ${result.analysis.totalFeedback} entries`, 20, 62)
    
    // Add decorative line
    pdf.setDrawColor(30, 58, 138)
    pdf.setLineWidth(1)
    pdf.line(20, 75, pageWidth - 20, 75)
    
    // Executive Summary Section
    yPosition = 90
    pdf.setFontSize(16)
    pdf.setTextColor(30, 58, 138)
    pdf.text('EXECUTIVE SUMMARY', 20, yPosition)
    
    yPosition += 10
    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0)
    const summaryText = result.analysis.aiSummary || "Consumer feedback analysis reveals valuable insights for strategic decision making across product lines and regional markets."
    const summaryLines = pdf.splitTextToSize(summaryText, pageWidth - 40)
    pdf.text(summaryLines, 20, yPosition)
    yPosition += summaryLines.length * 5 + 15
    
    // Key Metrics Box
    pdf.setFillColor(240, 248, 255)
    pdf.rect(20, yPosition - 5, pageWidth - 40, 35, 'F')
    pdf.setDrawColor(30, 58, 138)
    pdf.rect(20, yPosition - 5, pageWidth - 40, 35, 'S')
    
    pdf.setFontSize(12)
    pdf.setTextColor(30, 58, 138)
    pdf.text('KEY PERFORMANCE INDICATORS', 25, yPosition + 5)
    
    yPosition += 12
    pdf.setFontSize(10)
    pdf.setTextColor(0, 0, 0)
    
    const positivePercent = ((result.analysis.sentimentDistribution.positive / result.analysis.totalFeedback) * 100).toFixed(1)
    const negativePercent = ((result.analysis.sentimentDistribution.negative / result.analysis.totalFeedback) * 100).toFixed(1)
    const highPriorityCount = result.analysis.businessRecommendations.filter(r => r.priority === 'high').length
    
    pdf.text(`• Positive Sentiment: ${positivePercent}% (${result.analysis.sentimentDistribution.positive} responses)`, 25, yPosition)
    yPosition += 5
    pdf.text(`• Negative Sentiment: ${negativePercent}% (${result.analysis.sentimentDistribution.negative} responses)`, 25, yPosition)
    yPosition += 5
    pdf.text(`• High Priority Actions: ${highPriorityCount} immediate recommendations`, 25, yPosition)
    yPosition += 15
    
    // New Page for Detailed Analysis
    pdf.addPage()
    yPosition = 20
    
    // Sentiment Analysis Section
    pdf.setFontSize(16)
    pdf.setTextColor(30, 58, 138)
    pdf.text('SENTIMENT ANALYSIS', 20, yPosition)
    yPosition += 15
    
    // Create sentiment chart representation
    const sentimentData = [
      { label: 'Positive', value: result.analysis.sentimentDistribution.positive, color: [34, 197, 94] },
      { label: 'Neutral', value: result.analysis.sentimentDistribution.neutral, color: [250, 204, 21] },
      { label: 'Negative', value: result.analysis.sentimentDistribution.negative, color: [239, 68, 68] }
    ]
    
    sentimentData.forEach((item, index) => {
      const percentage = ((item.value / result.analysis.totalFeedback) * 100).toFixed(1)
      const barWidth = (item.value / result.analysis.totalFeedback) * (pageWidth - 80)
      
      pdf.setFillColor(item.color[0], item.color[1], item.color[2])
      pdf.rect(60, yPosition - 2, barWidth, 6, 'F')
      
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`${item.label}: ${percentage}%`, 20, yPosition + 2)
      pdf.text(`(${item.value})`, pageWidth - 40, yPosition + 2)
      
      yPosition += 12
    })
    
    yPosition += 10
    
    // Key Findings Section
    pdf.setFontSize(16)
    pdf.setTextColor(30, 58, 138)
    pdf.text('KEY FINDINGS', 20, yPosition)
    yPosition += 10
    
    result.analysis.keyFindings.slice(0, 5).forEach((finding, index) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage()
        yPosition = 20
      }
      
      pdf.setFontSize(10)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`${index + 1}.`, 20, yPosition)
      
      const findingLines = pdf.splitTextToSize(finding, pageWidth - 50)
      pdf.text(findingLines, 28, yPosition)
      yPosition += findingLines.length * 4 + 5
    })
    
    // New Page for Recommendations
    pdf.addPage()
    yPosition = 20
    
    pdf.setFontSize(16)
    pdf.setTextColor(30, 58, 138)
    pdf.text('STRATEGIC RECOMMENDATIONS', 20, yPosition)
    yPosition += 15
    
    // Priority Recommendations
    const priorityOrder = ['high', 'medium', 'low']
    priorityOrder.forEach(priority => {
      const priorityRecs = result.analysis.businessRecommendations.filter(r => r.priority === priority)
      if (priorityRecs.length === 0) return
      
      if (yPosition > pageHeight - 40) {
        pdf.addPage()
        yPosition = 20
      }
      
      pdf.setFontSize(14)
      pdf.setTextColor(priority === 'high' ? 220 : priority === 'medium' ? 180 : 140, 120, 40)
      pdf.text(`${priority.toUpperCase()} PRIORITY ACTIONS`, 20, yPosition)
      yPosition += 10
      
      priorityRecs.slice(0, 3).forEach((rec, index) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage()
          yPosition = 20
        }
        
        // Department badge
        pdf.setFillColor(230, 230, 230)
        pdf.rect(20, yPosition - 5, 40, 8, 'F')
        pdf.setFontSize(8)
        pdf.setTextColor(60, 60, 60)
        pdf.text(rec.department, 22, yPosition)
        
        yPosition += 8
        pdf.setFontSize(11)
        pdf.setTextColor(0, 0, 0)
        const recLines = pdf.splitTextToSize(rec.recommendation, pageWidth - 40)
        pdf.text(recLines, 20, yPosition)
        yPosition += recLines.length * 4 + 2
        
        pdf.setFontSize(9)
        pdf.setTextColor(100, 100, 100)
        pdf.text(`Impact: ${rec.impact}`, 20, yPosition)
        yPosition += 4
        pdf.text(`Timeframe: ${rec.timeframe} | Cost: ${rec.implementationCost}`, 20, yPosition)
        yPosition += 10
      })
      
      yPosition += 5
    })
    
    // Footer on last page
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text('Generated by Akasha Indonesia Consumer Insights Platform', 20, pageHeight - 10)
    pdf.text(`Report Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth - 60, pageHeight - 10)
    
    // Save the PDF
    pdf.save(`akasha-consumer-insights-${new Date().toISOString().split('T')[0]}.pdf`)
    
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF report. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const generatePDFReport = generateComprehensivePDFReport

  const generateManagementReport = () => {
    const reportData = {
      executive_summary: "Consumer feedback analysis reveals strong product satisfaction with opportunities for improvement in packaging and regional distribution.",
      key_metrics: {
        total_feedback: result.analysis.totalFeedback,
        positive_sentiment: `${((result.analysis.sentimentDistribution.positive / result.analysis.totalFeedback) * 100).toFixed(1)}%`,
        high_priority_actions: result.analysis.businessRecommendations.filter(r => r.priority === 'high').length
      },
      recommendations: result.analysis.businessRecommendations.slice(0, 5),
      date_generated: new Date().toLocaleDateString()
    }

    const jsonContent = JSON.stringify(reportData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'akasha-management-report.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getPriorityBadgeClass = (priority: BusinessRecommendation['priority']) => {
    switch (priority) {
      case 'high': return 'badge-high'
      case 'medium': return 'badge-medium'
      case 'low': return 'badge-low'
      default: return 'badge-medium'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Recommendations & Actions</h2>
          <p className="text-gray-600 mt-2">
            AI-generated business recommendations and strategic insights for Akasha Indonesia
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReportGenerator(!showReportGenerator)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            📊 Generate Report
          </button>
          <button
            onClick={generateManagementReport}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            📋 Export Summary
          </button>
        </div>
      </div>

      {/* Department Filter */}
      <div className="insight-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Department</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedDepartment('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedDepartment === 'all' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Departments ({result.analysis.businessRecommendations.length})
          </button>
          {Object.entries(recommendationsByDepartment).map(([dept, recs]) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                selectedDepartment === dept 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{departmentIcons[dept as keyof typeof departmentIcons]}</span>
              {dept.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({recs.length})
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecommendations.map((recommendation, index) => (
          <div key={recommendation.id} className="insight-card hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className={`bg-gradient-to-r ${departmentColors[recommendation.category as keyof typeof departmentColors]} rounded-lg p-2 mr-3`}>
                  <span className="text-white text-lg">
                    {departmentIcons[recommendation.category as keyof typeof departmentIcons]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {recommendation.category.replace('_', ' ')}
                  </h3>
                  <p className="text-sm text-gray-600">{recommendation.department}</p>
                </div>
              </div>
              <span className={`recommendation-badge ${getPriorityBadgeClass(recommendation.priority)}`}>
                {recommendation.priority}
              </span>
            </div>

            {/* Recommendation Content */}
            <div className="mb-4">
              <p className="text-gray-800 leading-relaxed mb-3">
                {recommendation.recommendation}
              </p>
            </div>

            {/* Impact & Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Expected Impact:</span>
                <span className="text-gray-700 font-medium">{recommendation.impact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Implementation Cost:</span>
                <span className={`font-medium capitalize ${
                  recommendation.implementationCost === 'high' ? 'text-red-600' :
                  recommendation.implementationCost === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {recommendation.implementationCost}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timeframe:</span>
                <span className="text-gray-700 font-medium">{recommendation.timeframe}</span>
              </div>
            </div>

            {/* KPIs */}
            {recommendation.kpis && recommendation.kpis.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Performance Indicators:</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendation.kpis.map((kpi, kpiIndex) => (
                    <span key={kpiIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {recommendation.actionItems && recommendation.actionItems.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Action Items:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {recommendation.actionItems.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* What-If Simulation */}
      <div className="insight-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">🎯 What-If Simulation</h3>
        <div className="space-y-6">
          {/* Input Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ask a strategic question about your business:
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={whatIfQuestion}
                onChange={(e) => setWhatIfQuestion(e.target.value)}
                placeholder="e.g., What if we reduce price by 15% across all products?"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                disabled={isGeneratingScenario}
              />
              <button
                onClick={handleWhatIfSubmit}
                disabled={!whatIfQuestion.trim() || isGeneratingScenario}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {isGeneratingScenario ? 'Analyzing...' : 'Simulate'}
              </button>
            </div>
          </div>

          {/* Suggested Questions */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "What if we improve packaging quality?",
                "What if we expand to new regions?",
                "What if we launch a premium product line?",
                "What if we increase marketing spend by 20%?"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setWhatIfQuestion(suggestion)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors border border-gray-300"
                  disabled={isGeneratingScenario}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Results */}
          {whatIfScenarios.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Simulation Results:</h4>
              {whatIfScenarios.map((scenario) => (
                <div key={scenario.id} className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">"{scenario.question}"</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        scenario.projectedImpact.sentimentChange > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {scenario.projectedImpact.sentimentChange > 0 ? '+' : ''}{scenario.projectedImpact.sentimentChange.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Sentiment Impact</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Object.keys(scenario.projectedImpact.topicShifts).length}
                      </div>
                      <div className="text-xs text-gray-600">Topics Affected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">Medium</div>
                      <div className="text-xs text-gray-600">Confidence Level</div>
                    </div>
                  </div>
                  <p className="text-sm text-blue-800">{scenario.projectedImpact.recommendation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Generator */}
      {showReportGenerator && (
        <div className="insight-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 Management Report Generator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Report Sections:</h4>
              <div className="space-y-2">
                {[
                  'Executive Summary',
                  'Key Performance Metrics',
                  'Sentiment Analysis Overview',
                  'Topic Distribution',
                  'Regional Insights',
                  'Priority Recommendations',
                  'Action Plan Timeline'
                ].map((section, index) => (
                  <label key={index} className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">{section}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Output Formats:</h4>
              <div className="space-y-3">
                <button 
                  onClick={generatePDFReport}
                  disabled={isGeneratingPDF}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating PDF...
                    </>
                  ) : (
                    <>📄 Generate PDF Report</>
                  )}
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                  📊 Generate PowerPoint
                </button>
                <button 
                  onClick={generateManagementReport}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  📊 Export JSON Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration & Alerts */}
      <div className="insight-card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">🔗 Integration & Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-2xl mb-2">📧</div>
            <h4 className="font-medium text-gray-900 mb-1">Email Alerts</h4>
            <p className="text-sm text-gray-600">Send insights to stakeholders</p>
          </div>
          <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-2xl mb-2">💬</div>
            <h4 className="font-medium text-gray-900 mb-1">Slack Integration</h4>
            <p className="text-sm text-gray-600">Post updates to team channels</p>
          </div>
          <div className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-2xl mb-2">📱</div>
            <h4 className="font-medium text-gray-900 mb-1">Dashboard API</h4>
            <p className="text-sm text-gray-600">Connect to BI tools</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationsActions