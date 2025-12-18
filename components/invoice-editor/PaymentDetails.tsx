import { useFieldManagement } from '@/hooks/useFieldManagement'
import { Field } from '@/lib/invoice-types'
import React, { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { BankingSelectorModal, BankingSelection } from '@/components/banking/BankingSelectorModal'
import { SaveBankingModal } from '@/components/banking/SaveBankingModal'
import { updateBankingDetails } from '@/lib/supabase/banking-details'
import type { SectionField } from '@/lib/types'
import type { LoadedRecord } from '@/hooks/useInvoiceState'

// Inline style for html2canvas PDF compatibility (prevents italic rendering)
const headingStyle: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'normal',
}

interface PaymentDetailsProps {
  paymentTitle: string
  onPaymentTitleChange: (title: string) => void
  paymentFields: Field[]
  onPaymentFieldsChange: (fields: Field[]) => void
  // Loaded record tracking
  loadedBanking: LoadedRecord | null
  onLoadedBankingChange: (record: LoadedRecord | null) => void
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  paymentTitle,
  onPaymentTitleChange,
  paymentFields,
  onPaymentFieldsChange,
  loadedBanking,
  onLoadedBankingChange
}) => {
  const { addField, removeField, updateField } = useFieldManagement()
  const { user } = useAuth()

  // Modal state
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)

  // Saving state
  const [saving, setSaving] = useState(false)

  // Convert SectionField to Field (ensure placeholder is always a string)
  const convertToFields = (sectionFields: SectionField[]): Field[] => {
    return sectionFields.map(f => ({
      ...f,
      placeholder: f.placeholder || ''
    }))
  }

  // Handle loading banking details (from selector modal)
  const handleLoadBanking = (selection: BankingSelection) => {
    onPaymentFieldsChange(convertToFields(selection.fields))
    onLoadedBankingChange({ id: selection.id, name: selection.name })
  }

  // Handle direct save (update existing record)
  const handleSaveExisting = async () => {
    if (!loadedBanking) return

    setSaving(true)
    try {
      const sectionFields: SectionField[] = paymentFields.map(f => ({
        id: f.id,
        label: f.label,
        value: f.value,
        placeholder: f.placeholder
      }))

      await updateBankingDetails(loadedBanking.id, { fields: sectionFields })
    } catch (error) {
      console.error('Failed to update banking details:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
    <div className="bank-details rounded-lg border border-border bg-paper-warm/50 p-6">
      {/* Section Header */}
      <div className="mb-5 flex items-center gap-2 overflow-hidden">
        <h4 className="flex flex-1 items-center gap-2 min-w-0">
          <span className="h-1 w-1 rounded-full bg-accent shrink-0" />
          <input
            type="text"
            aria-label="Payment section title"
            value={paymentTitle}
            onChange={(e) => onPaymentTitleChange(e.target.value)}
            className="font-display text-base text-ink bg-transparent border-none outline-none transition hover:text-ink-soft focus:text-ink shrink-0"
            style={{ ...headingStyle, width: `${paymentTitle.length * 0.55 + 0.5}em` }}
          />
          {/* Show loaded record name */}
          {loadedBanking && (
            <span className="text-xs text-ink-muted font-normal truncate">
              ({loadedBanking.name})
            </span>
          )}
        </h4>

        {/* Load/Save/Save As buttons - only shown when logged in */}
        {user && (
          <div className="no-print flex gap-1 shrink-0">
            <button
              onClick={() => setShowLoadModal(true)}
              className="px-2 py-1 text-xs text-accent hover:bg-accent-muted rounded transition whitespace-nowrap"
              title="Load saved banking details"
            >
              Load
            </button>
            {/* Save button - only shown when a record is loaded */}
            {loadedBanking && (
              <button
                onClick={handleSaveExisting}
                disabled={saving}
                className="px-2 py-1 text-xs text-success hover:bg-green-50 rounded transition disabled:opacity-50 whitespace-nowrap"
                title={`Update "${loadedBanking.name}"`}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            )}
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-2 py-1 text-xs text-ink-muted hover:bg-paper-warm rounded transition whitespace-nowrap"
              title="Save as new banking details"
            >
              Save As
            </button>
          </div>
        )}
      </div>

      {/* Fields Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          {paymentFields.map((field) => (
            <div key={field.id} className="group flex items-center gap-2">
              <input
                type="text"
                value={field.value}
                placeholder={field.placeholder}
                onChange={(e) => updateField(field.id, e.target.value, paymentFields, onPaymentFieldsChange)}
                autoComplete="off"
                className="flex-1 rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-muted"
              />
              {paymentFields.length > 1 && (
                <button
                  className="no-print inline-flex h-7 w-7 items-center justify-center rounded-md border border-error/30 bg-error/5 text-sm text-error opacity-0 transition group-hover:opacity-100 hover:bg-error hover:text-white focus:outline-none focus:opacity-100"
                  onClick={() => removeField(field.id, paymentFields, onPaymentFieldsChange)}
                  title="Remove field"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {/* Add Field Button */}
          <button
            className="no-print mt-2 inline-flex h-9 w-full items-center justify-center gap-1 rounded-md border border-dashed border-border text-sm text-ink-muted transition hover:border-accent hover:text-accent hover:bg-accent-muted/30 focus:outline-none focus:border-accent"
            onClick={() => addField(paymentFields, onPaymentFieldsChange)}
            title="Add field"
          >
            + Add Field
          </button>
        </div>

        {/* Empty column for spacing */}
        <div />
      </div>
    </div>

    {/* Banking Modals */}
    <BankingSelectorModal
      isOpen={showLoadModal}
      onClose={() => setShowLoadModal(false)}
      onSelect={handleLoadBanking}
    />
    <SaveBankingModal
      fields={paymentFields}
      isOpen={showSaveModal}
      onClose={() => setShowSaveModal(false)}
      onSaved={(id, name) => onLoadedBankingChange({ id, name })}
    />
    </>
  )
}
