'use client'

import React, { useState, useRef, useEffect } from 'react'
import CurrencySelector from './invoice-editor/CurrencySelector'

export default function FlexibleInvoice() {
  const invoiceRef = useRef<HTMLDivElement>(null)
  
  // State for individual fields
  const [fromFields, setFromFields] = useState([
    { id: '1', label: 'Your Business Name', value: '', placeholder: 'Your Business Name' },
    { id: '2', label: 'Street Address', value: '', placeholder: 'Street Address' },
    { id: '3', label: 'City', value: '', placeholder: 'City' },
    { id: '4', label: 'State/Province', value: '', placeholder: 'State/Province' },
    { id: '5', label: 'Country', value: '', placeholder: 'Country' },
    { id: '6', label: 'Email', value: '', placeholder: 'your.email@business.com' },
    { id: '7', label: 'Phone', value: '', placeholder: '+1 (555) 123-4567' }
  ])
  
  const [toFields, setToFields] = useState([
    { id: '1', label: 'Client Name', value: '', placeholder: 'Client Name' },
    { id: '2', label: 'Client Address', value: '', placeholder: 'Client Address' },
    { id: '3', label: 'City', value: '', placeholder: 'City' },
    { id: '4', label: 'State/Province', value: '', placeholder: 'State/Province' },
    { id: '5', label: 'Country', value: '', placeholder: 'Country' },
    { id: '6', label: 'Email', value: '', placeholder: 'client@email.com' }
  ])
  
  const [paymentFields, setPaymentFields] = useState([
    { id: '1', label: 'Account Name', value: '', placeholder: 'Your Full Name' },
    { id: '2', label: 'Bank', value: '', placeholder: 'Your Bank Name' },
    { id: '3', label: 'Account Number', value: '', placeholder: '0000 0000 00' },
    { id: '4', label: 'Branch Code', value: '', placeholder: '000000' },
    { id: '5', label: 'SWIFT Code', value: '', placeholder: 'BANKCODE' }
  ])
  
  // Tax and discount state
  const [taxEnabled, setTaxEnabled] = useState(false)
  const [taxPercentage, setTaxPercentage] = useState('15')
  const [discountEnabled, setDiscountEnabled] = useState(false)  
  const [discountPercentage, setDiscountPercentage] = useState('10')
  
  // Currency state - default to ZAR to maintain current behavior
  const [currencyCode, setCurrencyCode] = useState('ZAR')
  const [currencySymbol, setCurrencySymbol] = useState('R')

  // Date helper functions
  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  const getEndOfMonth = () => {
    const today = new Date()
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return lastDay.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  // Date state
  const [invoiceDate, setInvoiceDate] = useState(getCurrentDate())
  const [dueDate, setDueDate] = useState(getEndOfMonth())
  
  // Section headers state
  const [invoiceTitle, setInvoiceTitle] = useState('INVOICE')
  const [fromTitle, setFromTitle] = useState('From:')
  const [toTitle, setToTitle] = useState('To:')
  const [paymentTitle, setPaymentTitle] = useState('Payment Details:')
  
  // Field labels state
  const [invoiceNumberLabel, setInvoiceNumberLabel] = useState('Invoice #:')
  const [dateLabel, setDateLabel] = useState('Issue Date:')
  const [dueDateLabel, setDueDateLabel] = useState('Due Date:')
  const [totalLabel, setTotalLabel] = useState('Total Amount Due:')

  // Format date for display (DD/MM/YYYY)
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }
  
  // Table state - start with default columns and one row
  const [columns, setColumns] = useState([
    { id: 'description', name: 'Description', width: '50%', align: 'left', isDescription: true },
    { id: '2', name: 'Rate', width: '20%', align: 'right', isDescription: false },
    { id: '3', name: 'Quantity', width: '15%', align: 'center', isDescription: false },
    { id: 'amount', name: 'Amount', width: '15%', align: 'right', isAmount: true }
  ])
  
  const [rows, setRows] = useState([
    { 
      id: '1', 
      cells: {
        'description': { name: '', description: '' },
        '2': '',
        '3': '', 
        'amount': ''
      }
    }
  ])

  // Helper function to parse numeric value from string
  const parseNumericValue = (value: string): number => {
    if (!value) return 0
    // Remove currency symbols and spaces
    const cleanValue = value.replace(/[^0-9.,\-]/g, '')
    const numValue = parseFloat(cleanValue.replace(',', ''))
    return isNaN(numValue) ? 0 : numValue
  }

  // Calculate amount for a row based on numeric columns
  const calculateRowAmount = (row: any): string => {
    let result = 1
    let hasValues = false
    
    columns.forEach(col => {
      if (!col.isDescription && !col.isAmount && row.cells[col.id]) {
        const numValue = parseNumericValue(String(row.cells[col.id]))
        if (numValue !== 0) {
          result *= numValue
          hasValues = true
        }
      }
    })
    
    return hasValues ? result.toFixed(2) : ''
  }

  // Calculate subtotal from all amount values
  const calculateSubtotal = (): string => {
    let total = 0
    rows.forEach(row => {
      const amountCol = columns.find(col => col.isAmount)
      if (amountCol && row.cells[amountCol.id]) {
        total += parseNumericValue(String(row.cells[amountCol.id]))
      }
    })
    return total.toFixed(2)
  }

  // Calculate tax amount
  const calculateTaxAmount = (): string => {
    if (!taxEnabled) return '0.00'
    const subtotal = parseFloat(calculateSubtotal())
    const taxRate = parseNumericValue(taxPercentage) / 100
    return (subtotal * taxRate).toFixed(2)
  }

  // Calculate discount amount
  const calculateDiscountAmount = (): string => {
    if (!discountEnabled) return '0.00'
    const subtotal = parseFloat(calculateSubtotal())
    const discountRate = parseNumericValue(discountPercentage) / 100
    return (subtotal * discountRate).toFixed(2)
  }

  // Calculate final total
  const calculateTotal = (): string => {
    const subtotal = parseFloat(calculateSubtotal())
    const tax = parseFloat(calculateTaxAmount())
    const discount = parseFloat(calculateDiscountAmount())
    return (subtotal + tax - discount).toFixed(2) // Discount is subtracted
  }

  // Update amounts when numeric values change
  useEffect(() => {
    const updatedRows = rows.map(row => {
      const amountCol = columns.find(col => col.isAmount)
      if (amountCol) {
        const calculatedAmount = calculateRowAmount(row)
        if (calculatedAmount !== row.cells[amountCol.id]) {
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
      return amountCol && row.cells[amountCol.id] !== rows[index].cells[amountCol.id]
    })
    
    if (hasChanges) {
      setRows(updatedRows)
    }
  }, [rows.map(r => 
    Object.entries(r.cells)
      .filter(([k]) => {
        const col = columns.find(c => c.id === k)
        return col && !col.isAmount && !col.isDescription
      })
      .map(([, v]) => v)
      .join('|')
  ).join(','), columns])

  const addRow = () => {
    const newRow = {
      id: Date.now().toString(),
      cells: columns.reduce((acc, col) => {
        if (col.isDescription) {
          acc[col.id] = { name: '', description: '' }
        } else {
          acc[col.id] = ''
        }
        return acc
      }, {} as any)
    }
    setRows([...rows, newRow])
  }

  const removeRow = (rowId: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== rowId))
    }
  }

  const addColumn = (afterColumnId?: string) => {
    const newColumn = {
      id: Date.now().toString(),
      name: 'New Column',
      width: '10%',
      align: 'center' as const,
      isDescription: false,
      isAmount: false
    }
    
    if (afterColumnId) {
      // Insert after specific column
      const afterIndex = columns.findIndex(col => col.id === afterColumnId)
      const newColumns = [...columns]
      newColumns.splice(afterIndex + 1, 0, newColumn)
      setColumns(newColumns)
    } else {
      // Default: Insert before the Amount column if it exists, otherwise at the end
      const amountColIndex = columns.findIndex(col => col.isAmount)
      if (amountColIndex !== -1) {
        const newColumns = [...columns]
        newColumns.splice(amountColIndex, 0, newColumn)
        setColumns(newColumns)
      } else {
        setColumns([...columns, newColumn])
      }
    }
    
    // Add empty cell to all existing rows
    setRows(rows.map(row => ({
      ...row,
      cells: { ...row.cells, [newColumn.id]: '' }
    })))
  }

  const removeColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId)
    // Don't allow removing Description or Amount columns, or if only 2 columns left
    if (column?.isDescription || column?.isAmount || columns.length <= 2) {
      return
    }
    
    setColumns(columns.filter(col => col.id !== columnId))
    // Remove cells from all rows
    setRows(rows.map(row => {
      const newCells = { ...row.cells }
      delete newCells[columnId]
      return { ...row, cells: newCells }
    }))
  }

  const updateColumnName = (columnId: string, newName: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, name: newName } : col
    ))
  }

  const updateCell = (rowId: string, columnId: string, value: any) => {
    setRows(rows.map(row => 
      row.id === rowId 
        ? { ...row, cells: { ...row.cells, [columnId]: value } }
        : row
    ))
  }

  // Field management functions
  const addFromField = () => {
    const newField = {
      id: Date.now().toString(),
      label: 'New Field',
      value: '',
      placeholder: 'Enter value'
    }
    setFromFields([...fromFields, newField])
  }

  const removeFromField = (fieldId: string) => {
    if (fromFields.length > 1) {
      setFromFields(fromFields.filter(field => field.id !== fieldId))
    }
  }

  const updateFromField = (fieldId: string, value: string) => {
    setFromFields(fromFields.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ))
  }

  const addToField = () => {
    const newField = {
      id: Date.now().toString(),
      label: 'New Field',
      value: '',
      placeholder: 'Enter value'
    }
    setToFields([...toFields, newField])
  }

  const removeToField = (fieldId: string) => {
    if (toFields.length > 1) {
      setToFields(toFields.filter(field => field.id !== fieldId))
    }
  }

  const updateToField = (fieldId: string, value: string) => {
    setToFields(toFields.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ))
  }

  const addPaymentField = () => {
    const newField = {
      id: Date.now().toString(),
      label: 'New Field',
      value: '',
      placeholder: 'Enter value'
    }
    setPaymentFields([...paymentFields, newField])
  }

  const removePaymentField = (fieldId: string) => {
    if (paymentFields.length > 1) {
      setPaymentFields(paymentFields.filter(field => field.id !== fieldId))
    }
  }

  const updatePaymentField = (fieldId: string, value: string) => {
    setPaymentFields(paymentFields.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ))
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
                contentEditable
                suppressContentEditableWarning
                style={{
                  outline: 'none',
                  cursor: 'text',
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
                  e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.3)'
                }}
                onBlur={(e) => {
                  setInvoiceTitle(e.target.textContent || 'INVOICE')
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {invoiceTitle}
              </span>
            </h1>
          </div>
          <div className="invoice-details" style={{
            textAlign: 'right'
          }}>
            <div style={{ 
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <span
                contentEditable
                suppressContentEditableWarning
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#374151',
                  outline: 'none',
                  cursor: 'text',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent',
                  minWidth: '80px',
                  display: 'inline-block'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff'
                  e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)'
                }}
                onBlur={(e) => {
                  setInvoiceNumberLabel(e.target.textContent || 'Invoice #:')
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {invoiceNumberLabel}
              </span>
              <input
                type="text"
                placeholder="INV-2025-08"
                style={{
                  backgroundColor: '#f8fafc',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  minWidth: '140px',
                  fontSize: '14px',
                  fontWeight: '500',
                  outline: 'none',
                  textAlign: 'right',
                  transition: 'all 0.2s ease',
                  color: '#1f2937'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea'
                  e.target.style.backgroundColor = '#ffffff'
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.backgroundColor = '#f8fafc'
                  e.target.style.boxShadow = 'none'
                }}
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
                contentEditable
                suppressContentEditableWarning
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#374151',
                  outline: 'none',
                  cursor: 'text',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent',
                  minWidth: '80px',
                  display: 'inline-block'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff'
                  e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)'
                }}
                onBlur={(e) => {
                  setDateLabel(e.target.textContent || 'Issue Date:')
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {dateLabel}
              </span> 
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    minWidth: '140px',
                    fontSize: '14px',
                    fontWeight: '500',
                    outline: 'none',
                    textAlign: 'right',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.backgroundColor = '#ffffff'
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.backgroundColor = '#f8fafc'
                    e.target.style.boxShadow = 'none'
                  }}
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
                contentEditable
                suppressContentEditableWarning
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#374151',
                  outline: 'none',
                  cursor: 'text',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent',
                  minWidth: '80px',
                  display: 'inline-block'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff'
                  e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)'
                }}
                onBlur={(e) => {
                  setDueDateLabel(e.target.textContent || 'Due Date:')
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {dueDateLabel}
              </span> 
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    minWidth: '140px',
                    fontSize: '14px',
                    fontWeight: '500',
                    outline: 'none',
                    textAlign: 'right',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#1f2937'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.backgroundColor = '#ffffff'
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.backgroundColor = '#f8fafc'
                    e.target.style.boxShadow = 'none'
                  }}
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

        {/* From/To Details */}
        <div className="details-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '40px'
        }}>
          <div className="contractor-details" style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              color: '#1f2937', 
              marginBottom: '20px', 
              fontSize: '18px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}></span>
              <span
                contentEditable
                suppressContentEditableWarning
                style={{
                  outline: 'none',
                  cursor: 'text',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent',
                  minWidth: '60px'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff'
                  e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)'
                }}
                onBlur={(e) => {
                  setFromTitle(e.target.textContent || 'From:')
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {fromTitle}
              </span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fromFields.map((field) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="text"
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(e) => updateFromField(field.id, e.target.value)}
                    autoComplete="off"
                    style={{
                      flex: 1,
                      backgroundColor: '#ffffff',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  {fromFields.length > 1 && (
                    <button 
                      className="no-print remove-btn"
                      onClick={() => removeFromField(field.id)}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '2px solid #fecaca',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        transition: 'all 0.2s ease',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.borderColor = '#dc2626'
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2'
                        e.currentTarget.style.color = '#dc2626'
                        e.currentTarget.style.borderColor = '#fecaca'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                      title="Remove field"
                    >×</button>
                  )}
                </div>
              ))}
              <button 
                className="no-print add-btn"
                onClick={addFromField}
                style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: '#f0f9ff',
                  color: '#0284c7',
                  border: '2px dashed #0284c7',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  lineHeight: 1,
                  marginTop: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0284c7'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.borderColor = '#0284c7'
                  e.currentTarget.style.borderStyle = 'solid'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff'
                  e.currentTarget.style.color = '#0284c7'
                  e.currentTarget.style.borderColor = '#0284c7'
                  e.currentTarget.style.borderStyle = 'dashed'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                title="Add field"
              >
                + Add Field
              </button>
            </div>
          </div>

          <div className="company-details" style={{
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              color: '#1f2937', 
              marginBottom: '20px', 
              fontSize: '18px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}></span>
              <span
                contentEditable
                suppressContentEditableWarning
                style={{
                  outline: 'none',
                  cursor: 'text',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent',
                  minWidth: '60px'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#ffffff'
                  e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)'
                }}
                onBlur={(e) => {
                  setToTitle(e.target.textContent || 'To:')
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {toTitle}
              </span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {toFields.map((field) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="text"
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(e) => updateToField(field.id, e.target.value)}
                    autoComplete="off"
                    style={{
                      flex: 1,
                      backgroundColor: '#ffffff',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  {toFields.length > 1 && (
                    <button 
                      className="no-print remove-btn"
                      onClick={() => removeToField(field.id)}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '2px solid #fecaca',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        transition: 'all 0.2s ease',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.borderColor = '#dc2626'
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2'
                        e.currentTarget.style.color = '#dc2626'
                        e.currentTarget.style.borderColor = '#fecaca'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                      title="Remove field"
                    >×</button>
                  )}
                </div>
              ))}
              <button 
                className="no-print add-btn"
                onClick={addToField}
                style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: '#f0f9ff',
                  color: '#0284c7',
                  border: '2px dashed #0284c7',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  lineHeight: 1,
                  marginTop: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0284c7'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.borderColor = '#0284c7'
                  e.currentTarget.style.borderStyle = 'solid'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff'
                  e.currentTarget.style.color = '#0284c7'
                  e.currentTarget.style.borderColor = '#0284c7'
                  e.currentTarget.style.borderStyle = 'dashed'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                title="Add field"
              >
                + Add Field
              </button>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div style={{ 
          marginBottom: '40px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          marginRight: '40px',
          position: 'relative'
        }}>
        <table className="services-table" style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              position: 'relative'
            }}>
              {columns.map((column, index) => (
                <React.Fragment key={column.id}>
                  <th style={{
                    padding: '20px 16px',
                    textAlign: 'center',
                    fontWeight: '700',
                    color: '#1f2937',
                    width: column.width,
                    position: 'relative',
                    fontSize: '15px'
                  }}>
                    {/* Add button between columns (appears on hover) - allows adding before Amount */}
                    {index > 0 && (
                      <div 
                        className="no-print"
                        style={{
                          position: 'absolute',
                          left: '-20px',
                          top: '0',
                          bottom: '0',
                          width: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                          const btn = e.currentTarget.querySelector('button')
                          if (btn) btn.style.opacity = '1'
                        }}
                        onMouseLeave={(e) => {
                          const btn = e.currentTarget.querySelector('button')
                          if (btn) btn.style.opacity = '0'
                        }}
                      >
                        <button 
                          onClick={() => addColumn(columns[index - 1].id)}
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#0284c7',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            fontWeight: '600',
                            opacity: 0,
                            transition: 'opacity 0.2s ease'
                          }}
                          title="Add column here"
                        >+</button>
                      </div>
                    )}
                    
                    <span 
                      contentEditable 
                      suppressContentEditableWarning
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '2px solid #e2e8f0',
                        minWidth: '80px',
                        display: 'inline-block',
                        transition: 'all 0.2s ease',
                        cursor: 'text'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea'
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }}
                      onBlur={(e) => {
                        updateColumnName(column.id, e.target.textContent || column.name)
                        e.target.style.borderColor = '#e2e8f0'
                        e.target.style.boxShadow = 'none'
                      }}
                    >
                      {column.name}
                    </span>
                    
                    {/* Delete button - now centered horizontally */}
                    {!column.isDescription && columns.length > 2 && (
                      <button 
                        className="no-print remove-btn"
                        onClick={() => removeColumn(column.id)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          border: '2px solid #fecaca',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1,
                          transition: 'all 0.2s ease',
                          fontWeight: '600',
                          marginLeft: '0',
                          marginRight: '0',
                          boxSizing: 'border-box'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626'
                          e.currentTarget.style.color = 'white'
                          e.currentTarget.style.borderColor = '#dc2626'
                          e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2'
                          e.currentTarget.style.color = '#dc2626'
                          e.currentTarget.style.borderColor = '#fecaca'
                          e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
                        }}
                        title="Remove column"
                      >×</button>
                    )}
                  </th>
                  
                  {/* Add button after the last column - only if Amount is not the last column */}
                  {index === columns.length - 1 && !column.isAmount && (
                    <div 
                      className="no-print"
                      style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '0',
                        bottom: '0',
                        width: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => {
                        const btn = e.currentTarget.querySelector('button')
                        if (btn) btn.style.opacity = '1'
                      }}
                      onMouseLeave={(e) => {
                        const btn = e.currentTarget.querySelector('button')
                        if (btn) btn.style.opacity = '0'
                      }}
                    >
                      <button 
                        onClick={() => addColumn(column.id)}
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#0284c7',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          fontWeight: '600',
                          opacity: 0,
                          transition: 'opacity 0.2s ease'
                        }}
                        title="Add column here"
                      >+</button>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} style={{ 
                height: '80px',
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc',
                position: 'relative'
              }}>
                {columns.map((column) => (
                  <td key={`${row.id}-${column.id}`} style={{
                    width: column.width,
                    textAlign: column.align as any,
                    verticalAlign: 'top',
                    padding: '16px',
                    borderBottom: '1px solid #f1f3f5'
                  }}>
                    {column.isDescription && typeof row.cells[column.id] === 'object' ? (
                      // Special handling for description column
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <input
                          type="text"
                          value={row.cells[column.id].name}
                          placeholder="Item Name"
                          onChange={(e) => updateCell(row.id, column.id, {
                            ...row.cells[column.id],
                            name: e.target.value
                          })}
                          style={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            outline: 'none',
                            fontWeight: '600',
                            width: '100%',
                            transition: 'all 0.2s ease',
                            color: '#1f2937'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#667eea'
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e2e8f0'
                            e.target.style.boxShadow = 'none'
                          }}
                        />
                        <input
                          type="text"
                          value={row.cells[column.id].description}
                          placeholder="Description of services provided"
                          onChange={(e) => updateCell(row.id, column.id, {
                            ...row.cells[column.id],
                            description: e.target.value
                          })}
                          style={{
                            backgroundColor: '#ffffff',
                            border: '2px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            outline: 'none',
                            width: '100%',
                            transition: 'all 0.2s ease',
                            color: '#6b7280'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#667eea'
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e2e8f0'
                            e.target.style.boxShadow = 'none'
                          }}
                        />
                      </div>
                    ) : (
                      // Regular cell - Amount is read-only calculated field, others are editable
                      <input
                        type="text"
                        value={row.cells[column.id]}
                        placeholder={
                          column.name.toLowerCase().includes('rate') || column.name.toLowerCase().includes('price') ? '50.00' :
                          column.name.toLowerCase().includes('quantity') || column.name.toLowerCase().includes('qty') ? '1' :
                          column.isAmount ? '50.00' :
                          'Enter value'
                        }
                        onChange={(e) => updateCell(row.id, column.id, e.target.value)}
                        readOnly={column.isAmount}
                        style={{
                          backgroundColor: column.isAmount ? '#f8fafc' : '#ffffff',
                          border: column.isAmount ? '2px solid #e5e7eb' : '2px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontSize: '14px',
                          outline: 'none',
                          width: '100%',
                          textAlign: column.align as any,
                          cursor: column.isAmount ? 'not-allowed' : 'text',
                          transition: 'all 0.2s ease',
                          fontWeight: column.isAmount ? '600' : '500',
                          color: column.isAmount ? '#374151' : '#1f2937'
                        }}
                        onFocus={(e) => {
                          if (!column.isAmount) {
                            e.target.style.borderColor = '#667eea'
                            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                          }
                        }}
                        onBlur={(e) => {
                          if (!column.isAmount) {
                            e.target.style.borderColor = '#e2e8f0'
                            e.target.style.boxShadow = 'none'
                          }
                        }}
                      />
                    )}
                  </td>
                ))}
                {/* Remove row button - positioned absolutely to avoid table structure issues */}
                {rows.length > 1 && (
                  <div 
                    className="no-print"
                    style={{
                      position: 'absolute',
                      right: '-20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 10
                    }}
                  >
                    <button 
                      className="remove-btn"
                      onClick={() => removeRow(row.id)}
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '2px solid #fecaca',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        transition: 'all 0.2s ease',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.borderColor = '#dc2626'
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2'
                        e.currentTarget.style.color = '#dc2626'
                        e.currentTarget.style.borderColor = '#fecaca'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                      title="Remove row"
                    >×</button>
                  </div>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        </div>

        {/* Add Row Button */}
        <div className="no-print" style={{ marginBottom: '16px', marginTop: '-8px' }}>
          <button 
            onClick={addRow}
            style={{
              width: '120px',
              height: '40px',
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              border: '2px dashed #0284c7',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              lineHeight: 1,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0284c7'
              e.currentTarget.style.color = 'white'
              e.currentTarget.style.borderColor = '#0284c7'
              e.currentTarget.style.borderStyle = 'solid'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f9ff'
              e.currentTarget.style.color = '#0284c7'
              e.currentTarget.style.borderColor = '#0284c7'
              e.currentTarget.style.borderStyle = 'dashed'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            title="Add new row"
          >
            + Add Row
          </button>
        </div>

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
        <div className="total-section" style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '2px solid #e9ecef',
          marginBottom: '20px'
        }}>
          <div className="total-row" style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span>Subtotal:</span>
            <span style={{
              textAlign: 'right',
              display: 'inline-block',
              minWidth: '100px',
              backgroundColor: '#f8f9fa',
              padding: '2px 4px',
              borderRadius: '3px',
              border: '1px solid #e9ecef'
            }}>{currencySymbol}{calculateSubtotal()}</span>
          </div>

          {/* Discount Row - Only show when enabled */}
          {discountEnabled && (
            <div className="total-row" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Discount ({discountPercentage}%):</span>
              </div>
              <span style={{
                textAlign: 'right',
                display: 'inline-block',
                minWidth: '100px',
                backgroundColor: '#f8f9fa',
                padding: '2px 4px',
                borderRadius: '3px',
                border: '1px solid #e9ecef'
              }}>({currencySymbol}{calculateDiscountAmount()})</span>
            </div>
          )}

          {/* Tax Row - Only show when enabled */}
          {taxEnabled && (
            <div className="total-row" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Tax ({taxPercentage}%):</span>
              </div>
              <span style={{
                textAlign: 'right',
                display: 'inline-block',
                minWidth: '100px',
                backgroundColor: '#f8f9fa',
                padding: '2px 4px',
                borderRadius: '3px',
                border: '1px solid #e9ecef'
              }}>{currencySymbol}{calculateTaxAmount()}</span>
            </div>
          )}

          {/* Control Panel for Tax/Discount (only visible when editing) */}
          <div className="no-print" style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '10px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            fontSize: '14px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={discountEnabled}
                onChange={(e) => setDiscountEnabled(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <span style={{ color: discountEnabled ? '#1f2937' : '#9ca3af', fontWeight: '500' }}>Add Discount:</span>
              <input
                type="text"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                disabled={!discountEnabled}
                style={{
                  width: '60px',
                  backgroundColor: discountEnabled ? '#ffffff' : '#f3f4f6',
                  border: discountEnabled ? '2px solid #e2e8f0' : '2px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '14px',
                  textAlign: 'center',
                  color: discountEnabled ? '#1f2937' : '#9ca3af',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (discountEnabled) {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }
                }}
                onBlur={(e) => {
                  if (discountEnabled) {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }
                }}
              />
              <span style={{ color: discountEnabled ? '#1f2937' : '#9ca3af', fontWeight: '500' }}>%</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={taxEnabled}
                onChange={(e) => setTaxEnabled(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <span style={{ color: taxEnabled ? '#1f2937' : '#9ca3af', fontWeight: '500' }}>Add Tax:</span>
              <input
                type="text"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                disabled={!taxEnabled}
                style={{
                  width: '60px',
                  backgroundColor: taxEnabled ? '#ffffff' : '#f3f4f6',
                  border: taxEnabled ? '2px solid #e2e8f0' : '2px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '6px 8px',
                  fontSize: '14px',
                  textAlign: 'center',
                  color: taxEnabled ? '#1f2937' : '#9ca3af',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (taxEnabled) {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }
                }}
                onBlur={(e) => {
                  if (taxEnabled) {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }
                }}
              />
              <span style={{ color: taxEnabled ? '#1f2937' : '#9ca3af', fontWeight: '500' }}>%</span>
            </div>
          </div>

          <div className="total-row total-final" style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#2c3e50',
            borderTop: '1px solid #ccc',
            paddingTop: '10px'
          }}>
            <span
              contentEditable
              suppressContentEditableWarning
              style={{
                outline: 'none',
                cursor: 'text',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                backgroundColor: 'transparent',
                minWidth: '140px',
                display: 'inline-block'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#ffffff'
                e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)'
              }}
              onBlur={(e) => {
                setTotalLabel(e.target.textContent || 'Total Amount Due:')
                e.target.style.backgroundColor = 'transparent'
                e.target.style.boxShadow = 'none'
              }}
            >
              {totalLabel}
            </span>
            <span style={{
              textAlign: 'right',
              display: 'inline-block',
              minWidth: '100px',
              backgroundColor: '#f8f9fa',
              padding: '2px 4px',
              borderRadius: '3px',
              border: '1px solid #e9ecef',
              fontWeight: 'bold'
            }}>{currencySymbol}{calculateTotal()}</span>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bank-details" style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '24px',
          borderRadius: '12px',
          marginTop: '0px'
        }}>
          <h4 style={{ 
            color: '#1f2937', 
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}></span>
            <span
              contentEditable
              suppressContentEditableWarning
              style={{
                outline: 'none',
                cursor: 'text',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                backgroundColor: 'transparent',
                minWidth: '140px'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#ffffff'
                e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)'
              }}
              onBlur={(e) => {
                setPaymentTitle(e.target.textContent || 'Payment Details:')
                e.target.style.backgroundColor = 'transparent'
                e.target.style.boxShadow = 'none'
              }}
            >
              {paymentTitle}
            </span>
          </h4>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paymentFields.map((field) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="text"
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(e) => updatePaymentField(field.id, e.target.value)}
                    autoComplete="off"
                    style={{
                      flex: 1,
                      backgroundColor: '#ffffff',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea'
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  {paymentFields.length > 1 && (
                    <button 
                      className="no-print remove-btn"
                      onClick={() => removePaymentField(field.id)}
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '2px solid #fecaca',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        transition: 'all 0.2s ease',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc2626'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.borderColor = '#dc2626'
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2'
                        e.currentTarget.style.color = '#dc2626'
                        e.currentTarget.style.borderColor = '#fecaca'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                      title="Remove field"
                    >×</button>
                  )}
                </div>
              ))}
              <button 
                className="no-print add-btn"
                onClick={addPaymentField}
                style={{
                  width: '100%',
                  height: '40px',
                  backgroundColor: '#f0f9ff',
                  color: '#0284c7',
                  border: '2px dashed #0284c7',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  lineHeight: 1,
                  marginTop: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0284c7'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.borderColor = '#0284c7'
                  e.currentTarget.style.borderStyle = 'solid'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff'
                  e.currentTarget.style.color = '#0284c7'
                  e.currentTarget.style.borderColor = '#0284c7'
                  e.currentTarget.style.borderStyle = 'dashed'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                title="Add field"
              >
                + Add Field
              </button>
            </div>
            <div>{/* Empty column for spacing */}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          marginTop: '40px',
          paddingTop: '30px',
          borderTop: '2px solid #f1f3f5'
        }}>
          <button 
            className="print-button"
            onClick={() => window.print()}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '16px 32px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
              minWidth: '180px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6,9 6,2 18,2 18,9"></polyline>
              <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print/Save as PDF
          </button>
        </div>
      </div>
      </div>

      <style jsx>{`
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
          .no-print {
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
          
          /* Preserve card backgrounds */
          .bank-details {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
          }
          
          /* Preserve table styling */
          .services-table th {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
          }
          
          /* Clean table styling */
          table {
            border-collapse: collapse !important;
          }
          
          /* Ensure proper spacing */
          .header {
            margin-bottom: 30px !important;
          }
          
          .details-grid {
            margin-bottom: 30px !important;
          }
          
          .total-section {
            margin-top: 30px !important;
          }
        }
      `}</style>
    </div>
  )
}