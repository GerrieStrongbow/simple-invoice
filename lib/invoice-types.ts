// Type definitions for the invoice generator

export interface Field {
  id: string
  label: string
  value: string
  placeholder: string
}

export interface Column {
  id: string
  name: string
  width: string
  align: 'left' | 'center' | 'right'
  isDescription?: boolean
  isAmount?: boolean
}

export interface Cell {
  name?: string
  description?: string
  [key: string]: any
}

export interface Row {
  id: string
  cells: Record<string, Cell | string>
}

export interface InvoiceData {
  // Header fields
  invoiceTitle: string
  invoiceNumberLabel: string
  dateLabel: string
  dueDateLabel: string
  totalLabel: string
  
  // Dates
  invoiceDate: string
  dueDate: string
  
  // Section titles
  fromTitle: string
  toTitle: string
  paymentTitle: string
  
  // Dynamic fields
  fromFields: Field[]
  toFields: Field[]
  paymentFields: Field[]
  
  // Table data
  columns: Column[]
  rows: Row[]
  
  // Financial settings
  taxEnabled: boolean
  taxPercentage: string
  discountEnabled: boolean
  discountPercentage: string
  
  // Currency
  currencyCode: string
  currencySymbol: string
}

export interface FieldManagementProps {
  fields: Field[]
  onUpdate: (fields: Field[]) => void
  title: string
  onTitleChange: (title: string) => void
}

export interface TableManagementProps {
  columns: Column[]
  rows: Row[]
  onColumnsChange: (columns: Column[]) => void
  onRowsChange: (rows: Row[]) => void
  currencySymbol: string
}

export interface TotalsProps {
  subtotal: string
  tax: string
  discount: string
  total: string
  taxEnabled: boolean
  taxPercentage: string
  discountEnabled: boolean
  discountPercentage: string
  currencySymbol: string
  totalLabel: string
  onTaxToggle: (enabled: boolean) => void
  onTaxPercentageChange: (percentage: string) => void
  onDiscountToggle: (enabled: boolean) => void
  onDiscountPercentageChange: (percentage: string) => void
  onTotalLabelChange: (label: string) => void
}