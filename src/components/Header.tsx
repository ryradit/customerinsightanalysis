'use client'

import React from 'react'
import Image from 'next/image'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white rounded-xl p-2 mr-4 shadow-sm border">
              <Image
                src="/logoakasha.png"
                alt="Akasha Indonesia Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Akasha Consumer Insights Platform
              </h1>
              <p className="text-sm text-gray-600">
                AI-powered feedback analysis for FMCG excellence
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Akasha Wira International</p>
              <p className="text-xs text-gray-500">Consumer Intelligence Division</p>
            </div>
            <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm">
              <Image
                src="/logoakasha.png"
                alt="Akasha Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header