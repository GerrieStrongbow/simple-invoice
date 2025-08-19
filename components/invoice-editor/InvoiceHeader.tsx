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
  const inputStyles = {
    backgroundColor: '#f8fafc',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '2px solid #e2e8f0',
    minWidth: '130px',
    width: '130px',
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    textAlign: 'right' as const,
    transition: 'all 0.2s ease',
    color: '#1f2937'
  }

  const labelStyles = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    outline: 'none',
    cursor: 'text',
    padding: '6px 10px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: '#f8fafc',
    border: '2px solid #e2e8f0',
    minWidth: '110px',
    width: '110px',
    display: 'inline-block',
    textAlign: 'right' as const,
    whiteSpace: 'nowrap' as const
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSpanElement>) => {
    e.target.style.backgroundColor = '#ffffff'
    e.target.style.borderColor = '#667eea'
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSpanElement>) => {
    e.target.style.backgroundColor = '#f8fafc'
    e.target.style.borderColor = '#e2e8f0'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="header" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '40px',
      paddingBottom: '30px',
      borderBottom: '3px solid #f1f3f5'
    }}>
      <div>
        <h1 className="invoice-title" style={{
          fontSize: '36px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          letterSpacing: '-0.02em',
          minWidth: '200px',
          display: 'inline-block',
          position: 'relative'
        }}>
          <span
            role="textbox"
            aria-label="Invoice title"
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            style={{
              outline: 'none',
              cursor: 'text',
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              border: '2px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            onFocus={handleFocus}
            onBlur={(e) => {
              onInvoiceTitleChange(e.target.textContent || 'INVOICE')
              handleBlur(e)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
          >
            {invoiceTitle}
          </span>
        </h1>
      </div>
      
      <div className="invoice-details" style={{ textAlign: 'right' }}>
        <div style={{ 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <span
            role="textbox"
            aria-label="Invoice number label"
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            style={labelStyles}
            onFocus={handleFocus}
            onBlur={(e) => {
              onInvoiceNumberLabelChange(e.target.textContent || 'Invoice #:')
              handleBlur(e)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
          >
            {invoiceNumberLabel}
          </span>
          <input
            type="text"
            placeholder="INV-2025-08"
            style={inputStyles}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        
        <div style={{ 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <span
            role="textbox"
            aria-label="Date label"
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            style={labelStyles}
            onFocus={handleFocus}
            onBlur={(e) => {
              onDateLabelChange(e.target.textContent || 'Issue Date:')
              handleBlur(e)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
          >
            {dateLabel}
          </span> 
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => onInvoiceDateChange(e.target.value)}
              style={inputStyles}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <span 
              style={{
                position: 'absolute',
                right: '16px',
                top: '10px',
                pointerEvents: 'none',
                fontSize: '14px',
                color: '#1f2937'
              }}
              className="print-only"
            >
              {formatDateForDisplay(invoiceDate)}
            </span>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <span
            role="textbox"
            aria-label="Due date label"
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            style={labelStyles}
            onFocus={handleFocus}
            onBlur={(e) => {
              onDueDateLabelChange(e.target.textContent || 'Due Date:')
              handleBlur(e)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
          >
            {dueDateLabel}
          </span> 
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              style={inputStyles}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <span 
              style={{
                position: 'absolute',
                right: '16px',
                top: '10px',
                pointerEvents: 'none',
                fontSize: '14px',
                color: '#1f2937'
              }}
              className="print-only"
            >
              {formatDateForDisplay(dueDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}