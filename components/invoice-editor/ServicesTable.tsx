import React from 'react'
import { Column, Row } from '@/lib/invoice-types'
import { getPlaceholderText } from '@/lib/invoice-utils'
import { useTableManagement } from '@/hooks/useTableManagement'

interface ServicesTableProps {
  columns: Column[]
  rows: Row[]
  onColumnsChange: (columns: Column[]) => void
  onRowsChange: (rows: Row[]) => void
  onCellUpdate: (rowId: string, columnId: string, value: any) => void
}

export const ServicesTable: React.FC<ServicesTableProps> = ({
  columns,
  rows,
  onColumnsChange,
  onRowsChange,
  onCellUpdate
}) => {
  const {
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    updateColumnName
  } = useTableManagement()

  // Helper function to render table cell content
  const renderCellContent = (row: Row, column: Column) => {
    if (column.isDescription && typeof row.cells[column.id] === 'object') {
      // Special handling for description column
      const cellData = row.cells[column.id] as { name: string; description: string }
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <input
            type="text"
            value={cellData.name || ''}
            placeholder="Item Name"
            onChange={(e) => onCellUpdate(row.id, column.id, {
              ...cellData,
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
            value={cellData.description || ''}
            placeholder="Description of services provided"
            onChange={(e) => onCellUpdate(row.id, column.id, {
              ...cellData,
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
      )
    }

    // Regular cell - Amount is read-only calculated field, others are editable
    return (
      <input
        type="text"
        value={String(row.cells[column.id] || '')}
        placeholder={getPlaceholderText(column.name)}
        onChange={(e) => onCellUpdate(row.id, column.id, e.target.value)}
        readOnly={column.isAmount}
        style={{
          backgroundColor: column.isAmount ? '#f8fafc' : '#ffffff',
          border: column.isAmount ? '2px solid #e5e7eb' : '2px solid #e2e8f0',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '14px',
          outline: 'none',
          width: '100%',
          textAlign: column.align,
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
    )
  }

  return (
    <>
      {/* Services Table */}
      <div style={{ 
        marginBottom: '40px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        marginRight: '0px',
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
                          if (btn) (btn as HTMLElement).style.opacity = '1'
                        }}
                        onMouseLeave={(e) => {
                          const btn = e.currentTarget.querySelector('button')
                          if (btn) (btn as HTMLElement).style.opacity = '0'
                        }}
                      >
                        <button 
                          onClick={() => addColumn(columns[index - 1].id, columns, rows, onColumnsChange, onRowsChange)}
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
                      role="textbox"
                      aria-label={`Column header: ${column.name}`}
                      tabIndex={0}
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
                        updateColumnName(column.id, e.target.textContent || column.name, columns, onColumnsChange)
                        e.target.style.borderColor = '#e2e8f0'
                        e.target.style.boxShadow = 'none'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }
                      }}
                    >
                      {column.name}
                    </span>
                    
                    {/* Delete button - now centered horizontally */}
                    {!column.isDescription && columns.length > 2 && (
                      <button 
                        className="no-print remove-btn"
                        onClick={() => removeColumn(column.id, columns, rows, onColumnsChange, onRowsChange)}
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
                        if (btn) (btn as HTMLElement).style.opacity = '1'
                      }}
                      onMouseLeave={(e) => {
                        const btn = e.currentTarget.querySelector('button')
                        if (btn) (btn as HTMLElement).style.opacity = '0'
                      }}
                    >
                      <button 
                        onClick={() => addColumn(column.id, columns, rows, onColumnsChange, onRowsChange)}
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
                    textAlign: column.align,
                    verticalAlign: 'top',
                    padding: '16px',
                    borderBottom: '1px solid #f1f3f5'
                  }}>
                    {renderCellContent(row, column)}
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
                      onClick={() => removeRow(row.id, rows, onRowsChange)}
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
          onClick={() => addRow(columns, rows, onRowsChange)}
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
    </>
  )
}