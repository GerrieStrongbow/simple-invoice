import { useMemo, useCallback } from 'react'
import { Column, Row } from '@/lib/invoice-types'
import { parseNumericValue } from '@/lib/invoice-utils'

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
    let hasValues = false
    
    columns.forEach(col => {
      if (!col.isDescription && !col.isAmount && row.cells[col.id]) {
        const numValue = parseNumericValue(String(row.cells[col.id]))
        if (numValue !== 0) {
          result *= numValue
          hasValues = true
        }
      }
    })
    
    return hasValues ? result.toFixed(2) : ''
  }, [columns])

  // Calculate subtotal from all amount values
  const calculateSubtotal = useCallback((): string => {
    let total = 0
    rows.forEach(row => {
      const amountCol = columns.find(col => col.isAmount)
      if (amountCol && row.cells[amountCol.id]) {
        total += parseNumericValue(String(row.cells[amountCol.id]))
      }
    })
    return total.toFixed(2)
  }, [rows, columns])

  // Calculate tax amount
  const calculateTaxAmount = useCallback((): string => {
    if (!taxEnabled) return '0.00'
    const subtotal = parseFloat(calculateSubtotal())
    const taxRate = parseNumericValue(taxPercentage) / 100
    return (subtotal * taxRate).toFixed(2)
  }, [taxEnabled, taxPercentage, calculateSubtotal])

  // Calculate discount amount
  const calculateDiscountAmount = useCallback((): string => {
    if (!discountEnabled) return '0.00'
    const subtotal = parseFloat(calculateSubtotal())
    const discountRate = parseNumericValue(discountPercentage) / 100
    return (subtotal * discountRate).toFixed(2)
  }, [discountEnabled, discountPercentage, calculateSubtotal])

  // Calculate final total
  const calculateTotal = useCallback((): string => {
    const subtotal = parseFloat(calculateSubtotal())
    const tax = parseFloat(calculateTaxAmount())
    const discount = parseFloat(calculateDiscountAmount())
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