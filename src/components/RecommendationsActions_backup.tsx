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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Business Recommendations</h2>
        <button
          onClick={() => {/* TODO: Implement PDF generation */}}
          disabled={isGeneratingPDF}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
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