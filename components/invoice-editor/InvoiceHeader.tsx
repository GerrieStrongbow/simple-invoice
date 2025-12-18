import { formatDateForDisplay } from '@/lib/invoice-utils'
import React, { useMemo } from 'react'

const getInvoiceNumberPlaceholder = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  return `INV-${year}-${month}`
}

interface InvoiceHeaderProps {
  invoiceTitle: string
  onInvoiceTitleChange: (title: string) => void
  invoiceNumberLabel: string
  onInvoiceNumberLabelChange: (label: string) => void
  invoiceNumber: string
  onInvoiceNumberChange: (number: string) => void
  dateLabel: string
  onDateLabelChange: (label: string) => void
  dueDateLabel: string
  onDueDateLabelChange: (label: string) => void
  invoiceDate: string
  onInvoiceDateChange: (date: string) => void
  dueDate: string
  onDueDateChange: (date: string) => void
}

// Refined styling classes
const labelClasses = 'w-[110px] min-w-[100px] rounded-md border border-border bg-transparent px-3 py-1.5 text-sm font-medium text-ink-muted text-right outline-none transition hover:bg-paper-warm focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent-muted'
const inputClasses = 'w-[130px] min-w-[120px] rounded-md border border-border bg-paper-warm px-3 py-1.5 text-sm font-medium text-ink tabular-nums text-right outline-none transition focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent-muted'
// Note: Font size is set via inline style (titleStyle) for html2canvas PDF compatibility
const titleClasses = 'font-display tracking-tight text-ink bg-transparent border-none outline-none transition hover:text-ink-soft focus:text-ink'

// Explicit style for html2canvas compatibility (CSS variables don't work in canvas rendering)
const titleStyle: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'normal',
  fontSize: '48px',
  fontWeight: 400,
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  invoiceTitle,
  onInvoiceTitleChange,
  invoiceNumberLabel,
  onInvoiceNumberLabelChange,
  invoiceNumber,
  onInvoiceNumberChange,
  dateLabel,
  onDateLabelChange,
  dueDateLabel,
  onDueDateLabelChange,
  invoiceDate,
  onInvoiceDateChange,
  dueDate,
  onDueDateChange
}) => {
  const invoiceNumberPlaceholder = useMemo(() => getInvoiceNumberPlaceholder(), [])

  return (
    <div className="invoice-header mb-10 flex flex-col justify-between gap-8 border-b border-border pb-8 md:flex-row md:items-start">
      {/* Invoice Title - Elegant serif */}
      <div className="flex-1">
        <input
          type="text"
          aria-label="Invoice title"
          value={invoiceTitle}
          onChange={(e) => onInvoiceTitleChange(e.target.value)}
          className={titleClasses}
          style={titleStyle}
        />
        {/* Accent underline */}
        <div className="mt-3 h-0.5 w-12 bg-accent rounded-full" />
      </div>

      {/* Invoice Details - Right aligned */}
      <div className="invoice-details flex flex-col items-end gap-3 text-right">
        {/* Invoice Number */}
        <div className="flex items-center justify-end gap-2">
          <input
            type="text"
            aria-label="Invoice number label"
            value={invoiceNumberLabel}
            onChange={(e) => onInvoiceNumberLabelChange(e.target.value)}
            className={labelClasses}
          />
          <input
            type="text"
            aria-label="Invoice number"
            value={invoiceNumber}
            onChange={(e) => onInvoiceNumberChange(e.target.value)}
            placeholder={invoiceNumberPlaceholder}
            className={inputClasses}
          />
        </div>

        {/* Date */}
        <div className="flex items-center justify-end gap-2">
          <input
            type="text"
            aria-label="Date label"
            value={dateLabel}
            onChange={(e) => onDateLabelChange(e.target.value)}
            className={labelClasses}
          />
          <div className="relative inline-block">
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => onInvoiceDateChange(e.target.value)}
              className={inputClasses}
            />
            <span className="print-only pointer-events-none absolute right-3 top-1.5 text-sm font-medium text-ink">
              {formatDateForDisplay(invoiceDate)}
            </span>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-end gap-2">
          <input
            type="text"
            aria-label="Due date label"
            value={dueDateLabel}
            onChange={(e) => onDueDateLabelChange(e.target.value)}
            className={labelClasses}
          />
          <div className="relative inline-block">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              className={inputClasses}
            />
            <span className="print-only pointer-events-none absolute right-3 top-1.5 text-sm font-medium text-ink">
              {formatDateForDisplay(dueDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
