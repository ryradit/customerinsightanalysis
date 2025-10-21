'use client'

import React from 'react'
import { AnalysisResult } from '@/types/analysis'

interface MitigationRecommendationsProps {
  result: AnalysisResult
}

const MitigationRecommendations: React.FC<MitigationRecommendationsProps> = ({ result }) => {
  const { analysis } = result

  // Generate mitigation recommendations based on analysis
  const generateMitigationRecommendations = () => {
    const mitigations = []

    // Immediate actions for negative feedback
    if (analysis.sentimentDistribution.negative > 0) {
      const negativePercentage = (analysis.sentimentDistribution.negative / analysis.totalFeedback * 100).toFixed(1)
      
      mitigations.push({
        id: 'immediate_response',
        type: 'Critical Response',
        title: `Address ${analysis.sentimentDistribution.negative} Negative Feedback Cases`,
        urgency: 'high',
        timeline: '24-48 hours',
        department: 'Customer Service',
        icon: '🚨',
        color: 'red',
        actions: [
          'Contact affected customers immediately with personalized response',
          'Implement immediate fixes, replacements, or full refunds',
          'Escalate critical product defects to engineering team',
          'Create detailed issue documentation for pattern analysis',
          'Follow up within 48 hours to ensure customer satisfaction'
        ],
        expectedOutcome: `Reduce customer churn by 60% and prevent negative reviews from spreading. Target: Convert ${Math.floor(analysis.sentimentDistribution.negative * 0.4)} cases to neutral/positive.`,
        budget: 'Medium',
        kpis: ['Customer retention rate', 'Response time', 'Issue resolution rate']
      })
    }

    // Quality improvement initiatives
    if (analysis.issueAnalysis?.quality_issues && analysis.issueAnalysis.quality_issues > 0) {
      mitigations.push({
        id: 'quality_improvement',
        type: 'Process Enhancement',
        title: `Quality Control Overhaul`,
        urgency: 'high',
        timeline: '2-4 weeks',
        department: 'Quality Assurance',
        icon: '🔧',
        color: 'blue',
        actions: [
          'Implement enhanced multi-stage quality testing procedures',
          'Conduct comprehensive supplier quality audits',
          'Increase inspection frequency from random to systematic',
          'Train quality control staff on new industry standards',
          'Install automated quality monitoring systems'
        ],
        expectedOutcome: `Reduce quality-related complaints by 70% within 3 months. Target defect rate: <2%.`,
        budget: 'High',
        kpis: ['Defect rate', 'Quality score', 'Customer complaints', 'Return rate']
      })
    }

    // Performance optimization
    if (analysis.issueAnalysis?.performance_problems && analysis.issueAnalysis.performance_problems > 0) {
      mitigations.push({
        id: 'performance_optimization',
        type: 'Technical Enhancement',
        title: `Performance Issues Resolution Program`,
        urgency: 'medium',
        timeline: '4-6 weeks',
        department: 'R&D Engineering',
        icon: '⚡',
        color: 'purple',
        actions: [
          'Conduct comprehensive performance bottleneck analysis',
          'Optimize product specifications and components',
          'Release firmware/software updates for existing products',
          'Implement real-time performance monitoring systems',
          'Create performance benchmarking standards'
        ],
        expectedOutcome: `Improve product performance metrics by 50%. Reduce performance complaints by 80%.`,
        budget: 'Medium',
        kpis: ['Performance benchmarks', 'User satisfaction', 'System reliability']
      })
    }

    // Service improvement
    if (analysis.issueAnalysis?.service_problems && analysis.issueAnalysis.service_problems > 0) {
      mitigations.push({
        id: 'service_enhancement',
        type: 'Service Excellence',
        title: `Customer Service Enhancement Program`,
        urgency: 'high',
        timeline: '2-3 weeks',
        department: 'Customer Experience',
        icon: '🎧',
        color: 'green',
        actions: [
          'Implement comprehensive customer service training program',
          'Establish 24/7 customer support channels',
          'Create escalation procedures for complex issues',
          'Deploy customer service quality monitoring tools',
          'Implement customer feedback loop system'
        ],
        expectedOutcome: `Improve customer service satisfaction by 60%. Reduce service complaints by 75%.`,
        budget: 'Medium',
        kpis: ['Service satisfaction', 'Response time', 'First-call resolution']
      })
    }

    // Positive reinforcement strategies
    if (analysis.sentimentDistribution.positive > 0) {
      const positivePercentage = (analysis.sentimentDistribution.positive / analysis.totalFeedback * 100).toFixed(1)
      
      mitigations.push({
        id: 'positive_amplification',
        type: 'Growth Opportunity',
        title: `Amplify ${analysis.sentimentDistribution.positive} Positive Experiences`,
        urgency: 'medium',
        timeline: '1-2 weeks',
        department: 'Marketing & Brand',
        icon: '⭐',
        color: 'yellow',
        actions: [
          'Create compelling customer success stories and testimonials',
          'Highlight top-rated product features in marketing campaigns',
          'Launch customer referral and loyalty reward programs',
          'Share positive reviews prominently on social media',
          'Develop case studies showcasing customer success'
        ],
        expectedOutcome: `Increase positive sentiment by 30% and boost brand reputation. Generate 25% more referrals.`,
        budget: 'Low',
        kpis: ['Brand sentiment', 'Referral rate', 'Social media engagement', 'Customer lifetime value']
      })
    }

    return mitigations
  }

  const mitigationRecommendations = generateMitigationRecommendations()

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'bg-red-50 border-red-200 text-red-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getUrgencyBadge = (urgency: string) => {
    const classes = {
      high: 'bg-red-100 text-red-800 border border-red-300',
      medium: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      low: 'bg-green-100 text-green-800 border border-green-300'
    }
    return classes[urgency as keyof typeof classes] || classes.medium
  }

  if (mitigationRecommendations.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800 mb-2">🎉 Excellent Performance!</h3>
        <p className="text-green-700">
          No critical issues detected. Continue maintaining your high standards and consider implementing 
          positive reinforcement strategies to further enhance customer satisfaction.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">🎯 Strategic Mitigation & Improvement Plan</h3>
        <p className="text-gray-600">
          Data-driven recommendations to convert negative feedback into positive customer experiences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mitigationRecommendations.map((recommendation) => (
          <div key={recommendation.id} className={`border rounded-lg p-6 ${getColorClasses(recommendation.color)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{recommendation.icon}</span>
                <div>
                  <h4 className="font-bold text-lg">{recommendation.title}</h4>
                  <p className="text-sm opacity-75">{recommendation.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyBadge(recommendation.urgency)}`}>
                {recommendation.urgency} priority
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-800">
              <div>
                <span className="font-medium text-gray-900">Timeline:</span> {recommendation.timeline}
              </div>
              <div>
                <span className="font-medium text-gray-900">Department:</span> {recommendation.department}
              </div>
              <div>
                <span className="font-medium text-gray-900">Budget:</span> {recommendation.budget}
              </div>
              <div>
                <span className="font-medium text-gray-900">KPIs:</span> {recommendation.kpis.length} metrics
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h5 className="font-semibold mb-2 text-gray-900">📋 Action Items:</h5>
                <ul className="text-sm space-y-1 text-gray-800">
                  {recommendation.actions.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-xs mr-2 mt-1 text-gray-600">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-current border-opacity-20">
                <h5 className="font-semibold mb-1 text-gray-900">🎯 Expected Outcome:</h5>
                <p className="text-sm text-gray-800">{recommendation.expectedOutcome}</p>
              </div>

              <div className="pt-2">
                <h5 className="font-semibold mb-1 text-gray-900">📊 Key Metrics:</h5>
                <div className="flex flex-wrap gap-1">
                  {recommendation.kpis.map((kpi, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded text-gray-700">
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
        <h4 className="font-bold text-gray-900 mb-3">📅 Implementation Timeline</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-800">Week 1-2: Immediate response actions and customer outreach</span>
            <span className="text-red-600 font-medium">Critical</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-800">Week 3-4: Process improvements and quality enhancements</span>
            <span className="text-blue-600 font-medium">High Priority</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-800">Week 5-8: Long-term technical optimizations</span>
            <span className="text-purple-600 font-medium">Strategic</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-800">Ongoing: Positive reinforcement and brand amplification</span>
            <span className="text-green-600 font-medium">Growth</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MitigationRecommendations