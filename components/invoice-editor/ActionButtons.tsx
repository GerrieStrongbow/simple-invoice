'use client'

import React, { useState } from 'react'
import { generateInvoicePdf, type InvoicePdfData } from '@/lib/typst/typst-pdf-generator'
import type { Column, Field, Row } from '@/lib/invoice-types'
import { formatDateForDisplay } from '@/lib/invoice-utils'

interface ActionButtonsProps {
  // Header data
  invoiceTitle: string
  invoiceNumber: string
  invoiceNumberLabel: string
  invoiceDate: string
  dateLabel: string
  dueDate: string
  dueDateLabel: string

  // Contact data
  fromTitle: string
  fromFields: Field[]
  toTitle: string
  toFields: Field[]

  // Payment data
  paymentTitle: string
  paymentFields: Field[]

  // Table data
  columns: Column[]
  rows: Row[]

  // Totals
  currencySymbol: string
  subtotal: string
  taxEnabled: boolean
  taxLabel: string
  taxPercentage: string
  tax: string
  discountEnabled: boolean
  discountLabel: string
  discountPercentage: string
  discount: string
  totalLabel: string
  total: string
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  invoiceTitle,
  invoiceNumber,
  invoiceNumberLabel,
  invoiceDate,
  dateLabel,
  dueDate,
  dueDateLabel,
  fromTitle,
  fromFields,
  toTitle,
  toFields,
  paymentTitle,
  paymentFields,
  columns,
  rows,
  currencySymbol,
  subtotal,
  taxEnabled,
  taxLabel,
  taxPercentage,
  tax,
  discountEnabled,
  discountLabel,
  discountPercentage,
  discount,
  totalLabel,
  total
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownloadPdf = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const pdfData: InvoicePdfData = {
        invoiceTitle,
        invoiceNumber,
        invoiceNumberLabel,
        invoiceDate: formatDateForDisplay(invoiceDate),
        dateLabel,
        dueDate: formatDateForDisplay(dueDate),
        dueDateLabel,
        fromTitle,
        fromFields,
        toTitle,
        toFields,
        paymentTitle,
        paymentFields,
        columns,
        rows,
        currencySymbol,
        subtotal,
        taxEnabled,
        taxLabel,
        taxPercentage,
        tax,
        discountEnabled,
        discountLabel,
        discountPercentage,
        discount,
        totalLabel,
        total
      }

      await generateInvoicePdf(pdfData)
    } catch (err) {
      console.error('PDF generation failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="no-print mt-10 flex flex-col items-center gap-4 border-t border-border pt-8">
      <div className="flex flex-wrap justify-center gap-4">
        {/* Print Button */}
        <button
          type="button"
          className="btn-press inline-flex items-center justify-center gap-3 rounded-lg border border-border bg-white px-6 py-3 text-sm font-medium text-ink shadow-sm transition-all hover:bg-paper-warm hover:shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-muted"
          onClick={() => globalThis.print()}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6,9 6,2 18,2 18,9" />
            <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print
        </button>

        {/* Download PDF Button */}
        <button
          type="button"
          className="btn-press inline-flex items-center justify-center gap-3 rounded-lg bg-ink px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-ink-soft hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-muted disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDownloadPdf}
          disabled={isGenerating}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {isGenerating ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      {/* Info text */}
      <p className="text-xs text-ink-muted">
        Download creates a high-quality PDF using Typst
      </p>
    </div>
  )
}
