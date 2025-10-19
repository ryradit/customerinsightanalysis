# AI Copilot Consumer Insights

An AI-powered consumer insights platform that processes customer feedback data from Excel files and generates actionable business insights using generative AI models like Gemini and OpenAI GPT.

## 🚀 Features

- **Excel File Upload**: Secure drag-and-drop upload interface for customer feedback data
- **AI-Powered Analysis**: 
  - Topic classification (price, taste, packaging, product quality, customer service)
  - Sentiment analysis (positive, neutral, negative)
  - Key findings summarization
- **Business Insights**: Generate 3-5 data-driven recommendations for marketing, R&D, and operations teams
- **Interactive Visualizations**: Charts and graphs using Chart.js and React-Chartjs-2
- **JSON Export**: Structured output format for easy integration with other systems
- **Multiple AI Models**: Support for both Google Gemini and OpenAI GPT

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + TypeScript + React 18
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + React-Chartjs-2
- **File Processing**: SheetJS (xlsx)
- **AI Integration**: Google Generative AI
- **Development**: ESLint + Prettier

## 📋 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd aicopilotconsumerinsight
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your API keys
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Access the Application
- Open your browser to `http://localhost:3000`
- API documentation available at `http://localhost:3000/api/analyze`

## 📁 Project Structure

```
aicopilotconsumerinsight/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts       # API endpoint for file analysis
│   │   ├── globals.css            # Global styles and Tailwind CSS
│   │   ├── layout.tsx             # Root layout component
│   │   └── page.tsx               # Home page with file upload
│   ├── components/
│   │   ├── AnalysisResults.tsx    # Results display with charts
│   │   ├── FileUpload.tsx         # File upload component
│   │   └── Header.tsx             # Header component
│   └── types/
│       └── analysis.ts            # TypeScript type definitions
├── backup/                        # Original files backup
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# VS Code Tasks
# Press Ctrl+Shift+P > "Tasks: Run Task" > "Run Development Server"
```

## 🎯 How to Use

### 1. Prepare Your Data
- Create an Excel file (.xlsx or .xls) with customer feedback
- Include feedback text in any column (feedback, comments, reviews, etc.)
- Optional: Add customer info, dates, ratings in separate columns
- First row should contain column headers

### 2. Upload and Analyze
- Choose your preferred AI model (Gemini)
- Drag and drop your Excel file or click to browse
- Click "Analyze Customer Feedback" button
- Wait for AI processing (typically 2-5 seconds)

### 3. View Results
- **Sentiment Distribution**: Visual breakdown of positive/neutral/negative feedback
- **Topic Distribution**: Chart showing discussion frequency by topic
- **Key Findings**: AI-generated insights about customer sentiment patterns
- **Business Recommendations**: 3-5 actionable recommendations for different teams

### 4. Export Results
- Download results as JSON for integration with other tools
- Print comprehensive report for presentations

## 🤖 AI Model Configuration

### Supported Models
- **Google Gemini** (default): Fast processing, good for general analysis

### Topic Categories
The system classifies feedback into these categories:
- Price concerns and value perception
- Taste and flavor feedback
- Packaging and presentation issues
- Product quality assessments
- Customer service experiences

## 📊 API Usage

### Analyze Endpoint
```bash
POST /api/analyze
Content-Type: multipart/form-data

# Form data:
# - file: Excel file (.xlsx/.xls)
# - aiModel: "gemini" or "openai"
```

### Response Format
```json
{
  "status": "success",
  "analysis": {
    "totalFeedback": 150,
    "sentimentDistribution": {
      "positive": 60,
      "neutral": 45,
      "negative": 45
    },
    "topicDistribution": {
      "price": 38,
      "taste": 45,
      "packaging": 30,
      "product_quality": 53,
      "customer_service": 23
    },
    "keyFindings": [
      "Product quality is the most discussed topic among customers",
      "Taste satisfaction shows strong positive sentiment correlation"
    ],
    "businessRecommendations": [
      {
        "category": "rnd",
        "recommendation": "Invest in product quality improvements based on customer feedback patterns",
        "priority": "high",
        "impact": "Potential 20% increase in customer satisfaction scores",
        "implementationCost": "medium"
      }
    ]
  },
  "processingTime": "2.3 seconds"
}
```

## 🔒 Security & Limits

- **File Size**: Maximum 10MB per upload
- **File Types**: Only .xlsx and .xls files accepted
- **API Keys**: Stored securely in environment variables
- **Data Privacy**: Uploaded files are processed in memory and not stored

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Manual Deployment
```bash
npm run build
npm run start
```

Remember to set environment variables in your deployment platform.

## 🛠️ Development

### Code Style
The project uses ESLint and Prettier for code formatting:
```bash
npm run lint          # Check for linting issues
```

### Adding New AI Models
1. Create a new service function in `/src/app/api/analyze/route.ts`
2. Add the model option to the file upload component
3. Update TypeScript types as needed

### Customizing Topic Categories
Edit the analysis logic in `/src/app/api/analyze/route.ts` to modify:
- Topic classification categories
- Sentiment analysis thresholds
- Business recommendation templates

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Support

For questions, issues, or feature requests:
1. Check the issues section on GitHub
2. Create a new issue with detailed description
3. Contact the development team

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Google for AI model APIs
- Chart.js for visualization capabilities
- Tailwind CSS for styling system
