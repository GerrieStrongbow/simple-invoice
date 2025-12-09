import { TableColumn, TableRow } from './types'

export interface CalculationResult {
  subtotal: number
  tax: number
  total: number
  itemTotals: Record<string, number>
}

export class InvoiceCalculator {
  private readonly columns: TableColumn[]
  private readonly rows: TableRow[]

  constructor(columns: TableColumn[], rows: TableRow[]) {
    this.columns = columns
    this.rows = rows
  }

  // Find columns by name patterns
  private findColumn(patterns: string[]): TableColumn | null {
    for (const pattern of patterns) {
      const column = this.columns.find(col => 
        col.name.toLowerCase().includes(pattern.toLowerCase())
      )
      if (column) return column
    }
    return null
  }

  // Extract numeric value from string (handles currency symbols)
  private parseNumber(value: string | number): number {
    if (typeof value === 'number') return value
    if (!value) return 0
    
    // Remove currency symbols and spaces, keep numbers and decimal points
    const cleaned = String(value).replaceAll(/[^\d.-]/g, '')
    const num = Number.parseFloat(cleaned)
    return Number.isNaN(num) ? 0 : num
  }

  // Calculate amount for a single row (quantity * rate)
  private calculateRowAmount(row: TableRow): number {
    const qtyColumn = this.findColumn(['quantity', 'qty', 'days', 'hours'])
    const rateColumn = this.findColumn(['rate', 'price', 'cost', 'unit'])
    
    if (!qtyColumn || !rateColumn) return 0
    
    const quantity = this.parseNumber(row.cells[qtyColumn.id] || 0)
    const rate = this.parseNumber(row.cells[rateColumn.id] || 0)
    
    return quantity * rate
  }

  // Get or calculate amount for a row
  private getRowAmount(row: TableRow): number {
    // First try to find an explicit amount column
    const amountColumn = this.findColumn(['amount', 'total', 'subtotal'])
    
    if (amountColumn && row.cells[amountColumn.id]) {
      const explicitAmount = this.parseNumber(row.cells[amountColumn.id])
      // If user entered a manual amount, use it
      if (explicitAmount > 0) return explicitAmount
    }
    
    // Otherwise calculate from quantity * rate
    return this.calculateRowAmount(row)
  }

  // Calculate suggested amounts for all rows
  calculateSuggestedAmounts(): Record<string, number> {
    const suggestions: Record<string, number> = {}
    
    this.rows.forEach(row => {
      const calculatedAmount = this.calculateRowAmount(row)
      if (calculatedAmount > 0) {
        suggestions[row.id] = calculatedAmount
      }
    })
    
    return suggestions
  }

  // Calculate totals
  calculateTotals(taxRate: number = 0): CalculationResult {
    let subtotal = 0
    const itemTotals: Record<string, number> = {}
    
    // Calculate subtotal from all rows
    this.rows.forEach(row => {
      const amount = this.getRowAmount(row)
      subtotal += amount
      itemTotals[row.id] = amount
    })
    
    // Calculate tax and total
    const tax = subtotal * (taxRate / 100)
    const total = subtotal + tax
    
    return {
      subtotal,
      tax,
      total,
      itemTotals
    }
  }

  // Format currency value
  static formatCurrency(value: number, symbol: string = 'R'): string {
    return `${symbol}${value.toFixed(2)}`
  }

  // Smart format number based on column type
  static formatValue(value: number, column: TableColumn): string {
    if (column.type === 'currency' || 
        column.name.toLowerCase().includes('rate') ||
        column.name.toLowerCase().includes('amount') ||
        column.name.toLowerCase().includes('price')) {
      return this.formatCurrency(value)
    }
    
    if (column.name.toLowerCase().includes('qty') ||
        column.name.toLowerCase().includes('quantity') ||
        column.name.toLowerCase().includes('days') ||
        column.name.toLowerCase().includes('hours')) {
      return value.toString()
    }
    
    return value.toFixed(2)
  }

  // Check if calculations are needed
  hasCalculableColumns(): boolean {
    const hasQuantity = this.findColumn(['quantity', 'qty', 'days', 'hours']) !== null
    const hasRate = this.findColumn(['rate', 'price', 'cost', 'unit']) !== null
    return hasQuantity && hasRate
  }

  // Auto-detect column types based on content
  static detectColumnType(column: TableColumn, rows: TableRow[]): 'text' | 'number' | 'currency' {
    const name = column.name.toLowerCase()
    
    // Check name patterns first
    if (name.includes('rate') || name.includes('amount') || name.includes('price') || name.includes('total')) {
      return 'currency'
    }
    
    if (name.includes('qty') || name.includes('quantity') || name.includes('days') || name.includes('hours')) {
      return 'number'
    }
    
    // Analyze content
    const values = rows.map(row => String(row.cells[column.id] || '')).filter(v => v.trim())
    if (values.length === 0) return 'text'
    
    const numericValues = values.filter(v => !Number.isNaN(Number.parseFloat(v.replaceAll(/[^\d.-]/g, ''))))
    const numericRatio = numericValues.length / values.length
    
    if (numericRatio > 0.7) {
      // Check if values contain currency symbols
      const hasCurrencySymbols = values.some(v => /[R$£€¥]/.test(v))
      return hasCurrencySymbols ? 'currency' : 'number'
    }
    
    return 'text'
  }
}