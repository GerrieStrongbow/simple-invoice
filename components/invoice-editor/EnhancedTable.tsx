'use client'

import { useState } from 'react'
import EditableField from './EditableField'
import { TableColumn, TableRow } from '../../lib/types'

interface EnhancedTableProps {
  columns: TableColumn[]
  rows: TableRow[]
  onColumnsChange: (columns: TableColumn[]) => void
  onRowsChange: (rows: TableRow[]) => void
}

export default function EnhancedTable({ columns, rows, onColumnsChange, onRowsChange }: EnhancedTableProps) {
  const [showColumnMenu, setShowColumnMenu] = useState<string | null>(null)

  const addColumn = () => {
    const newColumn: TableColumn = {
      id: Date.now().toString(),
      name: 'New Column',
      type: 'text'
    }
    const newColumns = [...columns, newColumn]
    onColumnsChange(newColumns)
    
    // Update all rows to include the new column
    const updatedRows = rows.map(row => ({
      ...row,
      cells: { ...row.cells, [newColumn.id]: '' }
    }))
    onRowsChange(updatedRows)
  }

  const removeColumn = (columnId: string) => {
    if (columns.length <= 1) {
      alert('You must have at least one column')
      return
    }
    
    const newColumns = columns.filter(col => col.id !== columnId)
    onColumnsChange(newColumns)
    
    // Update all rows to remove the column
    const updatedRows = rows.map(row => {
      const { [columnId]: removed, ...remainingCells } = row.cells
      return { ...row, cells: remainingCells }
    })
    onRowsChange(updatedRows)
    setShowColumnMenu(null)
  }

  const addRow = () => {
    const newRow: TableRow = {
      id: Date.now().toString(),
      cells: Object.fromEntries(columns.map(col => [col.id, '']))
    }
    onRowsChange([...rows, newRow])
  }

  const removeRow = (rowId: string) => {
    if (rows.length <= 1) {
      alert('You must have at least one row')
      return
    }
    onRowsChange(rows.filter(row => row.id !== rowId))
  }

  const updateCell = (rowId: string, columnId: string, value: string) => {
    const updatedRows = rows.map(row =>
      row.id === rowId
        ? { ...row, cells: { ...row.cells, [columnId]: value } }
        : row
    )
    onRowsChange(updatedRows)
  }

  const updateColumnName = (columnId: string, name: string) => {
    const updatedColumns = columns.map(col =>
      col.id === columnId ? { ...col, name } : col
    )
    onColumnsChange(updatedColumns)
  }

  const getPlaceholder = (column: TableColumn) => {
    const name = column.name.toLowerCase()
    if (name.includes('description')) return 'Item Name\nDescription of services provided'
    if (name.includes('days') || name.includes('qty') || name.includes('quantity')) return '1'
    if (name.includes('rate') || name.includes('price')) return 'R500.00'
    if (name.includes('amount') || name.includes('total')) return 'R500.00'
    return 'Enter text...'
  }

  const getAlignment = (column: TableColumn) => {
    const name = column.name.toLowerCase()
    if (name.includes('days') || name.includes('qty') || name.includes('quantity')) return 'text-center'
    if (name.includes('rate') || name.includes('amount') || name.includes('price') || name.includes('total')) return 'text-right'
    return ''
  }

  return (
    <div className="mb-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-invoice-gray">
            {columns.map((col) => (
              <th key={col.id} className="p-3 text-left font-bold text-invoice-blue border-b border-invoice-border relative group">
                <EditableField
                  value={col.name}
                  onChange={(value) => updateColumnName(col.id, value)}
                  className="font-bold"
                  placeholder="Column name"
                />
                <button
                  onClick={() => setShowColumnMenu(showColumnMenu === col.id ? null : col.id)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 text-xs no-print"
                  title="Column options"
                >
                  ⋮
                </button>
                {showColumnMenu === col.id && (
                  <div className="absolute top-8 right-0 bg-white border rounded-sm shadow-lg z-10 no-print">
                    <button
                      onClick={() => removeColumn(col.id)}
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 text-sm"
                    >
                      Delete Column
                    </button>
                  </div>
                )}
              </th>
            ))}
            <th className="w-12 no-print">
              <button
                onClick={addColumn}
                className="w-8 h-8 flex items-center justify-center text-invoice-blue hover:bg-gray-200 rounded-sm text-sm"
                title="Add column"
              >
                +
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id} className="h-[60px] border-b border-invoice-border transition-colors hover:bg-invoice-gray">
              {columns.map((col) => (
                <td key={col.id} className="p-3 align-top">
                  <EditableField
                    value={String(row.cells[col.id] || '')}
                    onChange={(value) => updateCell(row.id, col.id, value)}
                    placeholder={getPlaceholder(col)}
                    format={col.type === 'currency' ? 'currency' : col.type}
                    multiline={col.name.toLowerCase().includes('description')}
                    className={getAlignment(col)}
                  />
                </td>
              ))}
              <td className="p-1 no-print">
                <button
                  onClick={() => removeRow(row.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-red-500 transition-all duration-200 text-sm font-bold"
                  title="Delete row"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Add Row Button */}
      <button
        onClick={addRow}
        className="mt-2 px-4 py-2 text-sm text-invoice-blue hover:bg-invoice-gray rounded-sm border border-gray-300 no-print"
      >
        + Add Row
      </button>

      {/* Click outside to close column menu */}
      {showColumnMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowColumnMenu(null)}
        />
      )}
    </div>
  )
}
