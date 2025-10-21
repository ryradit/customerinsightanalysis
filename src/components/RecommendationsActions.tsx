'use client'

import React, { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import PptxGenJS from 'pptxgenjs'
import { AnalysisResult, BusinessRecommendation, WhatIfScenario } from '@/types/analysis'

interface RecommendationsActionsProps {
  result: AnalysisResult
}

const RecommendationsActions: React.FC<RecommendationsActionsProps> = ({ result }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false)

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

  // PowerPoint Generation Function
  const generatePowerPointReport = async () => {
    try {
      setIsGeneratingPPT(true)
      
      const pptx = new PptxGenJS()
      pptx.layout = 'LAYOUT_WIDE'

      // Title Slide
      const titleSlide = pptx.addSlide()
      titleSlide.addText('Business Recommendations Report', {
        x: 1, y: 2, w: 8, h: 2,
        fontSize: 32, bold: true, color: '1E3A8A', align: 'center'
      })
      titleSlide.addText(`${filteredRecommendations.length} Strategic Recommendations`, {
        x: 1, y: 4, w: 8, h: 1,
        fontSize: 18, color: '374151', align: 'center'
      })
      titleSlide.addText(`Generated on ${new Date().toLocaleDateString()}`, {
        x: 1, y: 5.5, w: 8, h: 0.5,
        fontSize: 14, color: '6B7280', align: 'center'
      })

      // Summary Slide
      const summarySlide = pptx.addSlide()
      summarySlide.addText('Recommendations Overview', {
        x: 0.5, y: 0.5, w: 9, h: 1,
        fontSize: 24, bold: true, color: '1E3A8A'
      })

      const highPriorityCount = filteredRecommendations.filter(r => r.priority === 'high').length
      const mediumPriorityCount = filteredRecommendations.filter(r => r.priority === 'medium').length
      const lowPriorityCount = filteredRecommendations.filter(r => r.priority === 'low').length

      // Priority breakdown
      const priorityRows = [
        [
          { text: 'Priority Level', options: { bold: true } },
          { text: 'Count', options: { bold: true } },
          { text: 'Percentage', options: { bold: true } }
        ],
        [
          { text: 'High Priority' },
          { text: highPriorityCount.toString() },
          { text: `${((highPriorityCount / filteredRecommendations.length) * 100).toFixed(1)}%` }
        ],
        [
          { text: 'Medium Priority' },
          { text: mediumPriorityCount.toString() },
          { text: `${((mediumPriorityCount / filteredRecommendations.length) * 100).toFixed(1)}%` }
        ],
        [
          { text: 'Low Priority' },
          { text: lowPriorityCount.toString() },
          { text: `${((lowPriorityCount / filteredRecommendations.length) * 100).toFixed(1)}%` }
        ]
      ]

      summarySlide.addTable(priorityRows, {
        x: 0.5, y: 2, w: 4, h: 2.5,
        fontSize: 12,
        border: { pt: 1, color: 'D1D5DB' }
      })

      // Department breakdown
      const departmentCounts: { [key: string]: number } = {}
      filteredRecommendations.forEach(rec => {
        departmentCounts[rec.category] = (departmentCounts[rec.category] || 0) + 1
      })

      const departmentRows = [
        [
          { text: 'Department', options: { bold: true } },
          { text: 'Recommendations', options: { bold: true } }
        ],
        ...Object.entries(departmentCounts).map(([dept, count]) => [
          { text: dept.replace('_', ' ').toUpperCase() },
          { text: count.toString() }
        ])
      ]

      summarySlide.addTable(departmentRows, {
        x: 5, y: 2, w: 4, h: 2.5,
        fontSize: 12,
        border: { pt: 1, color: 'D1D5DB' }
      })

      // Individual recommendation slides
      filteredRecommendations.forEach((recommendation, index) => {
        const slide = pptx.addSlide()
        
        // Title
        slide.addText(`${index + 1}. ${recommendation.department}`, {
          x: 0.5, y: 0.5, w: 9, h: 1,
          fontSize: 20, bold: true, color: '1E3A8A'
        })

        // Priority badge
        const priorityColor = recommendation.priority === 'high' ? 'DC2626' : 
                              recommendation.priority === 'medium' ? 'F59E0B' : '059669'
        slide.addText(`${recommendation.priority.toUpperCase()} PRIORITY`, {
          x: 7.5, y: 0.5, w: 2, h: 0.5,
          fontSize: 10, bold: true, color: 'FFFFFF',
          fill: { color: priorityColor },
          align: 'center'
        })

        // Recommendation text
        slide.addText(recommendation.recommendation, {
          x: 0.5, y: 1.5, w: 9, h: 1.5,
          fontSize: 14, color: '374151'
        })

        // Details table
        const detailsRows = [
          [
            { text: 'Timeline', options: { bold: true } },
            { text: recommendation.timeframe }
          ],
          [
            { text: 'Investment Required', options: { bold: true } },
            { text: recommendation.implementationCost }
          ],
          [
            { text: 'Expected Impact', options: { bold: true } },
            { text: recommendation.impact.substring(0, 100) + '...' }
          ]
        ]

        slide.addTable(detailsRows, {
          x: 0.5, y: 3.2, w: 9, h: 1.5,
          fontSize: 11,
          border: { pt: 1, color: 'D1D5DB' }
        })

        // Action items
        slide.addText('Key Action Items:', {
          x: 0.5, y: 5, w: 9, h: 0.5,
          fontSize: 14, bold: true, color: '374151'
        })

        recommendation.actionItems.slice(0, 4).forEach((item, itemIndex) => {
          slide.addText(`• ${item}`, {
            x: 0.8, y: 5.5 + (itemIndex * 0.3), w: 8.5, h: 0.3,
            fontSize: 11, color: '4B5563'
          })
        })
      })

      // Save PowerPoint
      await pptx.writeFile({ fileName: `business-recommendations-${selectedDepartment}-${new Date().toISOString().split('T')[0]}.pptx` })

    } catch (error) {
      console.error('Error generating PowerPoint:', error)
      alert('Failed to generate PowerPoint. Please try again.')
    } finally {
      setIsGeneratingPPT(false)
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
          onClick={generatePowerPointReport}
          disabled={isGeneratingPPT}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2 ml-3"
        >
          {isGeneratingPPT ? (
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
              <span>Download PowerPoint</span>
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