'use client'

import React, { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { AnalysisResult, BusinessRecommendation } from '@/types/analysis'

interface RecommendationsActionsProps {
  result: AnalysisResult
}

const RecommendationsActions: React.FC<RecommendationsActionsProps> = ({ result }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const departmentIcons = {
    marketing: '📢',
    rnd: '🔬', 
    operations: '⚙️',
    customer_service: '🎧',
    product_development: '💡'
  }

  const filteredRecommendations = selectedDepartment === 'all'
    ? result.analysis.businessRecommendations
    : result.analysis.businessRecommendations.filter(rec => rec.category === selectedDepartment)

  // PDF Generation Function
  const generatePDFReport = async () => {
    try {
      setIsGeneratingPDF(true)
      
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let yPosition = 20

      // Title
      pdf.setFontSize(24)
      pdf.setFont(undefined, 'bold')
      pdf.text('Business Recommendations Report', 20, yPosition)
      yPosition += 20

      // Date and summary
      pdf.setFontSize(12)
      pdf.setFont(undefined, 'normal')
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition)
      yPosition += 10
      pdf.text(`Total Recommendations: ${filteredRecommendations.length}`, 20, yPosition)
      yPosition += 10
      pdf.text(`Department Filter: ${selectedDepartment === 'all' ? 'All Departments' : selectedDepartment.replace('_', ' ')}`, 20, yPosition)
      yPosition += 20

      // Summary statistics
      const highPriorityCount = filteredRecommendations.filter(r => r.priority === 'high').length
      const mediumPriorityCount = filteredRecommendations.filter(r => r.priority === 'medium').length
      const lowPriorityCount = filteredRecommendations.filter(r => r.priority === 'low').length

      pdf.setFontSize(14)
      pdf.setFont(undefined, 'bold')
      pdf.text('Priority Overview:', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(12)
      pdf.setFont(undefined, 'normal')
      pdf.text(`• High Priority: ${highPriorityCount} recommendations`, 25, yPosition)
      yPosition += 8
      pdf.text(`• Medium Priority: ${mediumPriorityCount} recommendations`, 25, yPosition)
      yPosition += 8
      pdf.text(`• Low Priority: ${lowPriorityCount} recommendations`, 25, yPosition)
      yPosition += 20

      // Recommendations
      pdf.setFontSize(16)
      pdf.setFont(undefined, 'bold')
      pdf.text('Detailed Recommendations:', 20, yPosition)
      yPosition += 15

      filteredRecommendations.forEach((recommendation, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          pdf.addPage()
          yPosition = 20
        }

        // Recommendation header
        pdf.setFontSize(14)
        pdf.setFont(undefined, 'bold')
        pdf.text(`${index + 1}. ${recommendation.department}`, 20, yPosition)
        yPosition += 8

        // Priority badge
        pdf.setFontSize(10)
        pdf.setFont(undefined, 'normal')
        const priorityColor = recommendation.priority === 'high' ? [220, 38, 38] : 
                              recommendation.priority === 'medium' ? [245, 158, 11] : [34, 197, 94]
        pdf.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2])
        pdf.text(`[${recommendation.priority.toUpperCase()} PRIORITY]`, 20, yPosition)
        pdf.setTextColor(0, 0, 0)
        yPosition += 10

        // Recommendation text
        pdf.setFontSize(11)
        const splitRecommendation = pdf.splitTextToSize(recommendation.recommendation, pageWidth - 40)
        pdf.text(splitRecommendation, 20, yPosition)
        yPosition += splitRecommendation.length * 5 + 5

        // Details
        pdf.setFontSize(10)
        pdf.setFont(undefined, 'bold')
        pdf.text('Timeline:', 20, yPosition)
        pdf.setFont(undefined, 'normal')
        pdf.text(recommendation.timeframe, 60, yPosition)
        yPosition += 6

        pdf.setFont(undefined, 'bold')
        pdf.text('Investment:', 20, yPosition)
        pdf.setFont(undefined, 'normal')
        pdf.text(recommendation.implementationCost, 60, yPosition)
        yPosition += 6

        pdf.setFont(undefined, 'bold')
        pdf.text('Expected Impact:', 20, yPosition)
        yPosition += 5
        pdf.setFont(undefined, 'normal')
        const splitImpact = pdf.splitTextToSize(recommendation.impact, pageWidth - 40)
        pdf.text(splitImpact, 20, yPosition)
        yPosition += splitImpact.length * 4 + 5

        // Action items
        pdf.setFont(undefined, 'bold')
        pdf.text('Action Items:', 20, yPosition)
        yPosition += 5
        pdf.setFont(undefined, 'normal')
        recommendation.actionItems.forEach((item, itemIndex) => {
          const splitItem = pdf.splitTextToSize(`• ${item}`, pageWidth - 50)
          pdf.text(splitItem, 25, yPosition)
          yPosition += splitItem.length * 4 + 2
        })

        // KPIs
        pdf.setFont(undefined, 'bold')
        pdf.text('Key Performance Indicators:', 20, yPosition)
        yPosition += 5
        pdf.setFont(undefined, 'normal')
        const kpiText = recommendation.kpis.join(', ')
        const splitKpis = pdf.splitTextToSize(kpiText, pageWidth - 40)
        pdf.text(splitKpis, 20, yPosition)
        yPosition += splitKpis.length * 4 + 15

        // Add separator line
        if (index < filteredRecommendations.length - 1) {
          pdf.setDrawColor(200, 200, 200)
          pdf.line(20, yPosition - 5, pageWidth - 20, yPosition - 5)
          yPosition += 5
        }
      })

      // Footer
      const totalPages = pdf.internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(128, 128, 128)
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10)
        pdf.text('Generated by AI Consumer Insights Platform', 20, pageHeight - 10)
      }

      // Save the PDF
      pdf.save(`business-recommendations-${selectedDepartment}-${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Generate PowerPoint text content
  const generatePowerPointText = (recommendations: BusinessRecommendation[]) => {
    let content = `BUSINESS RECOMMENDATIONS REPORT\n`
    content += `Generated on ${new Date().toLocaleDateString()}\n`
    content += `Total Recommendations: ${recommendations.length}\n`
    content += `Department Filter: ${selectedDepartment === 'all' ? 'All Departments' : selectedDepartment}\n\n`
    
    content += `=== SUMMARY ===\n`
    const highPriorityCount = recommendations.filter(r => r.priority === 'high').length
    const mediumPriorityCount = recommendations.filter(r => r.priority === 'medium').length
    const lowPriorityCount = recommendations.filter(r => r.priority === 'low').length
    
    content += `High Priority: ${highPriorityCount} (${((highPriorityCount / recommendations.length) * 100).toFixed(1)}%)\n`
    content += `Medium Priority: ${mediumPriorityCount} (${((mediumPriorityCount / recommendations.length) * 100).toFixed(1)}%)\n`
    content += `Low Priority: ${lowPriorityCount} (${((lowPriorityCount / recommendations.length) * 100).toFixed(1)}%)\n\n`

    recommendations.forEach((rec, index) => {
      content += `=== RECOMMENDATION ${index + 1}: ${rec.category.replace('_', ' ').toUpperCase()} ===\n`
      content += `Priority: ${rec.priority.toUpperCase()}\n`
      content += `Department: ${rec.department}\n`
      content += `Timeline: ${rec.timeframe}\n`
      content += `Investment Required: ${rec.implementationCost}\n\n`
      content += `Description:\n${rec.recommendation}\n\n`
      content += `Expected Impact:\n${rec.impact}\n\n`
      content += `Key Performance Indicators:\n${rec.kpis.map(kpi => `• ${kpi}`).join('\n')}\n\n`
      content += `Action Items:\n${rec.actionItems.map(item => `• ${item}`).join('\n')}\n\n`
      content += `${'='.repeat(60)}\n\n`
    })
    
    return content
  }

  // Text Report Generation Function  
  const generateTextReport = async () => {
    try {
      setIsGeneratingReport(true)
      
      // Create a structured text report that can be copied to PowerPoint or Word
      const reportText = generatePowerPointText(filteredRecommendations)
      
      // Download as a text file
      const blob = new Blob([reportText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `business-recommendations-report-${selectedDepartment}-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Business Recommendations</h2>
        <button
          onClick={generatePDFReport}
          disabled={isGeneratingPDF}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          {isGeneratingPDF ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PDF</span>
            </>
          )}
        </button>
        <button
          onClick={generateTextReport}
          disabled={isGeneratingReport}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2 ml-3"
        >
          {isGeneratingReport ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download Report</span>
            </>
          )}
        </button>
      </div>

      {/* Department Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedDepartment('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedDepartment === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Departments
        </button>
        {Object.keys(departmentIcons).map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedDepartment === dept
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {departmentIcons[dept as keyof typeof departmentIcons]} {dept.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecommendations.map((recommendation) => (
          <div key={recommendation.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {departmentIcons[recommendation.category as keyof typeof departmentIcons]}
                </span>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{recommendation.department}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                    recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {recommendation.priority} priority
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{recommendation.recommendation}</p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Timeline:</span>
                  <p className="text-gray-900">{recommendation.timeframe}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Investment:</span>
                  <p className="text-gray-900">{recommendation.implementationCost}</p>
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-600">Expected Impact:</span>
                <p className="text-gray-900 text-sm">{recommendation.impact}</p>
              </div>

              <div>
                <span className="font-medium text-gray-600">KPIs:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recommendation.kpis.map((kpi, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-medium text-gray-600">Action Items:</span>
                <ul className="text-sm text-gray-900 mt-1 space-y-1">
                  {recommendation.actionItems.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecommendationsActions