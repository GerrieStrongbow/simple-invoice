import React from 'react'
import { formatDateForDisplay } from '@/lib/invoice-utils'

interface InvoiceHeaderProps {
  invoiceTitle: string
  onInvoiceTitleChange: (title: string) => void
  invoiceNumberLabel: string
  onInvoiceNumberLabelChange: (label: string) => void
  dateLabel: string
  onDateLabelChange: (label: string) => void
  dueDateLabel: string
  onDueDateLabelChange: (label: string) => void
  invoiceDate: string
  onInvoiceDateChange: (date: string) => void
  dueDate: string
  onDueDateChange: (date: string) => void
}

const labelClasses = 'w-[120px] min-w-[110px] rounded-lg border-2 border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 text-right outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100'
const inputClasses = 'w-[130px] min-w-[130px] rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 text-right outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100'
const titleClasses = 'w-full max-w-[260px] rounded-lg border-2 border-slate-200 bg-slate-100 px-4 py-2 text-4xl font-extrabold leading-tight text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100'

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  invoiceTitle,
  onInvoiceTitleChange,
  invoiceNumberLabel,
  onInvoiceNumberLabelChange,
  dateLabel,
  onDateLabelChange,
  dueDateLabel,
  onDueDateLabelChange,
  invoiceDate,
  onInvoiceDateChange,
  dueDate,
  onDueDateChange
}) => {
  return (
    <div className="invoice-header mb-10 flex flex-col justify-between gap-6 border-b-4 border-slate-100 pb-8 md:flex-row md:items-start">
      <div>
        <h1 className="text-4xl font-extrabold leading-tight">
          <input
            type="text"
            aria-label="Invoice title"
            value={invoiceTitle}
            onChange={(e) => onInvoiceTitleChange(e.target.value)}
            className={titleClasses}
          />
        </h1>
      </div>

      <div className="invoice-details flex flex-col items-end gap-4 text-right">
        <div className="flex items-center justify-end gap-3">
          <input
            type="text"
            aria-label="Invoice number label"
            value={invoiceNumberLabel}
            onChange={(e) => onInvoiceNumberLabelChange(e.target.value)}
            className={labelClasses}
          />
          <input
            type="text"
            placeholder="INV-2025-08"
            className={inputClasses}
          />
        </div>

        <div className="flex items-center justify-end gap-3">
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
            <span className="print-only pointer-events-none absolute right-4 top-2 text-sm font-medium text-slate-700">
              {formatDateForDisplay(invoiceDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
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
            <span className="print-only pointer-events-none absolute right-4 top-2 text-sm font-medium text-slate-700">
              {formatDateForDisplay(dueDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
