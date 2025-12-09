'use client'

import React, { useMemo, useState, useRef } from 'react'

const getInvoiceNumberPlaceholder = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  return `INV-${year}-${month}`
}

interface EditableSpanProps {
  children: React.ReactNode
  className?: string
  contentEditable?: boolean
}

const baseEditableClasses = 'inline-flex min-w-[100px] items-center justify-start rounded-sm border border-dashed border-amber-400 bg-amber-100 px-2 py-1 text-sm font-medium text-slate-800'

const extractTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('')
  }
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode }
    if (props.children) {
      return extractTextFromChildren(props.children)
    }
  }
  return ''
}

const EditableSpan: React.FC<EditableSpanProps> = ({
  children,
  className = '',
  contentEditable = true
}) => {
  const initialValue = useMemo(() => {
    return extractTextFromChildren(children)
  }, [children])

  if (!contentEditable) {
    return (
      <span className={`${baseEditableClasses} ${className}`}>
        {initialValue}
      </span>
    )
  }

  return (
    <input
      type="text"
      defaultValue={initialValue}
      className={`${baseEditableClasses} ${className}`}
    />
  )
}

const INITIAL_ROW_IDS = ['row-1', 'row-2', 'row-3'] as const

export default function SimpleInvoice() {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [showNotes, setShowNotes] = useState(true)
  const [showLogo, setShowLogo] = useState(false)

  const handlePrint = () => {
    globalThis.print()
  }

  return (
    <div className="min-h-screen bg-slate-100 px-5 py-10 text-[11pt] font-inter">
      <div
        ref={invoiceRef}
        className="invoice-container mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg ring-1 ring-slate-200 print:rounded-none print:shadow-none"
      >
        <header className="mb-8 flex flex-col gap-6 border-b-2 border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-5">
            <h1 className="text-3xl font-bold text-slate-800">INVOICE</h1>
            {showLogo && (
              <button
                type="button"
                className="no-print inline-flex h-20 w-24 items-center justify-center rounded-sm border border-dashed border-slate-300 bg-slate-50 text-xs font-semibold text-slate-400"
              >
                Click to add logo
              </button>
            )}
          </div>

          <div className="space-y-2 text-right text-slate-600">
            <div className="flex items-center justify-end gap-2">
              <strong>Invoice #:</strong>
              <EditableSpan className="min-w-[120px]" contentEditable>
                {getInvoiceNumberPlaceholder()}
              </EditableSpan>
            </div>
            <div className="flex items-center justify-end gap-2">
              <strong>Date:</strong>
              <EditableSpan className="min-w-[120px]" contentEditable>
                [DATE]
              </EditableSpan>
            </div>
            <div className="flex items-center justify-end gap-2">
              <strong>Due Date:</strong>
              <EditableSpan className="min-w-[120px]" contentEditable>
                [DUE DATE]
              </EditableSpan>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">From:</h3>
            <textarea
              defaultValue={`T/A Gerhard Bekker\n14 Marina Rd\nDie Boord\nStellenbosch\nSouth Africa\n\nEmail: gerhard.bekker@outlook.com\nMobile: (+27) 063 651 9694`}
              className="min-h-[120px] w-full resize-y rounded-sm border border-dashed border-amber-400 bg-amber-50 px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">To:</h3>
            <textarea
              defaultValue={`Empire Digital Media Ltd (trading as 1Digit)\nCompany Registration #: 08537519\nUnit 11\nHove Business Centre Fonthill Road\nHove, East Sussex, BN3 6HA\nUnited Kingdom\n\nEmail: accounts@1digit.co.uk`}
              className="min-h-[120px] w-full resize-y rounded-sm border border-dashed border-amber-400 bg-amber-50 px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
            />
          </div>
        </section>

        <section className="mb-8">
          <table className="w-full border-collapse text-slate-700">
            <thead>
              <tr className="bg-slate-50 text-left text-sm font-semibold text-slate-800">
                <th className="w-[60%] border-b border-slate-200 px-4 py-3">
                  <EditableSpan className="w-full" contentEditable>Description</EditableSpan>
                </th>
                <th className="w-[15%] border-b border-slate-200 px-4 py-3 text-center">
                  <EditableSpan className="w-full text-center" contentEditable>Days</EditableSpan>
                </th>
                <th className="w-[15%] border-b border-slate-200 px-4 py-3 text-right">
                  <EditableSpan className="w-full text-right" contentEditable>Rate (ZAR)</EditableSpan>
                </th>
                <th className="w-[10%] border-b border-slate-200 px-4 py-3 text-right">
                  <EditableSpan className="w-full text-right" contentEditable>Amount (ZAR)</EditableSpan>
                </th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_ROW_IDS.map((rowId) => (
                <tr key={rowId} className="border-b border-slate-200">
                  <td className="px-4 py-3">
                    <textarea
                      defaultValue="Item Name Description of services provided"
                      className="w-full resize-y rounded-sm border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <EditableSpan contentEditable className="justify-center">1</EditableSpan>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <EditableSpan contentEditable className="justify-end">500.00</EditableSpan>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <EditableSpan contentEditable className="justify-end">500.00</EditableSpan>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mb-8 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span>Subtotal:</span>
            <EditableSpan contentEditable className="justify-end">R[SUBTOTAL]</EditableSpan>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax (if applicable):</span>
            <EditableSpan contentEditable className="justify-end">R0.00</EditableSpan>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-semibold text-slate-800">
            <span>Total Amount Due:</span>
            <EditableSpan contentEditable className="justify-end">R[TOTAL]</EditableSpan>
          </div>
        </section>

        <section className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-700">Payment Details:</h4>
          <textarea
            defaultValue={`Account Name: GERHARD MULLER BEKKER\nBank: ABSA\nAccount Number: 4120 7672 37\nBranch Code: 632005\nSWIFT Code: ABSAZAJJ`}
            className="w-full resize-y rounded-sm border border-dashed border-amber-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
          />
        </section>

        {showNotes && (
          <section className="mb-8">
            <h4 className="mb-3 text-sm font-semibold text-slate-700">Notes:</h4>
            <textarea
              defaultValue="Notes - any relevant information not covered, additional terms and conditions"
              className="min-h-[60px] w-full resize-y rounded-sm border border-dashed border-amber-400 bg-amber-50 px-3 py-2 text-sm text-slate-700 focus:border-amber-500 focus:outline-hidden focus:ring-2 focus:ring-amber-200"
            />
          </section>
        )}

        <div className="no-print mt-8 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-hidden focus:ring-4 focus:ring-indigo-200"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={() => setShowNotes((prev) => !prev)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </button>
          <button
            onClick={() => setShowLogo((prev) => !prev)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            {showLogo ? 'Remove Logo Placeholder' : 'Show Logo Placeholder'}
          </button>
        </div>
      </div>
    </div>
  )
}
