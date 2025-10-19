'use client'

import React, { useState, useMemo } from 'react'
import { AnalysisResult, ProcessedFeedback } from '@/types/analysis'

interface DetailedAnalysisProps {
  result: AnalysisResult
}

const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ result }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null)

  const itemsPerPage = 10

  // Get unique values for filters
  const uniqueProducts = useMemo(() => {
    const products = result.analysis.individualFeedback
      .map(f => f.product)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
    return products
  }, [result.analysis.individualFeedback])

  const uniqueRegions = useMemo(() => {
    const regions = result.analysis.individualFeedback
      .map(f => f.region)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index)
    return regions
  }, [result.analysis.individualFeedback])

  const uniqueTopics = useMemo(() => {
    const allTopics = result.analysis.individualFeedback
      .flatMap(f => f.aiTopics || [])
      .filter((value, index, self) => self.indexOf(value) === index)
    return allTopics
  }, [result.analysis.individualFeedback])

  // Filter feedback based on selected criteria
  const filteredFeedback = useMemo(() => {
    return result.analysis.individualFeedback.filter(feedback => {
      const matchesSearch = searchTerm === '' || 
        feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (feedback.customerInfo && feedback.customerInfo.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesSentiment = selectedSentiment === 'all' || feedback.aiSentiment === selectedSentiment
      const matchesProduct = selectedProduct === 'all' || feedback.product === selectedProduct
      const matchesRegion = selectedRegion === 'all' || feedback.region === selectedRegion
      const matchesTopic = selectedTopic === 'all' || 
        (feedback.aiTopics && feedback.aiTopics.includes(selectedTopic))

      return matchesSearch && matchesSentiment && matchesProduct && matchesRegion && matchesTopic
    })
  }, [result.analysis.individualFeedback, searchTerm, selectedSentiment, selectedProduct, selectedRegion, selectedTopic])

  // Pagination
  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage)
  const paginatedFeedback = filteredFeedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800'
      case 'negative':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExportFiltered = () => {
    const exportData = filteredFeedback.map(feedback => ({
      feedback: feedback.feedback,
      sentiment: feedback.aiSentiment,
      topics: feedback.aiTopics?.join(', '),
      product: feedback.product,
      region: feedback.region,
      date: feedback.date,
      customer: feedback.customerInfo,
      sentimentScore: feedback.sentimentScore,
      keyPhrases: feedback.keyPhrases?.join(', ')
    }))

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Feedback,Sentiment,Topics,Product,Region,Date,Customer,Score,Key Phrases\n"
      + exportData.map(row => Object.values(row).map(val => `"${val || ''}"`).join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "akasha-detailed-feedback-analysis.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSentiment('all')
    setSelectedTopic('all')
    setSelectedProduct('all')
    setSelectedRegion('all')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Detailed Feedback Analysis</h2>
          <p className="text-gray-600 mt-2">
            Explore individual feedback entries with AI-powered classification and sentiment analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            Showing {filteredFeedback.length} of {result.analysis.totalFeedback} entries
          </span>
          <button
            onClick={handleExportFiltered}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            📥 Export Filtered Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="insight-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters & Search</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All Filters
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search feedback content or customer info..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>

          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Topics</option>
            {uniqueTopics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Products</option>
            {uniqueProducts.map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Regions</option>
            {uniqueRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {filteredFeedback.length} results
          </div>
        </div>
      </div>

      {/* Feedback Entries */}
      <div className="space-y-4">
        {paginatedFeedback.map((feedback, index) => (
          <div key={feedback.id} className="insight-card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500">
                  #{(currentPage - 1) * itemsPerPage + index + 1}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentBadge(feedback.aiSentiment)}`}>
                  {feedback.aiSentiment}
                </span>
                {feedback.priority && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(feedback.priority)}`}>
                    {feedback.priority} priority
                  </span>
                )}
                {feedback.sentimentScore && (
                  <span className="text-xs text-gray-500">
                    Score: {feedback.sentimentScore.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {feedback.date && (
                  <span className="text-xs text-gray-500">{feedback.date}</span>
                )}
                <button
                  onClick={() => setEditingFeedback(editingFeedback === feedback.id ? null : feedback.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {editingFeedback === feedback.id ? 'Cancel' : 'Edit Tags'}
                </button>
              </div>
            </div>

            {/* Feedback Content */}
            <div className="mb-4">
              <p className="text-gray-800 leading-relaxed mb-2">{feedback.feedback}</p>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {feedback.product && (
                  <span>Product: <strong>{feedback.product}</strong></span>
                )}
                {feedback.region && (
                  <span>Region: <strong>{feedback.region}</strong></span>
                )}
                {feedback.customerInfo && (
                  <span>Customer: <strong>{feedback.customerInfo}</strong></span>
                )}
                {feedback.rating && (
                  <span>Rating: <strong>{feedback.rating}/5</strong></span>
                )}
              </div>
            </div>

            {/* AI Classifications */}
            <div className="border-t pt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Topics */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">AI-Detected Topics:</h4>
                  <div className="flex flex-wrap gap-2">
                    {feedback.aiTopics && feedback.aiTopics.length > 0 ? (
                      feedback.aiTopics.map((topic, topicIndex) => (
                        <span key={topicIndex} className="filter-chip-active">
                          {topic}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No topics detected</span>
                    )}
                  </div>
                </div>

                {/* Key Phrases */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Phrases:</h4>
                  <div className="flex flex-wrap gap-2">
                    {feedback.keyPhrases && feedback.keyPhrases.length > 0 ? (
                      feedback.keyPhrases.slice(0, 3).map((phrase, phraseIndex) => (
                        <span key={phraseIndex} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          "{phrase}"
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">No key phrases identified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Mode */}
              {editingFeedback === feedback.id && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Edit Classifications:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-blue-800 mb-1">Sentiment:</label>
                      <select className="w-full px-2 py-1 text-sm border border-blue-200 rounded">
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="negative">Negative</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-blue-800 mb-1">Priority:</label>
                      <select className="w-full px-2 py-1 text-sm border border-blue-200 rounded">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setEditingFeedback(null)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredFeedback.length)}
                </span>{' '}
                of <span className="font-medium">{filteredFeedback.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === i + 1
                        ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailedAnalysis