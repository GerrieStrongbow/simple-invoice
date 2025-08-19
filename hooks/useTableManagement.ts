import { useCallback } from 'react'
import { Column, Row } from '@/lib/invoice-types'
import { generateId } from '@/lib/invoice-utils'

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
    
    setColumns(newColumns)
    
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
    
    setColumns(columns.filter(col => col.id !== columnId))
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