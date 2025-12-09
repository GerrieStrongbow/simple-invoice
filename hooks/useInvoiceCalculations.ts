import { useMemo, useCallback } from 'react'
import { Column, Row } from '@/lib/invoice-types'
import { parseNumericValue } from '@/lib/invoice-utils'

const getCellStringValue = (cellValue: unknown): string => {
  if (typeof cellValue === 'string') {
    return cellValue
  }
  if (typeof cellValue === 'number') {
    return cellValue.toString()
  }
  return ''
}

interface UseInvoiceCalculationsProps {
  columns: Column[]
  rows: Row[]
  taxEnabled: boolean
  taxPercentage: string
  discountEnabled: boolean
  discountPercentage: string
}

export const useInvoiceCalculations = ({
  columns,
  rows,
  taxEnabled,
  taxPercentage,
  discountEnabled,
  discountPercentage
}: UseInvoiceCalculationsProps) => {
  // Calculate amount for a single row based on numeric columns
  const calculateRowAmount = useCallback((row: Row): string => {
    let result = 1
    let numericColumns = 0
    let filledColumns = 0
    
    // First pass: count numeric columns and filled columns
    columns.forEach(col => {
      if (!col.isDescription && !col.isAmount) {
        numericColumns++
        const cellValue = getCellStringValue(row.cells[col.id]).trim()
        if (cellValue !== '') {
          filledColumns++
        }
      }
    })
    
    // Only calculate if ALL numeric columns are filled
    if (filledColumns === numericColumns && numericColumns > 0) {
      columns.forEach(col => {
        if (!col.isDescription && !col.isAmount) {
          const cellValue = getCellStringValue(row.cells[col.id]).trim()
          if (cellValue !== '') {
            const numValue = parseNumericValue(cellValue)
            result *= numValue
          }
        }
      })
      return result.toFixed(2)
    }
    
    return ''
  }, [columns])

  // Calculate subtotal from all amount values
  const calculateSubtotal = useCallback((): string => {
    let total = 0
    rows.forEach(row => {
      const amountCol = columns.find(col => col.isAmount)
      if (amountCol && row.cells[amountCol.id]) {
        total += parseNumericValue(getCellStringValue(row.cells[amountCol.id]))
      }
    })
    return total.toFixed(2)
  }, [rows, columns])

  // Calculate tax amount
  const calculateTaxAmount = useCallback((): string => {
    if (!taxEnabled) return '0.00'
    const subtotal = Number.parseFloat(calculateSubtotal())
    const taxRate = parseNumericValue(taxPercentage) / 100
    return (subtotal * taxRate).toFixed(2)
  }, [taxEnabled, taxPercentage, calculateSubtotal])

  // Calculate discount amount
  const calculateDiscountAmount = useCallback((): string => {
    if (!discountEnabled) return '0.00'
    const subtotal = Number.parseFloat(calculateSubtotal())
    const discountRate = parseNumericValue(discountPercentage) / 100
    return (subtotal * discountRate).toFixed(2)
  }, [discountEnabled, discountPercentage, calculateSubtotal])

  // Calculate final total
  const calculateTotal = useCallback((): string => {
    const subtotal = Number.parseFloat(calculateSubtotal())
    const tax = Number.parseFloat(calculateTaxAmount())
    const discount = Number.parseFloat(calculateDiscountAmount())
    return (subtotal + tax - discount).toFixed(2) // Discount is subtracted
  }, [calculateSubtotal, calculateTaxAmount, calculateDiscountAmount])

  // Memoized values to avoid unnecessary recalculations
  const totals = useMemo(() => ({
    subtotal: calculateSubtotal(),
    tax: calculateTaxAmount(),
    discount: calculateDiscountAmount(),
    total: calculateTotal()
  }), [calculateSubtotal, calculateTaxAmount, calculateDiscountAmount, calculateTotal])

  return {
    calculateRowAmount,
    totals
  }
}