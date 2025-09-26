'use client'

import { useEffect, useRef } from 'react'
import { useInvoiceCalculations } from '../hooks/useInvoiceCalculations'
import { useInvoiceState } from '../hooks/useInvoiceState'
import { useTableManagement } from '../hooks/useTableManagement'
import { ActionButtons } from './invoice-editor/ActionButtons'
import { ContactDetails } from './invoice-editor/ContactDetails'
import CurrencySelector from './invoice-editor/CurrencySelector'
import { InvoiceHeader } from './invoice-editor/InvoiceHeader'
import { PaymentDetails } from './invoice-editor/PaymentDetails'
import { ServicesTable } from './invoice-editor/ServicesTable'
import { TotalsSection } from './invoice-editor/TotalsSection'

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
          {/* Services Table */}
          <ServicesTable
            columns={columns}
            rows={rows}
            onColumnsChange={setColumns}
            onRowsChange={setRows}
            onCellUpdate={handleCellUpdate}
          />

          {/* Currency Selector */}
          <div className="currency-section no-print mx-auto mt-5 mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <span className="text-[15px] font-semibold text-slate-700">Currency:</span>
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
          {/* Action Buttons */}
          <ActionButtons />
        </div>
      </div>

    </div>
  )
}
