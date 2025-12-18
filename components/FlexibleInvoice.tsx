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
    // Loaded record tracking
    loadedBusinessProfile,
    setLoadedBusinessProfile,
    loadedClient,
    setLoadedClient,
    loadedBanking,
    setLoadedBanking,
    // Tax and discount
    taxEnabled,
    setTaxEnabled,
    taxPercentage,
    setTaxPercentage,
    taxLabel,
    setTaxLabel,
    discountEnabled,
    setDiscountEnabled,
    discountPercentage,
    setDiscountPercentage,
    discountLabel,
    setDiscountLabel,
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
        if (calculatedAmount !== (row.cells as Record<string, string | number>)[amountCol.id]) {
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
      return amountCol && (row.cells as Record<string, string | number>)[amountCol.id] !== (rows[index].cells as Record<string, string | number>)[amountCol.id]
    })

    if (hasChanges) {
      setRows(updatedRows)
    }
  }, [rows, columns, calculateRowAmount, setRows])

  const handleCellUpdate = (rowId: string, columnId: string, value: string | number) => {
    updateCell(rowId, columnId, value, rows, setRows)
  }

  return (
    <div className="min-h-screen bg-paper px-6 py-12 text-[14px] sm:px-10">
      {/* Invoice Card Container */}
      <div
        ref={invoiceRef}
        className="invoice-container invoice-card paper-texture mx-auto w-full max-w-4xl rounded-lg print:max-w-[8.27in] print:w-[8.27in] print:rounded-none print:shadow-none print:border-none"
      >
        <div className="relative p-8 sm:p-12">

          {/* Invoice Header */}
          <div className="animate-fade-up">
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
          </div>

          {/* From/To Details */}
          <div className="animate-fade-up animate-delay-1">
            <ContactDetails
              fromTitle={fromTitle}
              onFromTitleChange={setFromTitle}
              fromFields={fromFields}
              onFromFieldsChange={setFromFields}
              toTitle={toTitle}
              onToTitleChange={setToTitle}
              toFields={toFields}
              onToFieldsChange={setToFields}
              loadedBusinessProfile={loadedBusinessProfile}
              onLoadedBusinessProfileChange={setLoadedBusinessProfile}
              loadedClient={loadedClient}
              onLoadedClientChange={setLoadedClient}
            />
          </div>

          {/* Services Table */}
          <div className="animate-fade-up animate-delay-2">
            <ServicesTable
              columns={columns}
              rows={rows}
              onColumnsChange={setColumns}
              onRowsChange={setRows}
              onCellUpdate={handleCellUpdate}
            />
          </div>

          {/* Currency Selector */}
          <div className="animate-fade-up animate-delay-3 currency-section no-print mx-auto mt-6 mb-6 flex items-center gap-3 rounded-lg border border-border bg-paper-warm px-4 py-3">
            <span className="text-sm font-medium text-ink-soft">Currency:</span>
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
          <div className="animate-fade-up animate-delay-4">
            <TotalsSection
              subtotal={totals.subtotal}
              tax={totals.tax}
              discount={totals.discount}
              total={totals.total}
              taxEnabled={taxEnabled}
              taxPercentage={taxPercentage}
              taxLabel={taxLabel}
              discountEnabled={discountEnabled}
              discountPercentage={discountPercentage}
              discountLabel={discountLabel}
              currencySymbol={currencySymbol}
              totalLabel={totalLabel}
              onTaxToggle={setTaxEnabled}
              onTaxPercentageChange={setTaxPercentage}
              onTaxLabelChange={setTaxLabel}
              onDiscountToggle={setDiscountEnabled}
              onDiscountPercentageChange={setDiscountPercentage}
              onDiscountLabelChange={setDiscountLabel}
              onTotalLabelChange={setTotalLabel}
            />
          </div>

          {/* Bank Details */}
          <div className="animate-fade-up animate-delay-5">
            <PaymentDetails
              paymentTitle={paymentTitle}
              onPaymentTitleChange={setPaymentTitle}
              paymentFields={paymentFields}
              onPaymentFieldsChange={setPaymentFields}
              loadedBanking={loadedBanking}
              onLoadedBankingChange={setLoadedBanking}
            />
          </div>

          {/* Action Buttons */}
          <ActionButtons />
        </div>
      </div>
    </div>
  )
}
