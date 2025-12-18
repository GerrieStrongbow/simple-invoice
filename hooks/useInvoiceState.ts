import { Column, Field, Row } from '@/lib/invoice-types'
import { getCurrentDate, getEndOfMonth } from '@/lib/invoice-utils'
import { getDefaultBusinessProfile } from '@/lib/supabase/business-profiles'
import { getDefaultClient } from '@/lib/supabase/clients'
import { getDefaultBankingDetails } from '@/lib/supabase/banking-details'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState, useEffect } from 'react'

// Type for tracking loaded records
export interface LoadedRecord {
  id: string
  name: string
}

export const useInvoiceState = () => {
  const { user } = useAuth()

  // Loaded record tracking
  const [loadedBusinessProfile, setLoadedBusinessProfile] = useState<LoadedRecord | null>(null)
  const [loadedClient, setLoadedClient] = useState<LoadedRecord | null>(null)
  const [loadedBanking, setLoadedBanking] = useState<LoadedRecord | null>(null)

  // State for individual fields
  const [fromFields, setFromFields] = useState<Field[]>([
    { id: '1', label: 'Your Business Name', value: '', placeholder: 'Your Business Name' },
    { id: '2', label: 'Street Address', value: '', placeholder: 'Street Address' },
    { id: '3', label: 'City', value: '', placeholder: 'City' },
    { id: '4', label: 'State/Province', value: '', placeholder: 'State/Province' },
    { id: '5', label: 'Country', value: '', placeholder: 'Country' },
    { id: '6', label: 'Email', value: '', placeholder: 'your.email@business.com' },
    { id: '7', label: 'Phone', value: '', placeholder: '+1 (555) 123-4567' }
  ])

  const [toFields, setToFields] = useState<Field[]>([
    { id: '1', label: 'Client Name', value: '', placeholder: 'Client Name' },
    { id: '2', label: 'Client Address', value: '', placeholder: 'Client Address' },
    { id: '3', label: 'City', value: '', placeholder: 'City' },
    { id: '4', label: 'State/Province', value: '', placeholder: 'State/Province' },
    { id: '5', label: 'Country', value: '', placeholder: 'Country' },
    { id: '6', label: 'Email', value: '', placeholder: 'client@email.com' }
  ])

  const [paymentFields, setPaymentFields] = useState<Field[]>([
    { id: '1', label: 'Account Name', value: '', placeholder: 'Your Full Name' },
    { id: '2', label: 'Bank', value: '', placeholder: 'Your Bank Name' },
    { id: '3', label: 'Account Number', value: '', placeholder: '0000 0000 00' },
    { id: '4', label: 'Branch Code', value: '', placeholder: '000000' },
    { id: '5', label: 'SWIFT Code', value: '', placeholder: 'BANKCODE' }
  ])

  // Tax and discount state
  const [taxEnabled, setTaxEnabled] = useState(false)
  const [taxPercentage, setTaxPercentage] = useState('15')
  const [taxLabel, setTaxLabel] = useState('Tax')
  const [discountEnabled, setDiscountEnabled] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState('10')
  const [discountLabel, setDiscountLabel] = useState('Discount')

  // Currency state - default to ZAR to maintain current behavior
  const [currencyCode, setCurrencyCode] = useState('ZAR')
  const [currencySymbol, setCurrencySymbol] = useState('R')

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

  // Table state - start with default columns and one row
  const [columns, setColumns] = useState<Column[]>([
    { id: 'description', name: 'Description', width: '36.7%', align: 'left', isDescription: true },
    { id: '2', name: 'Rate', width: '20.43%', align: 'right', isDescription: false },
    { id: '3', name: 'Quantity', width: '20.43%', align: 'right', isDescription: false },
    { id: 'amount', name: 'Amount', width: '22.44%', align: 'right', isAmount: true }
  ])

  const [rows, setRows] = useState<Row[]>([
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

  // Auto-load default business profile, client, and banking when user is logged in
  useEffect(() => {
    if (!user) return

    const loadDefaults = async () => {
      // Load default business profile for "From" section
      try {
        const defaultProfile = await getDefaultBusinessProfile()
        if (defaultProfile?.fields) {
          const mappedFields: Field[] = defaultProfile.fields.map((field, index) => ({
            id: field.id || String(index + 1),
            label: field.label,
            value: field.value,
            placeholder: field.placeholder || field.label
          }))
          setFromFields(mappedFields)
          setLoadedBusinessProfile({ id: defaultProfile.id, name: defaultProfile.name })
        }
      } catch (error) {
        console.error('Failed to load default business profile:', error)
      }

      // Load default client for "To" section
      try {
        const defaultClient = await getDefaultClient()
        if (defaultClient?.fields) {
          const mappedFields: Field[] = defaultClient.fields.map((field, index) => ({
            id: field.id || String(index + 1),
            label: field.label,
            value: field.value,
            placeholder: field.placeholder || field.label
          }))
          setToFields(mappedFields)
          setLoadedClient({ id: defaultClient.id, name: defaultClient.name })
        }
      } catch (error) {
        console.error('Failed to load default client:', error)
      }

      // Load default banking details for "Payment" section
      try {
        const defaultBanking = await getDefaultBankingDetails()
        if (defaultBanking?.fields) {
          const mappedFields: Field[] = defaultBanking.fields.map((field, index) => ({
            id: field.id || String(index + 1),
            label: field.label,
            value: field.value,
            placeholder: field.placeholder || field.label
          }))
          setPaymentFields(mappedFields)
          setLoadedBanking({ id: defaultBanking.id, name: defaultBanking.name })
        }
      } catch (error) {
        console.error('Failed to load default banking details:', error)
      }
    }

    loadDefaults()
  }, [user])

  return {
    // Fields
    fromFields,
    setFromFields,
    toFields,
    setToFields,
    paymentFields,
    setPaymentFields,

    // Loaded record tracking
    loadedBusinessProfile,
    setLoadedBusinessProfile,
    loadedClient,
    setLoadedClient,
    loadedBanking,
    setLoadedBanking,

    // Tax and discount
    taxEnabled,
    setTaxEnabled,
    taxPercentage,
    setTaxPercentage,
    taxLabel,
    setTaxLabel,
    discountEnabled,
    setDiscountEnabled,
    discountPercentage,
    setDiscountPercentage,
    discountLabel,
    setDiscountLabel,

    // Currency
    currencyCode,
    setCurrencyCode,
    currencySymbol,
    setCurrencySymbol,

    // Dates
    invoiceDate,
    setInvoiceDate,
    dueDate,
    setDueDate,

    // Section headers
    invoiceTitle,
    setInvoiceTitle,
    fromTitle,
    setFromTitle,
    toTitle,
    setToTitle,
    paymentTitle,
    setPaymentTitle,

    // Field labels
    invoiceNumberLabel,
    setInvoiceNumberLabel,
    dateLabel,
    setDateLabel,
    dueDateLabel,
    setDueDateLabel,
    totalLabel,
    setTotalLabel,

    // Table
    columns,
    setColumns,
    rows,
    setRows
  }
}
