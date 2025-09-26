import { useCallback } from 'react'
import { Column, Row } from '@/lib/invoice-types'
import { generateId } from '@/lib/invoice-utils'

const MIN_DESCRIPTION_WIDTH = 20
const MIN_AMOUNT_WIDTH = 12
const MIN_GENERIC_WIDTH = 10

const DESCRIPTION_WEIGHT = 1.6
const AMOUNT_WEIGHT = 1
const GENERIC_WEIGHT = 1

const toPercent = (value: number) => `${parseFloat(value.toFixed(2))}%`

const recalculateColumnWidths = (columns: Column[]): Column[] => {
  if (!columns.length) {
    return columns
  }

  const descriptionColumn = columns.find(column => column.isDescription)
  const amountColumn = columns.find(column => column.isAmount)
  const weights = columns.map(column => {
    if (column.isDescription) {
      return DESCRIPTION_WEIGHT
    }
    if (column.isAmount) {
      return AMOUNT_WEIGHT
    }
    return GENERIC_WEIGHT
  })

  let minWidths = columns.map(column => {
    if (column.isDescription) {
      return MIN_DESCRIPTION_WIDTH
    }
    if (column.isAmount) {
      return MIN_AMOUNT_WIDTH
    }
    return MIN_GENERIC_WIDTH
  })

  const totalMin = minWidths.reduce((total, value) => total + value, 0)
  let leftover = 0

  if (totalMin > 100) {
    const scale = 100 / totalMin
    minWidths = minWidths.map(value => value * scale)
  } else {
    leftover = 100 - totalMin
  }

  const totalWeight = weights.reduce((total, value) => total + value, 0)

  const widths = columns.map((column, index) => {
    const weight = weights[index]
    const minWidth = minWidths[index]
    const extra = leftover > 0 && totalWeight > 0
      ? (leftover * (weight / totalWeight))
      : 0
    return parseFloat((minWidth + extra).toFixed(2))
  })

  const totalAssigned = widths.reduce((total, value) => total + value, 0)
  const roundingDelta = parseFloat((100 - totalAssigned).toFixed(2))

  return columns.map((column, index) => {
    const finalWidth = index === columns.length - 1
      ? widths[index] + roundingDelta
      : widths[index]
    return { ...column, width: toPercent(finalWidth) }
  })
}

export const useTableManagement = () => {
  // Add a new row to the table
  const addRow = useCallback((
    columns: Column[],
    rows: Row[],
    setRows: (rows: Row[]) => void
  ) => {
    const newRow: Row = {
      id: generateId(),
      cells: columns.reduce((acc, col) => {
        if (col.isDescription) {
          acc[col.id] = { name: '', description: '' }
        } else {
          acc[col.id] = ''
        }
        return acc
      }, {} as Record<string, any>)
    }
    setRows([...rows, newRow])
  }, [])

  // Remove a row from the table (prevent removing if only one row left)
  const removeRow = useCallback((
    rowId: string,
    rows: Row[],
    setRows: (rows: Row[]) => void
  ) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== rowId))
    }
  }, [])

  // Add a new column to the table
  const addColumn = useCallback((
    afterColumnId: string | undefined,
    columns: Column[],
    rows: Row[],
    setColumns: (columns: Column[]) => void,
    setRows: (rows: Row[]) => void
  ) => {
    const newColumn: Column = {
      id: generateId(),
      name: 'New Column',
      width: '10%',
      align: 'center',
      isDescription: false
    }
    
    let newColumns: Column[]
    if (afterColumnId) {
      // Insert after specific column
      const afterIndex = columns.findIndex(col => col.id === afterColumnId)
      newColumns = [...columns]
      newColumns.splice(afterIndex + 1, 0, newColumn)
    } else {
      // Default: Insert before the Amount column if it exists, otherwise at the end
      const amountColIndex = columns.findIndex(col => col.isAmount)
      if (amountColIndex !== -1) {
        newColumns = [...columns]
        newColumns.splice(amountColIndex, 0, newColumn)
      } else {
        newColumns = [...columns, newColumn]
      }
    }
    
    const adjustedColumns = recalculateColumnWidths(newColumns)
    setColumns(adjustedColumns)

    // Add empty cell to all existing rows
    setRows(rows.map(row => ({
      ...row,
      cells: { ...row.cells, [newColumn.id]: '' }
    })))
  }, [])

  // Remove a column from the table
  const removeColumn = useCallback((
    columnId: string,
    columns: Column[],
    rows: Row[],
    setColumns: (columns: Column[]) => void,
    setRows: (rows: Row[]) => void
  ) => {
    const column = columns.find(col => col.id === columnId)
    // Don't allow removing Description or Amount columns, or if only 2 columns left
    if (column?.isDescription || column?.isAmount || columns.length <= 2) {
      return
    }
    
    const filteredColumns = columns.filter(col => col.id !== columnId)
    const adjustedColumns = recalculateColumnWidths(filteredColumns)
    setColumns(adjustedColumns)
    // Remove cells from all rows
    setRows(rows.map(row => {
      const newCells = { ...row.cells }
      delete newCells[columnId]
      return { ...row, cells: newCells }
    }))
  }, [])

  // Update column name
  const updateColumnName = useCallback((
    columnId: string,
    newName: string,
    columns: Column[],
    setColumns: (columns: Column[]) => void
  ) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, name: newName } : col
    ))
  }, [])

  // Update cell value
  const updateCell = useCallback((
    rowId: string,
    columnId: string,
    value: any,
    rows: Row[],
    setRows: (rows: Row[]) => void
  ) => {
    setRows(rows.map(row => 
      row.id === rowId 
        ? { ...row, cells: { ...row.cells, [columnId]: value } }
        : row
    ))
  }, [])

  return {
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    updateColumnName,
    updateCell
  }
}
