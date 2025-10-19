import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { FilePreview, ColumnMapping } from '@/types/analysis'

function parseFileForPreview(buffer: ArrayBuffer, filename: string): FilePreview {
  const workbook = XLSX.read(buffer, { type: 'array' })
  const worksheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[worksheetName]
  const jsonData = XLSX.utils.sheet_to_json(worksheet)

  if (jsonData.length === 0) {
    throw new Error('File appears to be empty or invalid')
  }

  const columns = Object.keys(jsonData[0] as object)
  const sampleData = jsonData.slice(0, 5) // First 5 rows for preview

  // Auto-detect column mapping
  const detectedMapping: ColumnMapping = {
    feedback: columns.find(col => 
      col.toLowerCase().includes('feedback') || 
      col.toLowerCase().includes('comment') || 
      col.toLowerCase().includes('review') ||
      col.toLowerCase().includes('text') ||
      col.toLowerCase().includes('komentar')
    ) || columns[0], // Default to first column if no match
  }

  // Optional column detection
  detectedMapping.product = columns.find(col => 
    col.toLowerCase().includes('product') || 
    col.toLowerCase().includes('produk')
  )

  detectedMapping.region = columns.find(col => 
    col.toLowerCase().includes('region') || 
    col.toLowerCase().includes('area') ||
    col.toLowerCase().includes('city') ||
    col.toLowerCase().includes('kota')
  )

  detectedMapping.category = columns.find(col => 
    col.toLowerCase().includes('category') || 
    col.toLowerCase().includes('kategori')
  )

  detectedMapping.date = columns.find(col => 
    col.toLowerCase().includes('date') || 
    col.toLowerCase().includes('tanggal') ||
    col.toLowerCase().includes('time')
  )

  detectedMapping.rating = columns.find(col => 
    col.toLowerCase().includes('rating') || 
    col.toLowerCase().includes('score') ||
    col.toLowerCase().includes('nilai')
  )

  detectedMapping.customer = columns.find(col => 
    col.toLowerCase().includes('customer') || 
    col.toLowerCase().includes('name') ||
    col.toLowerCase().includes('nama')
  )

  // Extract unique values for filters
  const productCategories = detectedMapping.product ? 
    Array.from(new Set(jsonData.map((row: any) => row[detectedMapping.product!]).filter(Boolean))) : undefined

  const regions = detectedMapping.region ? 
    Array.from(new Set(jsonData.map((row: any) => row[detectedMapping.region!]).filter(Boolean))) : undefined

  // Date range detection
  let dateRange: { start: string; end: string } | undefined
  if (detectedMapping.date) {
    const dates = jsonData
      .map((row: any) => row[detectedMapping.date!])
      .filter(Boolean)
      .map(date => new Date(date))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime())

    if (dates.length > 0) {
      dateRange = {
        start: dates[0].toISOString().split('T')[0],
        end: dates[dates.length - 1].toISOString().split('T')[0]
      }
    }
  }

  return {
    filename,
    totalRows: jsonData.length,
    columns,
    sampleData,
    detectedMapping,
    dateRange,
    productCategories: productCategories?.slice(0, 10), // Limit to 10 for preview
    regions: regions?.slice(0, 10), // Limit to 10 for preview
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedExtensions = ['.xlsx', '.xls', '.csv']
    const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    
    if (!hasValidExtension) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel file (.xlsx, .xls) or CSV file (.csv)' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    if (file.size > 10485760) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const preview = parseFileForPreview(buffer, file.name)

    return NextResponse.json(preview)

  } catch (error) {
    console.error('Preview generation error:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate file preview. Please check the file format.' },
      { status: 500 }
    )
  }
}