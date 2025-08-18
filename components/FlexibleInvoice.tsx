'use client'

import React, { useState, useRef, useEffect } from 'react'

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

  const addColumn = () => {
    // Insert new column before the Amount column
    const amountColIndex = columns.findIndex(col => col.isAmount)
    const newColumn = {
      id: Date.now().toString(),
      name: 'New Column',
      width: '10%',
      align: 'center' as const,
      isDescription: false,
      isAmount: false
    }
    
    const newColumns = [...columns]
    newColumns.splice(amountColIndex, 0, newColumn)
    setColumns(newColumns)
    
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
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: '11pt',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <div ref={invoiceRef} className="invoice-container" style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        
        {/* Header */}
        <div className="header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '20px'
        }}>
          <div>
            <h1 className="invoice-title" style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2c3e50',
              margin: 0
            }}>INVOICE</h1>
          </div>
          <div className="invoice-details" style={{
            textAlign: 'right',
            color: '#666'
          }}>
            <div style={{ marginBottom: '4px' }}>
              <strong>Invoice #:</strong> <input
                type="text"
                placeholder="INV-2025-08"
                style={{
                  backgroundColor: '#fff3cd',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  border: '1px dashed #ffc107',
                  minWidth: '120px',
                  fontSize: '11pt',
                  outline: 'none',
                  textAlign: 'right'
                }}
              />
            </div>
            <div style={{ marginBottom: '4px' }}>
              <strong>Date:</strong> 
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  style={{
                    backgroundColor: '#fff3cd',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    border: '1px dashed #ffc107',
                    minWidth: '120px',
                    fontSize: '11pt',
                    outline: 'none',
                    textAlign: 'right',
                    cursor: 'pointer'
                  }}
                />
                <span 
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '2px',
                    pointerEvents: 'none',
                    fontSize: '11pt',
                    color: '#666'
                  }}
                  className="print-only"
                >
                  {formatDateForDisplay(invoiceDate)}
                </span>
              </div>
            </div>
            <div>
              <strong>Due Date:</strong> 
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    backgroundColor: '#fff3cd',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    border: '1px dashed #ffc107',
                    minWidth: '120px',
                    fontSize: '11pt',
                    outline: 'none',
                    textAlign: 'right',
                    cursor: 'pointer'
                  }}
                />
                <span 
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '2px',
                    pointerEvents: 'none',
                    fontSize: '11pt',
                    color: '#666'
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
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div className="contractor-details" style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '16px' }}>From:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {fromFields.map((field) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(e) => updateFromField(field.id, e.target.value)}
                    autoComplete="off"
                    style={{
                      flex: 1,
                      backgroundColor: '#fff3cd',
                      border: '1px dashed #ffc107',
                      borderRadius: '3px',
                      padding: '6px 8px',
                      fontSize: '11pt',
                      outline: 'none',
                      paddingRight: '8px'
                    }}
                  />
                  {fromFields.length > 1 && (
                    <button 
                      className="no-print remove-btn"
                      onClick={() => removeFromField(field.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'transparent',
                        color: '#6c757d',
                        border: '1px solid transparent',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.border = '1px solid #dc3545'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#6c757d'
                        e.currentTarget.style.border = '1px solid transparent'
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
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  border: '1px solid transparent',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  marginTop: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a745'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.border = '1px solid #28a745'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#6c757d'
                  e.currentTarget.style.border = '1px solid transparent'
                }}
                title="Add field"
              >+</button>
            </div>
          </div>

          <div className="company-details" style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '16px' }}>To:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {toFields.map((field) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(e) => updateToField(field.id, e.target.value)}
                    autoComplete="off"
                    style={{
                      flex: 1,
                      backgroundColor: '#fff3cd',
                      border: '1px dashed #ffc107',
                      borderRadius: '3px',
                      padding: '6px 8px',
                      fontSize: '11pt',
                      outline: 'none',
                      paddingRight: '8px'
                    }}
                  />
                  {toFields.length > 1 && (
                    <button 
                      className="no-print remove-btn"
                      onClick={() => removeToField(field.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'transparent',
                        color: '#6c757d',
                        border: '1px solid transparent',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.border = '1px solid #dc3545'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#6c757d'
                        e.currentTarget.style.border = '1px solid transparent'
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
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  border: '1px solid transparent',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  marginTop: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a745'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.border = '1px solid #28a745'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#6c757d'
                  e.currentTarget.style.border = '1px solid transparent'
                }}
                title="Add field"
              >+</button>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <table className="services-table" style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '20px'
        }}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id} style={{
                  padding: '12px',
                  textAlign: column.align as any,
                  borderBottom: '1px solid #e9ecef',
                  backgroundColor: '#f8f9fa',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  width: column.width,
                  position: 'relative'
                }}>
                  <span 
                    contentEditable 
                    suppressContentEditableWarning
                    onBlur={(e) => updateColumnName(column.id, e.target.textContent || column.name)}
                    style={{
                      backgroundColor: '#fff3cd',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      border: '1px dashed #ffc107',
                      minWidth: '60px',
                      display: 'inline-block'
                    }}
                  >
                    {column.name}
                  </span>
                  {!column.isDescription && !column.isAmount && columns.length > 2 && (
                    <button 
                      className="no-print remove-btn"
                      onClick={() => removeColumn(column.id)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '18px',
                        height: '18px',
                        backgroundColor: 'transparent',
                        color: '#6c757d',
                        border: '1px solid transparent',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.border = '1px solid #dc3545'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#6c757d'
                        e.currentTarget.style.border = '1px solid transparent'
                      }}
                      title="Remove column"
                    >×</button>
                  )}
                </th>
              ))}
              <th className="no-print" style={{ 
                width: '40px', 
                borderBottom: '1px solid #e9ecef', 
                backgroundColor: '#f8f9fa',
                padding: '12px',
                textAlign: 'center'
              }}>
                <button 
                  className="add-btn"
                  onClick={addColumn}
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'transparent',
                    color: '#6c757d',
                    border: '1px solid transparent',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#17a2b8'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.border = '1px solid #17a2b8'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#6c757d'
                    e.currentTarget.style.border = '1px solid transparent'
                  }}
                  title="Add column"
                >+</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} style={{ height: '60px' }}>
                {columns.map((column) => (
                  <td key={`${row.id}-${column.id}`} style={{
                    width: column.width,
                    textAlign: column.align as any,
                    verticalAlign: 'top',
                    padding: '12px',
                    borderBottom: '1px solid #e9ecef'
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
                            backgroundColor: '#fff3cd',
                            border: '1px dashed #ffc107',
                            borderRadius: '3px',
                            padding: '4px 6px',
                            fontSize: '11pt',
                            outline: 'none',
                            fontWeight: 'bold'
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
                            backgroundColor: '#fff3cd',
                            border: '1px dashed #ffc107',
                            borderRadius: '3px',
                            padding: '4px 6px',
                            fontSize: '11pt',
                            outline: 'none'
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
                          backgroundColor: column.isAmount ? '#f8f9fa' : '#fff3cd',
                          border: column.isAmount ? '1px solid #e9ecef' : '1px dashed #ffc107',
                          borderRadius: '3px',
                          padding: '4px 6px',
                          fontSize: '11pt',
                          outline: 'none',
                          width: '100%',
                          textAlign: column.align as any,
                          cursor: column.isAmount ? 'not-allowed' : 'text'
                        }}
                      />
                    )}
                  </td>
                ))}
                <td className="no-print" style={{ 
                  borderBottom: '1px solid #e9ecef', 
                  padding: '12px',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}>
                  {rows.length > 1 && (
                    <button 
                      className="remove-btn"
                      onClick={() => removeRow(row.id)}
                      style={{
                        width: '18px',
                        height: '18px',
                        backgroundColor: 'transparent',
                        color: '#6c757d',
                        border: '1px solid transparent',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        margin: '0 auto',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.border = '1px solid #dc3545'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#6c757d'
                        e.currentTarget.style.border = '1px solid transparent'
                      }}
                      title="Remove row"
                    >×</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Row Button */}
        <div className="no-print" style={{ marginBottom: '10px' }}>
          <button 
            onClick={addRow}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Add new row"
          >
            + Add Row
          </button>
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
            }}>R{calculateSubtotal()}</span>
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
              }}>(R{calculateDiscountAmount()})</span>
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
              }}>R{calculateTaxAmount()}</span>
            </div>
          )}

          {/* Control Panel for Tax/Discount (only visible when editing) */}
          <div className="no-print" style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={discountEnabled}
                onChange={(e) => setDiscountEnabled(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ color: discountEnabled ? '#000' : '#6c757d' }}>Add Discount:</span>
              <input
                type="text"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                disabled={!discountEnabled}
                style={{
                  width: '50px',
                  backgroundColor: discountEnabled ? '#fff3cd' : '#e9ecef',
                  border: discountEnabled ? '1px dashed #ffc107' : '1px solid #ced4da',
                  borderRadius: '3px',
                  padding: '2px 4px',
                  fontSize: '11pt',
                  textAlign: 'center',
                  color: discountEnabled ? '#000' : '#6c757d'
                }}
              />
              <span style={{ color: discountEnabled ? '#000' : '#6c757d' }}>%</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={taxEnabled}
                onChange={(e) => setTaxEnabled(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ color: taxEnabled ? '#000' : '#6c757d' }}>Add Tax:</span>
              <input
                type="text"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(e.target.value)}
                disabled={!taxEnabled}
                style={{
                  width: '50px',
                  backgroundColor: taxEnabled ? '#fff3cd' : '#e9ecef',
                  border: taxEnabled ? '1px dashed #ffc107' : '1px solid #ced4da',
                  borderRadius: '3px',
                  padding: '2px 4px',
                  fontSize: '11pt',
                  textAlign: 'center',
                  color: taxEnabled ? '#000' : '#6c757d'
                }}
              />
              <span style={{ color: taxEnabled ? '#000' : '#6c757d' }}>%</span>
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
            <span>Total Amount Due:</span>
            <span style={{
              textAlign: 'right',
              display: 'inline-block',
              minWidth: '100px',
              backgroundColor: '#f8f9fa',
              padding: '2px 4px',
              borderRadius: '3px',
              border: '1px solid #e9ecef',
              fontWeight: 'bold'
            }}>R{calculateTotal()}</span>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bank-details" style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '5px',
          marginTop: '0px'
        }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Payment Details:</h4>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {paymentFields.map((field) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={field.value}
                    placeholder={field.placeholder}
                    onChange={(e) => updatePaymentField(field.id, e.target.value)}
                    autoComplete="off"
                    style={{
                      flex: 1,
                      backgroundColor: '#fff3cd',
                      border: '1px dashed #ffc107',
                      borderRadius: '3px',
                      padding: '6px 8px',
                      fontSize: '11pt',
                      outline: 'none',
                      paddingRight: '8px'
                    }}
                  />
                  {paymentFields.length > 1 && (
                    <button 
                      className="no-print remove-btn"
                      onClick={() => removePaymentField(field.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'transparent',
                        color: '#6c757d',
                        border: '1px solid transparent',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545'
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.border = '1px solid #dc3545'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#6c757d'
                        e.currentTarget.style.border = '1px solid transparent'
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
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  border: '1px solid transparent',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  marginTop: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a745'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.border = '1px solid #28a745'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#6c757d'
                  e.currentTarget.style.border = '1px solid transparent'
                }}
                title="Add field"
              >+</button>
            </div>
            <div>{/* Empty column for spacing */}</div>
          </div>
        </div>

        {/* Print Button */}
        <button 
          className="print-button no-print"
          onClick={() => window.print()}
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
          Print/Save as PDF
        </button>
      </div>

      <style jsx>{`
        .print-only {
          display: none;
        }
        
        @media print {
          body {
            background-color: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .invoice-container {
            box-shadow: none !important;
            padding: 0 !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: inline !important;
          }
          
          .editable {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
          }
          
          input[type="text"], input[type="date"] {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
            outline: none !important;
            color: transparent !important;
          }
          
          input[type="date"]::-webkit-calendar-picker-indicator {
            display: none !important;
          }
          
          input[type="date"]::-webkit-inner-spin-button,
          input[type="date"]::-webkit-outer-spin-button {
            display: none !important;
          }
          
          .bank-details {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .services-table th {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}