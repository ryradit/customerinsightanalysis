# 🚀 AI-Powered Consumer Feedback Analysis Platform

<div align="center">

**Akasha Indonesia Consumer Insights Platform**  
*Transforming customer feedback into actionable business intelligence*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-green?logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

## ✨ Overview

A sophisticated AI-powered platform designed for **Akasha Indonesia** to analyze customer feedback data and generate actionable business insights. The platform uses **real Google Gemini AI analysis** (not mock data) to provide comprehensive consumer intelligence for FMCG operations.

## 🎯 Key Features

### 🔍 **Intelligent Analysis**
- **Real AI Processing**: Google Gemini integration for authentic sentiment & topic analysis
- **Multilingual Support**: Native Indonesian and English feedback processing
- **FMCG-Specific**: Tailored for taste, quality, price, packaging analysis
- **Smart Column Detection**: Automatically identifies feedback, product, region columns

### 📊 **Four-Tab Dashboard**
1. **📤 Upload & Overview**: File upload with intelligent preview
2. **📈 Insights Dashboard**: Interactive charts and AI-generated summaries  
3. **🔍 Detailed Analysis**: Individual feedback classification with filtering
4. **💡 Recommendations & Actions**: Business recommendations with PDF reports

### 🤖 **Advanced AI Capabilities**
- **Sentiment Analysis**: Positive, neutral, negative classification with confidence scores
- **Topic Classification**: Taste, quality, price, packaging, availability, promotion, service, brand
- **Regional Insights**: Indonesian market analysis (Jakarta, Surabaya, Bandung, etc.)
- **Business Intelligence**: Actionable recommendations for Marketing, R&D, Operations teams
- **What-If Scenarios**: AI-powered business impact simulations

### 📄 **Professional Reporting**
- **PDF Generation**: Comprehensive business reports with jsPDF
- **Export Options**: JSON, Excel data export
- **Management Reports**: Executive summaries with KPIs and action items
- **Visual Charts**: Interactive data visualization with Chart.js

## 🛠️ Technology Stack

**Frontend Framework:**
- **Next.js 14** - App Router, Server Components, TypeScript support
- **React 18** - Modern hooks, client-side interactivity
- **TypeScript** - Full type safety and developer experience

**AI & Processing:**
- **Google Gemini AI** - Real sentiment and topic analysis (no mock data)
- **SheetJS (xlsx)** - Excel and CSV file processing
- **Intelligent Fallback** - Keyword-based analysis when AI unavailable

**UI & Visualization:**
- **Tailwind CSS** - Custom Akasha branding with blue-green gradient theme
- **Chart.js + React-Chartjs-2** - Interactive charts and data visualization
- **react-dropzone** - File upload with drag-and-drop
- **jsPDF + html2canvas** - Professional PDF report generation

**Development:**
- **ESLint + Prettier** - Code quality and formatting
- **Git** - Version control with comprehensive commit history

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/ryradit/ai-powered-consumer-feedback-analysis.git
cd ai-powered-consumer-feedback-analysis
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Add your Google Gemini API key
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

**Get Google Gemini API Key:**
- Visit: https://makersuite.google.com/app/apikey
- Free tier available for development

### 4. Run Development Server
```bash
npm run dev
```

### 5. Access Platform
- **Application**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/analyze

## 📁 Project Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # Real Gemini AI analysis endpoint
│   │   └── preview/route.ts      # File preview generation
│   ├── globals.css               # Tailwind + custom Akasha styling
│   ├── layout.tsx                # Root layout with Akasha branding
│   └── page.tsx                  # Main four-tab interface
├── components/
│   ├── UploadOverview.tsx        # Tab 1: File upload & preview
│   ├── InsightsDashboard.tsx     # Tab 2: Charts & AI summary
│   ├── DetailedAnalysis.tsx      # Tab 3: Individual feedback analysis
│   ├── RecommendationsActions.tsx # Tab 4: Business recommendations
│   └── Header.tsx                # Akasha-branded header with logo
├── types/
│   └── analysis.ts               # TypeScript interfaces for FMCG data
public/
└── logoakasha.png                # Official Akasha Indonesia logo
```

## 🎮 How to Use

### 1. **Prepare Feedback Data**
Create Excel (.xlsx, .xls) or CSV file with:
- **Required**: Customer feedback/comments column
- **Optional**: Product, region, category, date, rating columns
- **Languages**: Indonesian and English supported
- **Size**: Maximum 10MB per file

### 2. **Upload & Preview**
- Drag-drop file or click to browse
- **Auto-detection**: Platform identifies feedback columns
- **Preview**: See sample data and file statistics
- **Validation**: File format and size verification

### 3. **AI Analysis** (Real Gemini Processing)
- **Comprehensive Analysis**: Single API call for all insights
- **Processing Time**: 10-30 seconds depending on file size
- **Real Results**: Authentic AI analysis, not mock data
- **Fallback**: Intelligent keyword analysis if AI unavailable

### 4. **Business Intelligence**
- **Interactive Dashboard**: Charts, metrics, regional analysis
- **Detailed Feedback**: Individual sentiment scores and topic tags
- **Strategic Recommendations**: Department-specific action items
- **What-If Scenarios**: Business impact simulations

### 5. **Professional Reporting**
- **PDF Reports**: Comprehensive business intelligence reports
- **Data Export**: JSON and Excel formats for integration
- **Management Summary**: Executive-level insights and KPIs

## 🤖 AI Analysis Features

### **Real Gemini AI Processing:**
- **Sentiment Classification**: Authentic positive/neutral/negative analysis
- **Topic Detection**: Real identification of taste, quality, price themes
- **Key Phrase Extraction**: Important Indonesian/English phrases
- **Business Summaries**: AI-generated executive insights
- **Regional Patterns**: Geographic sentiment distribution

### **FMCG-Specific Intelligence:**
- **Product Categories**: Beverages, snacks, dairy, frozen, personal care
- **Indonesian Regions**: Jakarta, Surabaya, Bandung, Medan, Makassar, Yogyakarta
- **Business Context**: Akasha Indonesia market positioning and competitive analysis

### **Intelligent Fallbacks:**
- **Keyword Analysis**: Indonesian/English keyword-based sentiment when AI unavailable
- **Data-Driven Insights**: Real data patterns even without AI processing
- **Graceful Degradation**: Always provides meaningful analysis

## 📊 API Documentation

### Analyze Endpoint
```bash
POST /api/analyze
Content-Type: multipart/form-data

# Parameters:
# - file: Excel/CSV file (required)
# - aiModel: "gemini" (default)
```

### Preview Endpoint
```bash
POST /api/preview
Content-Type: multipart/form-data

# Parameters:
# - file: Excel/CSV file (required)
```

### Response Format
```json
{
  "status": "success",
  "analysis": {
    "totalFeedback": 250,
    "sentimentDistribution": {
      "positive": 125,
      "neutral": 75,
      "negative": 50
    },
    "topicDistribution": {
      "taste": 80,
      "quality": 95,
      "price": 60,
      "packaging": 45
    },
    "regionalDistribution": {
      "jakarta": 87,
      "surabaya": 50,
      "bandung": 38
    },
    "aiSummary": "Real AI-generated business summary...",
    "businessRecommendations": [
      {
        "department": "R&D Division",
        "recommendation": "Develop regional variants...",
        "priority": "high",
        "impact": "25% market penetration increase",
        "timeframe": "6-9 months"
      }
    ]
  }
}
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build  
npm run start        # Production server
npm run lint         # Code quality check
```

### Code Quality
- **TypeScript**: Full type safety for FMCG data structures
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Akasha-branded design system
- **Component Architecture**: Modular, reusable React components

## 🔒 Security & Performance

### **Security Features:**
- **Environment Variables**: Secure API key management
- **File Validation**: Type and size restrictions
- **Input Sanitization**: XSS and injection prevention
- **No Data Storage**: Files processed in memory only

### **Performance Optimizations:**
- **Next.js Image**: Automatic image optimization for Akasha logo
- **Server Components**: Optimal rendering strategy
- **Code Splitting**: Lazy loading for components
- **AI Timeout**: 30-second timeout with graceful fallback

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm install -g vercel
vercel

# Set environment variable:
# GOOGLE_API_KEY=your_api_key_here
```

### **Manual Deployment**
```bash
npm run build
npm run start
```

### **Environment Configuration**
Required environment variables:
- `GOOGLE_API_KEY`: Google Gemini API key (required for AI analysis)

## 🎨 Branding

The platform features **authentic Akasha Indonesia branding**:
- **Logo Integration**: Official Akasha logo in header and avatars
- **Color Scheme**: Blue-green gradient theme matching corporate identity
- **Typography**: Professional, modern design language
- **Regional Focus**: Indonesian market terminology and context

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Akasha Wira International** for platform requirements and branding
- **Google AI** for Gemini API capabilities
- **Next.js Team** for the powerful React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Chart.js** for interactive data visualization
- **Open Source Community** for the amazing tools and libraries

---

<div align="center">

**Built by Ryan Radityatama for Assignment for Akasha Wira International, Tbk.**  
*Transforming Consumer Feedback into Business Success*

[🌐 Live Demo](https://your-deployment-url.vercel.app) • [📚 Documentation](https://github.com/ryradit/ai-powered-consumer-feedback-analysis) • [🐛 Report Bug](https://github.com/ryradit/ai-powered-consumer-feedback-analysis/issues)

</div>
