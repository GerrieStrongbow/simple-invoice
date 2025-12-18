import { useFieldManagement } from '@/hooks/useFieldManagement'
import { Field } from '@/lib/invoice-types'
import React, { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { ContactSelectorModal, ContactSelection } from '@/components/contacts/ContactSelectorModal'
import { SaveContactModal } from '@/components/contacts/SaveContactModal'
import { updateBusinessProfile } from '@/lib/supabase/business-profiles'
import { updateClient } from '@/lib/supabase/clients'
import type { SectionField } from '@/lib/types'
import type { LoadedRecord } from '@/hooks/useInvoiceState'

// Inline style for html2canvas PDF compatibility (prevents italic rendering)
const headingStyle: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'normal',
}

interface SectionConfig {
  title: string
  onTitleChange: (title: string) => void
  fields: Field[]
  onFieldsChange: (fields: Field[]) => void
  loadedRecord: LoadedRecord | null
  saving: boolean
  onSave: () => void | Promise<void>
  onShowSaveAs: () => void
  onShowLoad: () => void
}

interface ContactDetailsProps {
  fromTitle: string
  onFromTitleChange: (title: string) => void
  fromFields: Field[]
  onFromFieldsChange: (fields: Field[]) => void
  toTitle: string
  onToTitleChange: (title: string) => void
  toFields: Field[]
  onToFieldsChange: (fields: Field[]) => void
  // Loaded record tracking
  loadedBusinessProfile: LoadedRecord | null
  onLoadedBusinessProfileChange: (record: LoadedRecord | null) => void
  loadedClient: LoadedRecord | null
  onLoadedClientChange: (record: LoadedRecord | null) => void
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({
  fromTitle,
  onFromTitleChange,
  fromFields,
  onFromFieldsChange,
  toTitle,
  onToTitleChange,
  toFields,
  onToFieldsChange,
  loadedBusinessProfile,
  onLoadedBusinessProfileChange,
  loadedClient,
  onLoadedClientChange
}) => {
  const { addField, removeField, updateField } = useFieldManagement()
  const { user } = useAuth()

  // Modal state for From section
  const [showFromLoadModal, setShowFromLoadModal] = useState(false)
  const [showFromSaveModal, setShowFromSaveModal] = useState(false)

  // Modal state for To section
  const [showToLoadModal, setShowToLoadModal] = useState(false)
  const [showToSaveModal, setShowToSaveModal] = useState(false)

  // Saving state
  const [savingFrom, setSavingFrom] = useState(false)
  const [savingTo, setSavingTo] = useState(false)

  // Convert SectionField to Field (ensure placeholder is always a string)
  const convertToFields = (sectionFields: SectionField[]): Field[] => {
    return sectionFields.map(f => ({
      ...f,
      placeholder: f.placeholder || ''
    }))
  }

  // Handle loading a contact (from selector modal)
  const handleLoadContact = (
    selection: ContactSelection,
    onFieldsChange: (fields: Field[]) => void,
    onLoadedChange: (record: LoadedRecord | null) => void
  ) => {
    onFieldsChange(convertToFields(selection.fields))
    onLoadedChange({ id: selection.id, name: selection.name })
  }

  // Handle direct save (update existing record)
  const handleSaveExisting = async (
    type: 'business' | 'client',
    loadedRecord: LoadedRecord,
    fields: Field[],
    setSaving: (saving: boolean) => void
  ) => {
    setSaving(true)
    try {
      const sectionFields: SectionField[] = fields.map(f => ({
        id: f.id,
        label: f.label,
        value: f.value,
        placeholder: f.placeholder
      }))

      if (type === 'business') {
        await updateBusinessProfile(loadedRecord.id, { fields: sectionFields })
      } else {
        await updateClient(loadedRecord.id, { fields: sectionFields })
      }
    } catch (error) {
      console.error(`Failed to update ${type}:`, error)
    } finally {
      setSaving(false)
    }
  }

  const renderSection = ({
    title,
    onTitleChange,
    fields,
    onFieldsChange,
    loadedRecord,
    saving,
    onSave,
    onShowSaveAs,
    onShowLoad
  }: SectionConfig) => (
    <div className="rounded-lg border border-border bg-paper-warm/50 p-6">
      {/* Section Header */}
      <div className="mb-5 flex items-center gap-2 overflow-hidden">
        <h3 className="flex flex-1 items-center gap-2 min-w-0">
          <span className="h-1 w-1 rounded-full bg-accent shrink-0" />
          <input
            type="text"
            aria-label={`${title} section title`}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="font-display text-base text-ink bg-transparent border-none outline-none transition hover:text-ink-soft focus:text-ink shrink-0"
            style={{ ...headingStyle, width: `${title.length * 0.55 + 0.5}em` }}
          />
          {/* Show loaded record name */}
          {loadedRecord && (
            <span className="text-xs text-ink-muted font-normal truncate">
              ({loadedRecord.name})
            </span>
          )}
        </h3>

        {/* Load/Save/Save As buttons - only shown when logged in */}
        {user && (
          <div className="no-print flex gap-1 shrink-0">
            <button
              onClick={onShowLoad}
              className="px-2 py-1 text-xs text-accent hover:bg-accent-muted rounded transition whitespace-nowrap"
              title="Load saved contact"
            >
              Load
            </button>
            {/* Save button - only shown when a record is loaded */}
            {loadedRecord && (
              <button
                onClick={onSave}
                disabled={saving}
                className="px-2 py-1 text-xs text-success hover:bg-green-50 rounded transition disabled:opacity-50 whitespace-nowrap"
                title={`Update "${loadedRecord.name}"`}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            )}
            <button
              onClick={onShowSaveAs}
              className="px-2 py-1 text-xs text-ink-muted hover:bg-paper-warm rounded transition whitespace-nowrap"
              title="Save as new contact"
            >
              Save As
            </button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-2">
        {fields.map((field) => (
          <div key={field.id} className="group flex items-center gap-2">
            <input
              type="text"
              value={field.value}
              placeholder={field.placeholder}
              onChange={(e) => updateField(field.id, e.target.value, fields, onFieldsChange)}
              autoComplete="off"
              className="flex-1 rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-muted"
            />
            {fields.length > 1 && (
              <button
                className="no-print inline-flex h-7 w-7 items-center justify-center rounded-md border border-error/30 bg-error/5 text-sm text-error opacity-0 transition group-hover:opacity-100 hover:bg-error hover:text-white focus:outline-none focus:opacity-100"
                onClick={() => removeField(field.id, fields, onFieldsChange)}
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
          onClick={() => addField(fields, onFieldsChange)}
          title="Add field"
        >
          + Add Field
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className="from-to-section details-grid mb-10 grid gap-6 md:grid-cols-2 md:gap-8">
        {renderSection({
          title: fromTitle,
          onTitleChange: onFromTitleChange,
          fields: fromFields,
          onFieldsChange: onFromFieldsChange,
          loadedRecord: loadedBusinessProfile,
          saving: savingFrom,
          onSave: () => { if (loadedBusinessProfile) return handleSaveExisting('business', loadedBusinessProfile, fromFields, setSavingFrom) },
          onShowSaveAs: () => setShowFromSaveModal(true),
          onShowLoad: () => setShowFromLoadModal(true)
        })}
        {renderSection({
          title: toTitle,
          onTitleChange: onToTitleChange,
          fields: toFields,
          onFieldsChange: onToFieldsChange,
          loadedRecord: loadedClient,
          saving: savingTo,
          onSave: () => { if (loadedClient) return handleSaveExisting('client', loadedClient, toFields, setSavingTo) },
          onShowSaveAs: () => setShowToSaveModal(true),
          onShowLoad: () => setShowToLoadModal(true)
        })}
      </div>

      {/* Modals for From section */}
      <ContactSelectorModal
        type="business"
        isOpen={showFromLoadModal}
        onClose={() => setShowFromLoadModal(false)}
        onSelect={(selection) => handleLoadContact(selection, onFromFieldsChange, onLoadedBusinessProfileChange)}
      />
      <SaveContactModal
        type="business"
        fields={fromFields}
        isOpen={showFromSaveModal}
        onClose={() => setShowFromSaveModal(false)}
        onSaved={(id, name) => onLoadedBusinessProfileChange({ id, name })}
      />

      {/* Modals for To section */}
      <ContactSelectorModal
        type="client"
        isOpen={showToLoadModal}
        onClose={() => setShowToLoadModal(false)}
        onSelect={(selection) => handleLoadContact(selection, onToFieldsChange, onLoadedClientChange)}
      />
      <SaveContactModal
        type="client"
        fields={toFields}
        isOpen={showToSaveModal}
        onClose={() => setShowToSaveModal(false)}
        onSaved={(id, name) => onLoadedClientChange({ id, name })}
      />
    </>
  )
}
