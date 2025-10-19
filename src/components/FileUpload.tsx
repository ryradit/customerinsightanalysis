'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploadProps {
  onFileAnalysis: (file: File, aiModel: string) => Promise<void>
  isAnalyzing: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileAnalysis, isAnalyzing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [aiModel, setAiModel] = useState<'gemini' | 'openai'>('gemini')
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
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
  }

  return (
    <div className="space-y-6">
      {/* AI Model Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose AI Model</h3>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="gemini"
              checked={aiModel === 'gemini'}
              onChange={(e) => setAiModel(e.target.value as 'gemini')}
              className="mr-2"
              disabled={isAnalyzing}
            />
            <span className="text-gray-700">Google Gemini</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="openai"
              checked={aiModel === 'openai'}
              onChange={(e) => setAiModel(e.target.value as 'openai')}
              className="mr-2"
              disabled={isAnalyzing}
            />
            <span className="text-gray-700">OpenAI GPT</span>
          </label>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Customer Feedback Data</h3>
        
        <div
          {...getRootProps()}
          className={`upload-area ${isDragActive ? 'border-primary-500 bg-primary-50' : ''} ${
            isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <input {...getInputProps()} disabled={isAnalyzing} />
          
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
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
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop your file here' : 'Upload Excel file'}
                </p>
                <p className="text-sm text-gray-500">
                  Drag and drop your .xlsx or .xls file here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Maximum file size: 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* File Requirements */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">File Requirements:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Excel file (.xlsx or .xls format)</li>
            <li>• Should contain customer feedback text in one column</li>
            <li>• Optional: customer info, dates, ratings in additional columns</li>
            <li>• First row should contain column headers</li>
          </ul>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-lg transition-colors"
        >
          {isAnalyzing ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Feedback...
            </div>
          ) : (
            'Analyze Customer Feedback'
          )}
        </button>
      </div>
    </div>
  )
}

export default FileUpload