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
      } catch (e) {
        console.error('Failed to load saved invoice data')
        setInvoiceData(initialInvoiceData)
      }
    }
    
    // Load saved templates
    const savedTemplates = localStorage.getItem('invoiceTemplates')
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates))
      } catch (e) {
        console.error('Failed to load saved templates')
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
        } catch (e) {
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
      alert('Invoice content not found. Please try again.')
      return
    }

    setIsGeneratingPDF(true)
    
    try {
      // Check if element is visible and has content
      const rect = invoiceRef.current.getBoundingClientRect()
      console.log('Element bounds:', rect)
      
      if (rect.width === 0 || rect.height === 0) {
        throw new Error('Invoice element has zero dimensions')
      }

      const pdfGenerator = new PDFGenerator(invoiceData)
      await pdfGenerator.generateFromHTML(invoiceRef.current)
    } catch (error) {
      console.error('PDF generation failed:', error)
      
      // Fallback to print
      const shouldTryPrint = confirm(
        'PDF generation failed. Would you like to use the browser print function instead? (You can then save as PDF from the print dialog)'
      )
      
      if (shouldTryPrint) {
        window.print()
      }
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div ref={invoiceRef} className="bg-white rounded-lg shadow-lg print:shadow-none print:rounded-none" style={{
        fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        fontSize: '11pt',
        padding: '30px'
      }}>
        {/* Header Section */}
        <div className="flex justify-between items-start pb-5 border-b-2 border-[#e9ecef]" style={{ marginBottom: '30px' }}>
        <div>
          <EditableField
            value={invoiceData.header.title}
            onChange={(value) => updateHeader('title', value)}
            className="text-[28px] font-bold text-[#2c3e50] leading-none"
            placeholder="INVOICE"
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2c3e50',
              margin: 0
            }}
          />
        </div>
        <div style={{ textAlign: 'right', color: '#666' }}>
          <div><strong>Invoice #:</strong> <EditableField
            value={invoiceData.header.invoiceNumber}
            onChange={(value) => updateHeader('invoiceNumber', value)}
            className="inline-block min-w-[100px]"
            placeholder="INV-2025-08"
          /></div>
          <div><strong>Date:</strong> <DatePicker
            value={invoiceData.header.date}
            onChange={(value) => updateHeader('date', value)}
            className="inline-block min-w-[100px]"
            placeholder="[DATE]"
          /></div>
          <div><strong>Due Date:</strong> <DatePicker
            value={invoiceData.header.dueDate}
            onChange={(value) => updateHeader('dueDate', value)}
            className="inline-block min-w-[100px]"
            placeholder="[DUE DATE]"
          /></div>
        </div>
      </div>

      {/* From/To Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '50% 50%',
        gap: '30px',
        marginBottom: '30px'
      }}>
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
      <div style={{
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '2px solid #e9ecef',
        marginBottom: '20px'
      }}>
        {/* Currency Selector */}
        <div className="flex justify-end mb-3 no-print">
          <CurrencySelector
            value={invoiceData.settings.currency}
            symbol={invoiceData.settings.currencySymbol}
            onChange={updateCurrency}
            className=""
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>Subtotal:</span>
          <span style={{ textAlign: 'right', display: 'inline-block', minWidth: '100px' }}>
            {InvoiceCalculator.formatCurrency(calculations.subtotal, invoiceData.settings.currencySymbol)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div className="flex items-center gap-2">
            <span>Tax (if applicable)</span>
            <EditableField
              value={taxRate.toString()}
              onChange={(value) => setTaxRate(parseFloat(value) || 0)}
              className="w-12 text-center no-print"
              placeholder="0"
              format="number"
            />
            <span className="no-print">%</span>
            <span>:</span>
          </div>
          <span style={{ textAlign: 'right', display: 'inline-block', minWidth: '100px' }}>
            {InvoiceCalculator.formatCurrency(calculations.tax, invoiceData.settings.currencySymbol)}
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          fontSize: '18px',
          color: '#2c3e50',
          borderTop: '1px solid #ccc',
          paddingTop: '10px'
        }}>
          <span>Total Amount Due:</span>
          <span style={{ textAlign: 'right', display: 'inline-block', minWidth: '100px', fontWeight: 'bold' }}>
            {InvoiceCalculator.formatCurrency(calculations.total, invoiceData.settings.currencySymbol)}
          </span>
        </div>
      </div>

      {/* Payment Details */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '0px',
        marginBottom: '20px'
      }}>
        <EditableFieldSection
          section={invoiceData.paymentDetails}
          onChange={(section) => updateSection('paymentDetails', section)}
          className=""
        />
      </div>

      {/* Notes Section */}
      <div className="mb-4">
        <div className="mb-2">
          <span style={{ color: '#2c3e50', fontWeight: 'bold' }}>Notes</span>
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
        className="no-print"
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        {isGeneratingPDF ? 'Generating PDF...' : 'Print/Save as PDF'}
      </button>

      {/* Secondary Actions (collapsed/minimal) */}
      <div className="flex flex-wrap gap-2 mt-3 no-print">
        <button 
          onClick={() => window.print()}
          className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
        >
          Quick Print
        </button>
        <button 
          onClick={saveTemplate}
          className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
        >
          Save Template
        </button>
        <button 
          onClick={loadTemplate}
          className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
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
          className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50"
        >
          Clear
        </button>
      </div>
      </div>
    </div>
  )
}