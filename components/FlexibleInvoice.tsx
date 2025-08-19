'use client'

import React, { useRef, useEffect } from 'react'
import CurrencySelector from './invoice-editor/CurrencySelector'
import { InvoiceHeader } from './invoice-editor/InvoiceHeader'
import { ContactDetails } from './invoice-editor/ContactDetails'
import { ServicesTable } from './invoice-editor/ServicesTable'
import { TotalsSection } from './invoice-editor/TotalsSection'
import { PaymentDetails } from './invoice-editor/PaymentDetails'
import { ActionButtons } from './invoice-editor/ActionButtons'
import { useInvoiceState } from '../hooks/useInvoiceState'
import { useInvoiceCalculations } from '../hooks/useInvoiceCalculations'
import { useTableManagement } from '../hooks/useTableManagement'

export default function FlexibleInvoice() {
  const invoiceRef = useRef<HTMLDivElement>(null)
  
  // All state management
  const {
    fromFields,
    setFromFields,
    toFields,
    setToFields,
    paymentFields,
    setPaymentFields,
    taxEnabled,
    setTaxEnabled,
    taxPercentage,
    setTaxPercentage,
    discountEnabled,
    setDiscountEnabled,
    discountPercentage,
    setDiscountPercentage,
    currencyCode,
    setCurrencyCode,
    currencySymbol,
    setCurrencySymbol,
    invoiceDate,
    setInvoiceDate,
    dueDate,
    setDueDate,
    invoiceTitle,
    setInvoiceTitle,
    fromTitle,
    setFromTitle,
    toTitle,
    setToTitle,
    paymentTitle,
    setPaymentTitle,
    invoiceNumberLabel,
    setInvoiceNumberLabel,
    dateLabel,
    setDateLabel,
    dueDateLabel,
    setDueDateLabel,
    totalLabel,
    setTotalLabel,
    columns,
    setColumns,
    rows,
    setRows
  } = useInvoiceState()

  // Calculations
  const { calculateRowAmount, totals } = useInvoiceCalculations({
    columns,
    rows,
    taxEnabled,
    taxPercentage,
    discountEnabled,
    discountPercentage
  })

  // Table management
  const { updateCell } = useTableManagement()

  // Update amounts when numeric values change
  useEffect(() => {
    const updatedRows = rows.map(row => {
      const amountCol = columns.find(col => col.isAmount)
      if (amountCol) {
        const calculatedAmount = calculateRowAmount(row)
        if (calculatedAmount !== (row.cells as any)[amountCol.id]) {
          return {
            ...row,
            cells: {
              ...row.cells,
              [amountCol.id]: calculatedAmount
            }
          }
        }
      }
      return row
    })
    
    const hasChanges = updatedRows.some((row, index) => {
      const amountCol = columns.find(col => col.isAmount)
      return amountCol && (row.cells as any)[amountCol.id] !== (rows[index].cells as any)[amountCol.id]
    })
    
    if (hasChanges) {
      setRows(updatedRows)
    }
  }, [rows, columns, calculateRowAmount, setRows])

  const handleCellUpdate = (rowId: string, columnId: string, value: any) => {
    updateCell(rowId, columnId, value, rows, setRows)
  }

  return (
    <div style={{ 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: '14px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div ref={invoiceRef} className="invoice-container" style={{
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '40px' }}>
          
          {/* Invoice Header */}
          <InvoiceHeader
            invoiceTitle={invoiceTitle}
            onInvoiceTitleChange={setInvoiceTitle}
            invoiceNumberLabel={invoiceNumberLabel}
            onInvoiceNumberLabelChange={setInvoiceNumberLabel}
            dateLabel={dateLabel}
            onDateLabelChange={setDateLabel}
            dueDateLabel={dueDateLabel}
            onDueDateLabelChange={setDueDateLabel}
            invoiceDate={invoiceDate}
            onInvoiceDateChange={setInvoiceDate}
            dueDate={dueDate}
            onDueDateChange={setDueDate}
          />

          {/* From/To Details */}
          <ContactDetails
            fromTitle={fromTitle}
            onFromTitleChange={setFromTitle}
            fromFields={fromFields}
            onFromFieldsChange={setFromFields}
            toTitle={toTitle}
            onToTitleChange={setToTitle}
            toFields={toFields}
            onToFieldsChange={setToFields}
          />

          {/* Services Table */}
          <ServicesTable
            columns={columns}
            rows={rows}
            onColumnsChange={setColumns}
            onRowsChange={setRows}
            onCellUpdate={handleCellUpdate}
          />

          {/* Currency Selector */}
          <div className="currency-section no-print" style={{
            marginTop: '20px',
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#374151'
            }}>Currency:</span>
            <CurrencySelector
              value={currencyCode}
              symbol={currencySymbol}
              onChange={(code, symbol) => {
                setCurrencyCode(code)
                setCurrencySymbol(symbol)
              }}
            />
          </div>

          {/* Totals Section */}
          <TotalsSection
            subtotal={totals.subtotal}
            tax={totals.tax}
            discount={totals.discount}
            total={totals.total}
            taxEnabled={taxEnabled}
            taxPercentage={taxPercentage}
            discountEnabled={discountEnabled}
            discountPercentage={discountPercentage}
            currencySymbol={currencySymbol}
            totalLabel={totalLabel}
            onTaxToggle={setTaxEnabled}
            onTaxPercentageChange={setTaxPercentage}
            onDiscountToggle={setDiscountEnabled}
            onDiscountPercentageChange={setDiscountPercentage}
            onTotalLabelChange={setTotalLabel}
          />

          {/* Bank Details */}
          <PaymentDetails
            paymentTitle={paymentTitle}
            onPaymentTitleChange={setPaymentTitle}
            paymentFields={paymentFields}
            onPaymentFieldsChange={setPaymentFields}
          />

          {/* Action Buttons */}
          <ActionButtons />
        </div>
      </div>

      <style>{`
        .print-only {
          display: none;
        }
        
        /* Hover zone indicators for column addition */
        thead tr th:hover {
          position: relative;
        }
        
        thead tr th:not(:first-child)::before {
          content: '';
          position: absolute;
          left: -2px;
          top: 20%;
          bottom: 20%;
          width: 4px;
          background: transparent;
          transition: background 0.2s ease;
          pointer-events: none;
        }
        
        thead tr th:not(:first-child):hover::before {
          background: linear-gradient(to bottom, transparent, #0284c7, transparent);
          opacity: 0.3;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Hide everything initially */
          * {
            visibility: hidden;
          }
          
          /* Show only the invoice container and its contents */
          .invoice-container,
          .invoice-container * {
            visibility: visible;
          }
          
          /* Style the invoice container for print */
          .invoice-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 20px !important;
            margin: 0 !important;
            max-width: none !important;
          }
          
          /* Hide non-printable elements */
          .no-print,
          header,
          footer,
          nav,
          button,
          [role="button"] {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Show print-only elements */
          .print-only {
            display: inline !important;
            visibility: visible !important;
          }
          
          /* Clean up input styling for print */
          input[type="text"] {
            background: transparent !important;
            border: none !important;
            padding: 2px 4px !important;
            outline: none !important;
            box-shadow: none !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            color: inherit !important;
          }
          
          /* Hide all editable borders in print */
          span[contenteditable] {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            outline: none !important;
            box-shadow: none !important;
          }
          
          /* Hide date inputs completely and show formatted dates instead */
          input[type="date"] {
            color: transparent !important;
            background: transparent !important;
            border: none !important;
            padding: 2px 4px !important;
            outline: none !important;
            box-shadow: none !important;
          }
          
          /* Hide date picker elements */
          input[type="date"]::-webkit-calendar-picker-indicator {
            display: none !important;
          }
          
          input[type="date"]::-webkit-inner-spin-button,
          input[type="date"]::-webkit-outer-spin-button {
            display: none !important;
          }
          
          /* Preserve card backgrounds with compact padding */
          .bank-details {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            padding: 12px !important;
            margin-top: 15px !important;
          }
          
          /* Preserve table styling with optimized spacing */
          .services-table th {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
            padding: 10px !important;
          }
          
          .services-table td {
            padding: 8px 10px !important;
          }
          
          /* Clean table styling */
          .services-table {
            width: 100% !important;
            margin: 0 !important;
          }
          
          /* Fix table width to match other sections */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          
          /* Optimize font sizes and line spacing for print */
          .invoice-container {
            font-size: 16px !important;
            line-height: 1.35 !important;
          }
          
          .invoice-container h1 {
            font-size: 34px !important;
            margin: 0 !important;
            line-height: 1 !important;
          }
          
          .invoice-container h3 {
            font-size: 19px !important;
            margin: 0 0 10px 0 !important;
            line-height: 1.2 !important;
          }
          
          .invoice-container h4 {
            font-size: 17px !important;
            margin: 0 0 8px 0 !important;
            line-height: 1.2 !important;
          }
          
          /* Ensure all text elements use optimized spacing */
          .invoice-container input,
          .invoice-container span,
          .invoice-container div,
          .invoice-container td,
          .invoice-container th {
            font-size: inherit !important;
            line-height: 1.2 !important;
          }
          
          /* Remove grey boxes from totals */
          .total-section span[style*="background"],
          .total-row span[style*="backgroundColor"] {
            background: transparent !important;
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
          }
          
          /* Ensure totals section has optimized spacing */
          .total-section {
            margin-top: 20px !important;
            padding-top: 15px !important;
            border-top: 2px solid #e9ecef !important;
          }
          
          /* Optimize total rows spacing */
          .total-row {
            margin-bottom: 6px !important;
          }
          
          /* Fix page break issues */
          .invoice-container {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Prevent orphan elements */
          .total-section,
          .bank-details {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Ensure proper page margins and prevent blank pages */
          @page {
            margin: 0.6in !important;
            size: A4 !important;
          }
        }
      `}</style>
    </div>
  )
}