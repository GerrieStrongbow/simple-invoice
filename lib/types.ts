export interface SectionField {
  id: string
  label: string
  value: string
  placeholder?: string
}

export interface FieldSection {
  label: string
  fields: SectionField[]
}

export interface InvoiceData {
  header: {
    title: string
    logo?: string
    invoiceNumber: string
    date: string
    dueDate: string
  }
  from: FieldSection
  to: FieldSection
  table: {
    columns: TableColumn[]
    rows: TableRow[]
  }
  totals: {
    subtotal: number
    tax: number
    taxRate: number
    total: number
    customRows: CustomTotalRow[]
  }
  footer: {
    paymentTerms: string
    notes: string
  }
  paymentDetails: FieldSection
  settings: {
    currency: string
    currencySymbol: string
    accentColor: string
    fontSize: 'small' | 'medium' | 'large'
  }
}

export interface TableColumn {
  id: string
  name: string
  type: 'text' | 'number' | 'currency'
  width?: number
}

export interface TableRow {
  id: string
  cells: Record<string, string | number>
}

export interface CustomTotalRow {
  id: string
  label: string
  value: number
  type: 'fixed' | 'percentage'
}