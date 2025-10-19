'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import UploadOverview from '@/components/UploadOverview'
import InsightsDashboard from '@/components/InsightsDashboard'
import DetailedAnalysis from '@/components/DetailedAnalysis'
import RecommendationsActions from '@/components/RecommendationsActions'
import { AnalysisResult, FilePreview } from '@/types/analysis'

type TabType = 'upload' | 'insights' | 'detailed' | 'recommendations'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('upload')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const tabs = [
    { id: 'upload', label: 'Upload & Overview', icon: '📁' },
    { id: 'insights', label: 'Insights Dashboard', icon: '📊' },
    { id: 'detailed', label: 'Detailed Analysis', icon: '🔍' },
    { id: 'recommendations', label: 'Recommendations & Actions', icon: '💡' },
  ]

  const handleFileAnalysis = async (file: File, aiModel: string) => {
    setIsAnalyzing(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('aiModel', aiModel)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
      setActiveTab('insights') // Auto-switch to insights after analysis
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setAnalysisResult(null)
    setFilePreview(null)
    setActiveTab('upload')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <UploadOverview
            onFileAnalysis={handleFileAnalysis}
            onFilePreview={setFilePreview}
            filePreview={filePreview}
            isAnalyzing={isAnalyzing}
          />
        )
      case 'insights':
        return analysisResult ? (
          <InsightsDashboard result={analysisResult} onReset={handleReset} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Please upload and analyze data first</p>
          </div>
        )
      case 'detailed':
        return analysisResult ? (
          <DetailedAnalysis result={analysisResult} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Please upload and analyze data first</p>
          </div>
        )
      case 'recommendations':
        return analysisResult ? (
          <RecommendationsActions result={analysisResult} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Please upload and analyze data first</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={
                  activeTab === tab.id
                    ? 'tab-button-active'
                    : 'tab-button'
                }
                disabled={
                  !analysisResult && 
                  (tab.id === 'insights' || tab.id === 'detailed' || tab.id === 'recommendations')
                }
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderTabContent()}
      </main>
    </div>
  )
}