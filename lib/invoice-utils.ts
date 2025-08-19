// Utility functions for invoice calculations and formatting

/**
 * Get current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

/**
 * Get end of current month date in YYYY-MM-DD format
 */
export const getEndOfMonth = (): string => {
  const today = new Date()
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  return lastDay.toISOString().split('T')[0]
}

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY for display
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Parse numeric value from string, removing currency symbols and spaces
 */
export const parseNumericValue = (value: string): number => {
  if (!value) return 0
  // Remove currency symbols and spaces
  const cleanValue = value.replace(/[^0-9.,-]/g, '')
  const numValue = parseFloat(cleanValue.replace(',', ''))
  return isNaN(numValue) ? 0 : numValue
}

/**
 * Get placeholder text for table cells based on column name
 */
export const getPlaceholderText = (columnName: string): string => {
  const name = columnName.toLowerCase()
  if (name.includes('rate') || name.includes('price')) {
    return '50.00'
  }
  if (name.includes('quantity') || name.includes('qty')) {
    return '1'
  }
  return 'Enter value'
}

/**
 * Generate a unique ID for new fields/rows/columns
 */
export const generateId = (): string => {
  return Date.now().toString()
}