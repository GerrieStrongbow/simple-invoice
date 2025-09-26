import { useTableManagement } from '@/hooks/useTableManagement'
import { Column, Row } from '@/lib/invoice-types'
import { getPlaceholderText, parseNumericValue } from '@/lib/invoice-utils'
import React from 'react'

interface ServicesTableProps {
  columns: Column[]
  rows: Row[]
  onColumnsChange: (columns: Column[]) => void
  onRowsChange: (rows: Row[]) => void
  onCellUpdate: (rowId: string, columnId: string, value: any) => void
}

const baseInputClasses = 'w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-hidden transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
const descriptionTitleClasses = `${baseInputClasses} font-semibold`
const descriptionBodyClasses = `${baseInputClasses} text-slate-500`
const amountInputClasses = 'w-full cursor-not-allowed rounded-lg border-2 border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-hidden focus:border-slate-200 focus:ring-0'
const columnTitleClasses = 'w-full min-w-0 cursor-text rounded-lg border-2 border-slate-200 bg-white px-2 py-2 text-[13px] font-semibold text-slate-700 outline-hidden transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'

const alignmentClass = (align: Column['align']) => {
  switch (align) {
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    default:
      return 'text-left'
  }
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

  const calculatePlaceholderAmount = (row: Row): string => {
    let result = 0
    let hasAnyValues = false

    columns.forEach(col => {
      if (!col.isDescription && !col.isAmount) {
        const cellValue = String(row.cells[col.id] || '')
        if (!cellValue) {
          const placeholderValue = parseNumericValue(getPlaceholderText(col.name))
          if (!hasAnyValues) {
            result = placeholderValue
          } else {
            result *= placeholderValue
          }
          hasAnyValues = true
        } else {
          const numValue = parseNumericValue(cellValue)
          if (!hasAnyValues) {
            result = numValue
          } else {
            result *= numValue
          }
          hasAnyValues = true
        }
      }
    })

    return result.toString()
  }

  const renderCellContent = (row: Row, column: Column) => {
    if (column.isDescription && typeof row.cells[column.id] === 'object') {
      const cellData = row.cells[column.id] as { name: string; description: string }
      return (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={cellData.name || ''}
            placeholder="Item Name"
            onChange={(e) => onCellUpdate(row.id, column.id, {
              ...cellData,
              name: e.target.value
            })}
            className={descriptionTitleClasses}
          />
          <input
            type="text"
            value={cellData.description || ''}
            placeholder="Description of services provided"
            onChange={(e) => onCellUpdate(row.id, column.id, {
              ...cellData,
              description: e.target.value
            })}
            className={descriptionBodyClasses}
          />
        </div>
      )
    }

    const placeholder = column.isAmount
      ? calculatePlaceholderAmount(row)
      : getPlaceholderText(column.name)

    const value = String(row.cells[column.id] || '')
    const alignClass = alignmentClass(column.align)

    return (
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onCellUpdate(row.id, column.id, e.target.value)}
        readOnly={column.isAmount}
        aria-readonly={column.isAmount}
        className={`${column.isAmount ? amountInputClasses : baseInputClasses} ${alignClass}`}
      />
    )
  }

  return (
    <>
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="services-table w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-linear-to-r from-slate-50 to-slate-100">
              {columns.map((column, index) => (
                <th
                  key={column.id}
                  className={`group relative px-3 py-4 text-sm font-semibold text-slate-800 sm:px-4 ${alignmentClass(column.align)}`}
                  style={{ width: column.width }}
                >
                    {index > 0 && (
                      <button
                        type="button"
                        className="no-print absolute inset-y-0 left-[-16px] flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white opacity-0 shadow-sm transition hover:bg-sky-600 focus:outline-hidden focus:ring-2 focus:ring-sky-200 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
                        onClick={() => addColumn(columns[index - 1].id, columns, rows, onColumnsChange, onRowsChange)}
                        aria-label="Add column here"
                      >
                        +
                      </button>
                    )}

                    <input
                      type="text"
                      aria-label={`Column header: ${column.name}`}
                      value={column.name}
                      onChange={(e) => updateColumnName(column.id, e.target.value, columns, onColumnsChange)}
                      className={`${columnTitleClasses} ${alignmentClass(column.align)}`}
                    />

                    {!column.isDescription && columns.length > 2 && (
                      <button
                        type="button"
                        className="no-print absolute left-1/2 top-2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-md border-2 border-rose-200 bg-rose-50 text-sm font-semibold text-rose-600 opacity-0 transition hover:scale-105 hover:border-rose-500 hover:bg-rose-500 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-200 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
                        onClick={() => removeColumn(column.id, columns, rows, onColumnsChange, onRowsChange)}
                        aria-label="Remove column"
                      >
                        ×
                      </button>
                    )}

                    {index === columns.length - 1 && !column.isAmount && (
                      <button
                        type="button"
                        className="no-print absolute inset-y-0 right-[-16px] flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white opacity-0 shadow-sm transition hover:bg-sky-600 focus:outline-hidden focus:ring-2 focus:ring-sky-200 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
                        onClick={() => addColumn(column.id, columns, rows, onColumnsChange, onRowsChange)}
                        aria-label="Add column"
                      >
                        +
                      </button>
                    )}
                  </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} group relative`}
              >
                {columns.map((column, columnIndex) => {
                  const isLastColumn = columnIndex === columns.length - 1
                  return (
                    <td
                      key={`${row.id}-${column.id}`}
                      className={`border-b border-slate-200 px-3 py-4 align-top ${alignmentClass(column.align)} ${isLastColumn ? 'relative pr-10 sm:pr-12' : ''}`}
                      style={{ width: column.width }}
                    >
                      {renderCellContent(row, column)}

                      {isLastColumn && rows.length > 1 && (
                        <button
                          type="button"
                          className="no-print absolute right-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md border-2 border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600 opacity-0 transition hover:scale-105 hover:border-rose-500 hover:bg-rose-500 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-200 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100"
                          onClick={() => removeRow(row.id, rows, onRowsChange)}
                          aria-label="Remove row"
                        >
                          ×
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="no-print -mt-2 mb-4">
        <button
          type="button"
          onClick={() => addRow(columns, rows, onRowsChange)}
          className="flex h-10 w-32 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-sky-500 bg-sky-50 text-sm font-semibold text-sky-600 transition hover:-translate-y-0.5 hover:border-solid hover:bg-sky-500 hover:text-white focus:outline-hidden focus:ring-4 focus:ring-sky-100"
        >
          + Add Row
        </button>
      </div>
    </>
  )
}
