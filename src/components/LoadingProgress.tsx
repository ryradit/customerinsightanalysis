'use client'

import React, { useState, useEffect } from 'react'

interface LoadingProgressProps {
  isVisible: boolean
  onComplete?: () => void
  dataSize?: number // Number of rows to process
}

interface ProcessingStage {
  id: string
  title: string
  description: string
  duration: number
  icon: string
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({ isVisible, onComplete, dataSize = 1000 }) => {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Calculate scaling factor based on data size
  const getScalingFactor = (rows: number) => {
    if (rows <= 500) return 1.0          // Small datasets: normal speed
    if (rows <= 1000) return 1.5         // Medium datasets: 1.5x slower
    if (rows <= 5000) return 2.5         // Large datasets: 2.5x slower
    if (rows <= 10000) return 4.0        // Very large: 4x slower
    return 6.0                           // Enterprise scale: 6x slower
  }

  const scalingFactor = getScalingFactor(dataSize)

  // Get data size category for display
  const getDataSizeCategory = (rows: number) => {
    if (rows <= 500) return { category: 'Small Dataset', color: 'text-green-600', bg: 'bg-green-50' }
    if (rows <= 1000) return { category: 'Medium Dataset', color: 'text-blue-600', bg: 'bg-blue-50' }
    if (rows <= 5000) return { category: 'Large Dataset', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    if (rows <= 10000) return { category: 'Very Large Dataset', color: 'text-orange-600', bg: 'bg-orange-50' }
    return { category: 'Enterprise Dataset', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const dataSizeInfo = getDataSizeCategory(dataSize)

  // Base durations that scale with data size
  const getStages = (scaleFactor: number): ProcessingStage[] => [
    {
      id: 'upload',
      title: 'Uploading Document',
      description: `Securely transferring ${dataSize.toLocaleString()} rows to our analysis servers`,
      duration: Math.round(8000 * scaleFactor),
      icon: '📤'
    },
    {
      id: 'validation',
      title: 'File Validation',
      description: 'Verifying file integrity and data structure',
      duration: Math.round(5000 * scaleFactor),
      icon: '🔐'
    },
    {
      id: 'extraction',
      title: 'Data Extraction',
      description: `Reading and parsing ${dataSize.toLocaleString()} feedback entries`,
      duration: Math.round(10000 * scaleFactor),
      icon: '🔍'
    },
    {
      id: 'preprocessing',
      title: 'Data Preprocessing',
      description: `Cleaning and preparing ${dataSize.toLocaleString()} customer feedback texts`,
      duration: Math.round(12000 * scaleFactor),
      icon: '🧹'
    },
    {
      id: 'ai-sentiment',
      title: 'AI Sentiment Analysis',
      description: `Analyzing emotions and satisfaction in ${dataSize.toLocaleString()} entries`,
      duration: Math.round(15000 * scaleFactor),
      icon: '🤖'
    },
    {
      id: 'ai-topics',
      title: 'Topic Classification',
      description: `Identifying key themes across ${dataSize.toLocaleString()} feedback items`,
      duration: Math.round(13000 * scaleFactor),
      icon: '🏷️'
    },
    {
      id: 'pattern-analysis',
      title: 'Pattern Analysis',
      description: `Discovering trends and correlations in ${dataSize.toLocaleString()} data points`,
      duration: Math.round(11000 * scaleFactor),
      icon: '🔬'
    },
    {
      id: 'insights',
      title: 'Generating Insights',
      description: 'Creating comprehensive business intelligence reports',
      duration: Math.round(8000 * scaleFactor),
      icon: '📊'
    },
    {
      id: 'recommendations',
      title: 'Building Recommendations',
      description: 'Formulating actionable improvement strategies',
      duration: Math.round(7000 * scaleFactor),
      icon: '💡'
    },
    {
      id: 'finalization',
      title: 'Finalizing Results',
      description: 'Preparing your interactive dashboard',
      duration: Math.round(5000 * scaleFactor),
      icon: '✨'
    }
  ]

  const stages = getStages(scalingFactor)

  // Reset state when component becomes visible
  useEffect(() => {
    if (isVisible) {
      setCurrentStage(0)
      setProgress(0)
      setCompletedStages([])
      setIsProcessing(true)
    } else {
      setIsProcessing(false)
    }
  }, [isVisible])

  // Main processing effect
  useEffect(() => {
    if (!isProcessing || !isVisible) return

    const currentStageData = stages[currentStage]
    if (!currentStageData) return

    const progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        const increment = (100 / currentStageData.duration) * 100 // 100ms intervals for slower progression
        const newProgress = prevProgress + increment

        if (newProgress >= 100) {
          // Stage completed
          setCompletedStages(prev => [...prev, currentStage])
          
          if (currentStage < stages.length - 1) {
            // Move to next stage
            setTimeout(() => {
              setCurrentStage(prev => prev + 1)
              setProgress(0)
            }, 200)
          } else {
            // All stages completed
            setTimeout(() => {
              setIsProcessing(false)
              onComplete?.()
            }, 500)
          }
          
          return 100
        }

        return newProgress
      })
    }, 100) // Update every 100ms instead of 50ms

    return () => clearInterval(progressInterval)
  }, [isProcessing, currentStage, stages, onComplete, isVisible])

  if (!isVisible) return null

  const overallProgress = ((currentStage + (progress / 100)) / stages.length) * 100
  const currentStageData = stages[currentStage]

  const getProcessingMessage = () => {
    if (currentStage < 3) {
      return `Processing ${dataSize.toLocaleString()} rows with enterprise-grade security and validation protocols.`
    } else if (currentStage < 6) {
      return `Advanced AI models are analyzing sentiment and topics across ${dataSize.toLocaleString()} customer feedback entries.`
    } else {
      return `Generating actionable insights from ${dataSize.toLocaleString()} data points and building comprehensive business recommendations.`
    }
  }

  // Calculate estimated total time
  const totalEstimatedTime = stages.reduce((total, stage) => total + stage.duration, 0)
  const estimatedMinutes = Math.round(totalEstimatedTime / 60000)
  const estimatedSeconds = Math.round((totalEstimatedTime % 60000) / 1000)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 border border-gray-200">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚀</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Data</h2>
          <p className="text-gray-600 mb-4">
            Advanced AI analysis in progress - please wait while we process your feedback data
          </p>
          
          {/* Data Size Indicator */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full border ${dataSizeInfo.bg} ${dataSizeInfo.color} border-current`}>
            <span className="text-sm font-semibold mr-2">{dataSizeInfo.category}</span>
            <span className="text-sm">
              {dataSize.toLocaleString()} rows • Est. {estimatedMinutes}m {estimatedSeconds}s
            </span>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-blue-600">{Math.round(overallProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Current Stage */}
        {currentStageData && (
          <div className="mb-8">
            <div className="flex items-start mb-4">
              <div className="text-3xl mr-4 mt-1">{currentStageData.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {currentStageData.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {currentStageData.description}
                </p>
                
                {/* Stage Progress */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Steps Overview */}
        <div className="mb-8 max-h-48 overflow-y-auto">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Processing Pipeline</h4>
          <div className="space-y-2">
            {stages.map((stage, index) => {
              const isCompleted = completedStages.includes(index)
              const isCurrent = index === currentStage
              const isPending = index > currentStage
              
              return (
                <div 
                  key={stage.id}
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                    isCompleted ? 'bg-green-50 border border-green-200' : 
                    isCurrent ? 'bg-blue-50 border border-blue-200 shadow-sm' : 
                    'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-blue-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${
                      isCompleted ? 'text-green-700' :
                      isCurrent ? 'text-blue-700' :
                      'text-gray-600'
                    }`}>
                      {stage.title}
                    </span>
                  </div>
                  
                  {isCurrent && (
                    <div className="flex items-center">
                      <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="text-green-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Processing Information */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center">
            <span className="mr-2">🔬</span>
            AI Processing Details
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {getProcessingMessage()}
          </p>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{completedStages.length}</div>
            <div className="text-xs text-blue-700 font-medium">Completed</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-xl font-bold text-yellow-600">
              {currentStage < stages.length ? 1 : 0}
            </div>
            <div className="text-xs text-yellow-700 font-medium">Processing</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-600">
              {stages.length - completedStages.length - (currentStage < stages.length ? 1 : 0)}
            </div>
            <div className="text-xs text-gray-700 font-medium">Remaining</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoadingProgress