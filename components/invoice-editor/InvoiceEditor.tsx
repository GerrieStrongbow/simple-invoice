'use client'

import { useState, useEffect, useRef } from 'react'
import EditableField from './EditableField'
import EditableFieldSection from './EditableFieldSection'
import CurrencySelector from './CurrencySelector'
import DatePicker from './DatePicker'
import EnhancedTable from './EnhancedTable'
import { InvoiceData } from '../../lib/types'
import { InvoiceCalculator } from '../../lib/invoice-calculator'
import { PDFGenerator } from '../../lib/pdf-generator'

const getCurrentDate = () => {
  const today = new Date()
  return today.toLocaleDateString('en-GB')
}

const getCurrentInvoiceNumber = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  return `INV-${year}-${month}`
}

const initialInvoiceData: InvoiceData = {
  header: {
    title: 'INVOICE',
    invoiceNumber: getCurrentInvoiceNumber(),
    date: getCurrentDate(),
    dueDate: '',
  },
  from: {
    label: 'From:',
    fields: [
      { id: '1', label: '', value: 'Business Name', placeholder: 'Business name' },
      { id: '2', label: '', value: 'Street Address', placeholder: 'Street address' },
      { id: '3', label: '', value: 'City, State/Province', placeholder: 'City, state/province' },
      { id: '4', label: '', value: 'Country', placeholder: 'Country' },
      { id: '5', label: '', value: 'name@business.com', placeholder: 'Email address' },
      { id: '6', label: '', value: '(123) 456-789', placeholder: 'Phone number' },
    ],
  },
  to: {
    label: 'To:',
    fields: [
      { id: '1', label: '', value: 'Client Name', placeholder: 'Client name' },
      { id: '2', label: '', value: 'Street Address', placeholder: 'Street address' },
      { id: '3', label: '', value: 'City, State/Province', placeholder: 'City, state/province' },
      { id: '4', label: '', value: 'Country', placeholder: 'Country' },
      { id: '5', label: '', value: 'name@client.com', placeholder: 'Email address' },
    ],
  },
  table: {
    columns: [
      { id: '1', name: 'Description', type: 'text' },
      { id: '2', name: 'Quantity', type: 'number' },
      { id: '3', name: 'Rate', type: 'number' },
      { id: '4', name: 'Amount', type: 'number' },
    ],
    rows: [
      { 
        id: '1', 
        cells: { 
          '1': 'Item Name Description of services provided', 
          '2': '1', 
          '3': '500.00', 
          '4': '500.00' 
        } 
      },
      { 
        id: '2', 
        cells: { 
          '1': 'Item Name Description of services provided', 
          '2': '1', 
          '3': '500.00', 
          '4': '200.00' 
        } 
      },
      { 
        id: '3', 
        cells: { 
          '1': 'Item Name Description of services provided', 
          '2': '1', 
          '3': '500.00', 
          '4': '300.00' 
        } 
      },
    ],
  },
  totals: {
    subtotal: 0,
    tax: 0,
    taxRate: 0,
    total: 0,
    customRows: [],
  },
  footer: {
    paymentTerms: '',
    notes: 'Notes - any relevant information not covered, additional terms and conditions',
  },
  paymentDetails: {
    label: 'Payment Details:',
    fields: [
      { id: '1', label: '', value: 'Account Name: YOUR FULL NAME', placeholder: 'Account Name: Enter account holder name' },
      { id: '2', label: '', value: 'Bank: YOUR BANK', placeholder: 'Bank: Enter bank name' },
      { id: '3', label: '', value: 'Account Number: 0000 0000 00', placeholder: 'Account Number: Enter account number' },
      { id: '4', label: '', value: 'Branch Code: 000000', placeholder: 'Branch Code: Enter branch code' },
      { id: '5', label: '', value: 'SWIFT Code: BANKZAJJ', placeholder: 'SWIFT Code: Enter SWIFT code' },
    ],
  },
  settings: {
    currency: 'ZAR',
    currencySymbol: 'R',
    accentColor: '#2c3e50',
    fontSize: 'medium',
  },
}

export default function InvoiceEditor() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialInvoiceData)
  const [templates, setTemplates] = useState<string[]>([])
  const [taxRate, setTaxRate] = useState<number>(0)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('invoiceData')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        // Check if it's old format and migrate
        if (parsedData.from && typeof parsedData.from.content === 'string') {
          console.log('Migrating old invoice data format...')
          // Clear old format and use default
          localStorage.removeItem('invoiceData')
          setInvoiceData(initialInvoiceData)
        } else if (parsedData.from && parsedData.to && parsedData.paymentDetails) {
          // New format - use it
          setInvoiceData(parsedData)
        } else {
          // Invalid format - use default
          setInvoiceData(initialInvoiceData)
        }
      } catch (error) {
        console.error('Failed to load saved invoice data:', error)
        setInvoiceData(initialInvoiceData)
      }
    }
    
    // Load saved templates
    const savedTemplates = localStorage.getItem('invoiceTemplates')
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates))
      } catch (error) {
        console.error('Failed to load saved templates:', error)
        setTemplates([])
      }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('invoiceData', JSON.stringify(invoiceData))
    }, 500)
    return () => clearTimeout(timer)
  }, [invoiceData])

  const updateHeader = (field: keyof InvoiceData['header'], value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      header: { ...prev.header, [field]: value }
    }))
  }

  const updateSection = (sectionName: 'from' | 'to' | 'paymentDetails', section: typeof invoiceData.from) => {
    setInvoiceData(prev => ({
      ...prev,
      [sectionName]: section
    }))
  }

  const updateCurrency = (currency: string, symbol: string) => {
    setInvoiceData(prev => ({
      ...prev,
      settings: { ...prev.settings, currency, currencySymbol: symbol }
    }))
  }

  const updateFooter = (field: keyof InvoiceData['footer'], value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      footer: { ...prev.footer, [field]: value }
    }))
  }

  const saveTemplate = () => {
    const templateName = prompt('Enter template name:')
    if (templateName) {
      const newTemplates = [...templates, templateName]
      setTemplates(newTemplates)
      localStorage.setItem('invoiceTemplates', JSON.stringify(newTemplates))
      localStorage.setItem(`template_${templateName}`, JSON.stringify(invoiceData))
      alert('Template saved successfully!')
    }
  }

  const loadTemplate = () => {
    if (templates.length === 0) {
      alert('No saved templates found! Save your current invoice as a template first.')
      return
    }
    
    const templateList = templates.map((t, i) => `${i + 1}. ${t}`).join('\n')
    const instruction = `Choose a template by entering its name exactly:\n\n${templateList}\n\nEnter template name:`
    
    const templateName = prompt(instruction)
    if (templateName && templates.includes(templateName)) {
      const template = localStorage.getItem(`template_${templateName}`)
      if (template) {
        try {
          const templateData = JSON.parse(template)
          // Migrate old template format if needed
          if (templateData.from && typeof templateData.from.content === 'string') {
            // Handle old format - convert to new format
            setInvoiceData({...initialInvoiceData, ...templateData})
          } else {
            setInvoiceData(templateData)
          }
          alert(`Template "${templateName}" loaded successfully!`)
        } catch (error) {
          console.error('Failed to load template:', error)
          alert('Failed to load template - template may be corrupted')
        }
      }
    } else if (templateName) {
      alert(`Template "${templateName}" not found. Please check the spelling.`)
    }
  }

  // Calculate totals automatically
  const calculator = new InvoiceCalculator(invoiceData.table.columns, invoiceData.table.rows)
  const calculations = calculator.calculateTotals(taxRate)

  // PDF Generation
  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) {
      setPdfError('Invoice content not found. Please refresh and try again.')
      return
    }

    setPdfError(null)
    setIsGeneratingPDF(true)

    try {
      const rect = invoiceRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        throw new Error('Invoice element has zero dimensions')
      }

      const pdfGenerator = new PDFGenerator(invoiceData)
      await pdfGenerator.generateFromHTML(invoiceRef.current)
    } catch (error) {
      console.error('PDF generation failed:', error)
      const message = error instanceof Error
        ? error.message
        : 'PDF generation failed. Please use the Print option as a fallback.'
      setPdfError(message)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {pdfError && (
        <div className="no-print mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span>{pdfError}</span>
            <button
              type="button"
              onClick={() => globalThis.print()}
              className="inline-flex items-center justify-center rounded-md border border-amber-400 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
            >
              Use Print Dialog
            </button>
          </div>
        </div>
      )}

      <div
        ref={invoiceRef}
        className="bg-white rounded-lg p-8 text-[11pt] font-inter shadow-lg print:rounded-none print:shadow-none"
      >
        {/* Header Section */}
        <div className="mb-8 flex items-start justify-between border-b-2 border-invoice-border pb-5">
        <div>
          <EditableField
            value={invoiceData.header.title}
            onChange={(value) => updateHeader('title', value)}
            className="text-[28px] font-bold text-invoice-blue leading-none"
            placeholder="INVOICE"
          />
        </div>
        <div className="space-y-2 text-right text-slate-500">
          <div className="flex items-center justify-end gap-2"><strong>Invoice #:</strong> <EditableField
            value={invoiceData.header.invoiceNumber}
            onChange={(value) => updateHeader('invoiceNumber', value)}
            className="inline-block min-w-[100px]"
            placeholder={getCurrentInvoiceNumber()}
          /></div>
          <div className="flex items-center justify-end gap-2"><strong>Date:</strong> <DatePicker
            value={invoiceData.header.date}
            onChange={(value) => updateHeader('date', value)}
            className="inline-block min-w-[100px]"
            placeholder="[DATE]"
          /></div>
          <div className="flex items-center justify-end gap-2"><strong>Due Date:</strong> <DatePicker
            value={invoiceData.header.dueDate}
            onChange={(value) => updateHeader('dueDate', value)}
            className="inline-block min-w-[100px]"
            placeholder="[DUE DATE]"
          /></div>
        </div>
      </div>

      {/* From/To Section */}
      <div className="mb-8 grid gap-8 md:grid-cols-2">
        <EditableFieldSection
          section={invoiceData.from}
          onChange={(section) => updateSection('from', section)}
          className="mb-4"
        />
        <EditableFieldSection
          section={invoiceData.to}
          onChange={(section) => updateSection('to', section)}
          className="mb-4"
        />
      </div>

      {/* Services Table */}
      <EnhancedTable
        columns={invoiceData.table.columns}
        rows={invoiceData.table.rows}
        onColumnsChange={(columns) => {
          setInvoiceData(prev => ({
            ...prev,
            table: { ...prev.table, columns }
          }))
        }}
        onRowsChange={(rows) => {
          setInvoiceData(prev => ({
            ...prev,
            table: { ...prev.table, rows }
          }))
        }}
      />

      {/* Totals Section */}
      <div className="mt-5 mb-5 border-t-2 border-invoice-border pt-5">
        {/* Currency Selector */}
        <div className="flex justify-end mb-3 no-print">
          <CurrencySelector
            value={invoiceData.settings.currency}
            symbol={invoiceData.settings.currencySymbol}
            onChange={updateCurrency}
            className=""
          />
        </div>
        
        <div className="mb-2 flex items-center justify-between">
          <span>Subtotal:</span>
          <span className="inline-block min-w-[100px] text-right">
            {InvoiceCalculator.formatCurrency(calculations.subtotal, invoiceData.settings.currencySymbol)}
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-700">
            <span>Tax (if applicable)</span>
            <EditableField
              value={taxRate.toString()}
              onChange={(value) => setTaxRate(Number.parseFloat(value) || 0)}
              className="w-12 text-center no-print"
              placeholder="0"
              format="number"
            />
            <span className="no-print">%</span>
            <span>:</span>
          </div>
          <span className="inline-block min-w-[100px] text-right">
            {InvoiceCalculator.formatCurrency(calculations.tax, invoiceData.settings.currencySymbol)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-300 pt-3 text-lg font-semibold text-slate-800">
          <span>Total Amount Due:</span>
          <span className="inline-block min-w-[100px] text-right">
            {InvoiceCalculator.formatCurrency(calculations.total, invoiceData.settings.currencySymbol)}
          </span>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <EditableFieldSection
          section={invoiceData.paymentDetails}
          onChange={(section) => updateSection('paymentDetails', section)}
          className=""
        />
      </div>

      {/* Notes Section */}
      <div className="mb-4">
        <div className="mb-2">
          <span className="font-semibold text-slate-700">Notes</span>
        </div>
        <EditableField
          value={invoiceData.footer.notes}
          onChange={(value) => updateFooter('notes', value)}
          className="whitespace-pre-wrap text-sm text-gray-700 w-full min-h-[40px]"
          placeholder="Notes - any relevant information not covered, additional terms and conditions"
          multiline
        />
      </div>

      {/* Print Button (like in template) */}
      <button 
        onClick={handleDownloadPDF}
        disabled={isGeneratingPDF}
        className="no-print mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-hidden focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGeneratingPDF ? 'Generating PDF...' : 'Print/Save as PDF'}
      </button>

      {/* Secondary Actions (collapsed/minimal) */}
      <div className="flex flex-wrap gap-2 mt-3 no-print">
        <button
          onClick={() => globalThis.print()}
          className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-50"
        >
          Quick Print
        </button>
        <button 
          onClick={saveTemplate}
          className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-50"
        >
          Save Template
        </button>
        <button 
          onClick={loadTemplate}
          className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded-sm hover:bg-gray-50"
        >
          Load Template
        </button>
        <button 
          onClick={() => {
            if (confirm('Are you sure you want to clear all data? This will reset the invoice to default template.')) {
              setInvoiceData({
                ...initialInvoiceData,
                header: {
                  ...initialInvoiceData.header,
                  invoiceNumber: getCurrentInvoiceNumber(),
                  date: getCurrentDate(),
                }
              })
              localStorage.removeItem('invoiceData')
            }
          }}
          className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded-sm hover:bg-red-50"
        >
          Clear
        </button>
      </div>
      </div>
    </div>
  )
}
