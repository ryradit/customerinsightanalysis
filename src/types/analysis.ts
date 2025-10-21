export interface AnalysisResult {
  status: 'success' | 'error'
  analysis: {
    totalFeedback: number
    sentimentDistribution: {
      positive: number
      neutral: number
      negative: number
    }
    topicDistribution: {
      [key: string]: number
    }
    issueAnalysis?: {
      [key: string]: number
    }
    negativePatterns?: Array<{
      pattern: string
      count: number
      severity: string
      examples: string[]
      mitigation?: {
        immediate_actions: string[]
        long_term_solutions: string[]
        prevention_measures: string[]
      }
    }>
    mitigationStrategies?: {
      immediate_response: Array<{
        issue_type: string
        strategy: string
        timeline: string
        responsible_team: string
      }>
      improvement_initiatives: Array<{
        focus_area: string
        initiative: string
        expected_impact: string
        investment_required: string
      }>
      positive_reinforcement: Array<{
        strength: string
        amplification_strategy: string
        marketing_opportunity: string
      }>
    }
    regionalDistribution?: {
      [key: string]: number
    }
    productDistribution?: {
      [key: string]: number
    }
    timeSeriesData?: {
      date: string
      positive: number
      neutral: number
      negative: number
    }[]
    keyFindings: string[]
    aiSummary: string
    businessRecommendations: BusinessRecommendation[]
    individualFeedback: ProcessedFeedback[]
  }
  processingTime: string
  error?: string
}

export interface ProcessedFeedback extends FeedbackData {
  aiTopics: string[]
  aiSentiment: 'positive' | 'neutral' | 'negative'
  sentimentScore: number
  keyPhrases: string[]
  priority?: 'high' | 'medium' | 'low'
}

export interface BusinessRecommendation {
  id: string
  category: 'marketing' | 'rnd' | 'operations' | 'customer_service' | 'product_development'
  department: string
  recommendation: string
  priority: 'high' | 'medium' | 'low'
  impact: string
  implementationCost: 'low' | 'medium' | 'high'
  timeframe: string
  kpis: string[]
  actionItems: string[]
}

export interface FeedbackData {
  id: string
  feedback: string
  product?: string
  category?: string
  region?: string
  customerInfo?: string
  date?: string
  rating?: number
  channel?: string
  topics?: string[]
  sentiment?: 'positive' | 'neutral' | 'negative' | string
  issue?: string
  satisfaction?: string
}

export interface ColumnMapping {
  feedback: string
  product?: string
  category?: string
  region?: string
  date?: string
  rating?: string
  customer?: string
  channel?: string
}

export interface FilePreview {
  filename: string
  totalRows: number
  columns: string[]
  sampleData: any[]
  detectedMapping: ColumnMapping
  dateRange?: {
    start: string
    end: string
  }
  productCategories?: string[]
  regions?: string[]
}

export interface WhatIfScenario {
  id: string
  question: string
  scenario: string
  projectedImpact: {
    sentimentChange: number
    topicShifts: { [key: string]: number }
    recommendation: string
  }
}

export interface TopicClassification {
  topic: string
  confidence: number
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative'
  confidence: number
  score: number
}

export interface AIModelConfig {
  model: 'gemini' | 'openai'
  temperature: number
  maxTokens: number
}

export interface UploadConfig {
  maxFileSize: number
  allowedExtensions: string[]
  requiredColumns: string[]
}