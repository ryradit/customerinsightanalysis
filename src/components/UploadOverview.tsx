'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FilePreview } from '@/types/analysis'

interface UploadOverviewProps {
  onFileAnalysis: (file: File, aiModel: string) => Promise<void>
  onFilePreview: (preview: FilePreview | null) => void
  filePreview: FilePreview | null
  isAnalyzing: boolean
}

const UploadOverview: React.FC<UploadOverviewProps> = ({ 
  onFileAnalysis, 
  onFilePreview, 
  filePreview, 
  isAnalyzing 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [aiModel, setAiModel] = useState<'gemini'>('gemini')
  const [columnMapping, setColumnMapping] = useState<any>({})

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
      
      // Generate file preview
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/preview', {
          method: 'POST',
          body: formData,
        })
        
        if (response.ok) {
          const preview = await response.json()
          onFilePreview(preview)
        }
      } catch (error) {
        console.error('Preview generation failed:', error)
      }
    }
  }, [onFilePreview])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  })

  const handleAnalyze = async () => {
    if (selectedFile) {
      await onFileAnalysis(selectedFile, aiModel)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    onFilePreview(null)
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Consumer Feedback Analysis
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Upload your customer feedback data and leverage AI to uncover insights that drive business growth. 
          Our platform supports Excel and CSV files with automatic column detection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Model Selection */}
          <div className="insight-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Engine</h3>
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="font-medium text-green-900">Google Gemini AI</div>
                  <div className="text-sm text-green-700">
                    Advanced AI analysis with multilingual support for Indonesian and English feedback
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="insight-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Consumer Feedback Data</h3>
            
            <div
              {...getRootProps()}
              className={`upload-area ${isDragActive ? 'border-blue-500 bg-blue-50' : ''} ${
                isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <input {...getInputProps()} disabled={isAnalyzing} />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    disabled={isAnalyzing}
                    className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xl font-medium text-gray-900">
                      {isDragActive ? 'Drop your file here' : 'Upload your feedback data'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Drag and drop your Excel (.xlsx, .xls) or CSV file here, or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Maximum file size: 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* File Requirements */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Supported File Formats & Requirements:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Excel files (.xlsx, .xls) or CSV files</li>
                <li>• Must contain customer feedback/comments column</li>
                <li>• Optional: product, region, date, rating columns</li>
                <li>• First row should contain column headers</li>
                <li>• Supported languages: Indonesian, English</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Preview & Statistics */}
        <div className="space-y-6">
          {filePreview && (
            <>
              <div className="insight-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">File Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Records:</span>
                    <span className="text-sm font-medium">{filePreview.totalRows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Columns:</span>
                    <span className="text-sm font-medium">{filePreview.columns.length}</span>
                  </div>
                  {filePreview.dateRange && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date Range:</span>
                      <span className="text-sm font-medium">
                        {filePreview.dateRange.start} - {filePreview.dateRange.end}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {filePreview.productCategories && (
                <div className="insight-card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {filePreview.productCategories.slice(0, 6).map((category, index) => (
                      <span key={index} className="filter-chip">
                        {category}
                      </span>
                    ))}
                    {filePreview.productCategories.length > 6 && (
                      <span className="text-xs text-gray-500">
                        +{filePreview.productCategories.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {filePreview.regions && (
                <div className="insight-card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Regions</h3>
                  <div className="flex flex-wrap gap-2">
                    {filePreview.regions.map((region, index) => (
                      <span key={index} className="filter-chip">
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="insight-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Data</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        {filePreview.columns.slice(0, 3).map((col, index) => (
                          <th key={index} className="px-2 py-1 text-left font-medium text-gray-700">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filePreview.sampleData.slice(0, 3).map((row, index) => (
                        <tr key={index} className="border-t">
                          {filePreview.columns.slice(0, 3).map((col, colIndex) => (
                            <td key={colIndex} className="px-2 py-1 text-gray-600 truncate max-w-32">
                              {String(row[col] || '').substring(0, 30)}...
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Start Analysis Button */}
      {selectedFile && filePreview && (
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="akasha-gradient text-white font-medium py-4 px-8 rounded-xl text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              '🚀 Processing Your Data...'
            ) : (
              '🚀 Start AI Analysis'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default UploadOverview