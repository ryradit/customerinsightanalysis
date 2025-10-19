# AI Copilot Consumer Insights

An AI-powered consumer insights platform that processes customer feedback data from Excel files and generates actionable business insights using generative AI models.

## Features

- **Excel File Upload**: Secure upload and processing of customer feedback data
- **AI-Powered Analysis**: 
  - Topic classification (price, taste, packaging, product quality, customer service)
  - Sentiment analysis (positive, neutral, negative)
  - Key findings summarization
- **Business Insights**: Generate 3-5 data-driven recommendations for marketing, R&D, and operations teams
- **JSON Export**: Structured output format for easy integration
- **Data Visualization**: Interactive charts and graphs
- **Multiple AI Models**: Support for both Gemini and OpenAI GPT

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd aicopilotconsumerinsight
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Run the Application**
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Access the Application**
   - Open your browser to `http://127.0.0.1:8000`
   - API documentation available at `http://127.0.0.1:8000/docs`

## Project Structure

```
aicopilotconsumerinsight/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── file_processor.py    # Excel file processing
│   │   ├── ai_service.py        # AI model integration
│   │   └── insight_generator.py # Business insights generation
│   ├── api/
│   │   ├── __init__.py
│   │   └── endpoints.py     # API routes
│   └── templates/
│       ├── index.html       # Main upload interface
│       └── results.html     # Results display
├── uploads/                 # Temporary file storage
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── tests/
│   ├── __init__.py
│   ├── test_file_processor.py
│   ├── test_ai_service.py
│   └── sample_data.xlsx
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## API Usage

### Upload and Analyze Excel File

```bash
curl -X POST "http://127.0.0.1:8000/api/analyze" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@customer_feedback.xlsx" \
  -F "ai_model=gemini"
```

### Response Format

```json
{
  "status": "success",
  "analysis": {
    "total_feedback": 150,
    "sentiment_distribution": {
      "positive": 45,
      "neutral": 60,
      "negative": 45
    },
    "topic_distribution": {
      "price": 30,
      "taste": 40,
      "packaging": 25,
      "product_quality": 35,
      "customer_service": 20
    },
    "key_findings": ["Most discussed topics...", "Emerging pain points..."],
    "business_recommendations": [
      {
        "category": "marketing",
        "recommendation": "Focus marketing efforts on taste quality...",
        "priority": "high",
        "impact": "Potential 15% increase in customer satisfaction"
      }
    ]
  },
  "processing_time": "2.3 seconds"
}
```

## Configuration

### AI Models

Set your preferred AI model in `.env`:
- `gemini`: Google Gemini (default)
- `openai`: OpenAI GPT-4

### File Upload Limits

- Maximum file size: 10MB
- Supported formats: .xlsx, .xls
- Required columns: feedback text, customer info (optional)

### Topic Categories

Customize classification categories in `.env`:
```
TOPIC_CATEGORIES=price,taste,packaging,product_quality,customer_service,delivery,support
```

## Development

### Running Tests

```bash
python -m pytest tests/
```

### Code Style

This project follows PEP 8 guidelines. Run formatting:
```bash
black app/
isort app/
```

### Adding New AI Models

1. Create a new service class in `app/services/`
2. Implement the `AIModelInterface`
3. Register in `ai_service.py`

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open a GitHub issue or contact the development team.