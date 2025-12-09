import { useFieldManagement } from '@/hooks/useFieldManagement'
import { Field } from '@/lib/invoice-types'
import React, { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { ContactSelectorModal } from '@/components/contacts/ContactSelectorModal'
import { SaveContactModal } from '@/components/contacts/SaveContactModal'
import type { SectionField } from '@/lib/types'

interface ContactDetailsProps {
  fromTitle: string
  onFromTitleChange: (title: string) => void
  fromFields: Field[]
  onFromFieldsChange: (fields: Field[]) => void
  toTitle: string
  onToTitleChange: (title: string) => void
  toFields: Field[]
  onToFieldsChange: (fields: Field[]) => void
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({
  fromTitle,
  onFromTitleChange,
  fromFields,
  onFromFieldsChange,
  toTitle,
  onToTitleChange,
  toFields,
  onToFieldsChange
}) => {
  const { addField, removeField, updateField } = useFieldManagement()
  const { user } = useAuth()

  // Modal state for From section
  const [showFromLoadModal, setShowFromLoadModal] = useState(false)
  const [showFromSaveModal, setShowFromSaveModal] = useState(false)

  // Modal state for To section
  const [showToLoadModal, setShowToLoadModal] = useState(false)
  const [showToSaveModal, setShowToSaveModal] = useState(false)

  // Convert SectionField to Field (ensure placeholder is always a string)
  const convertToFields = (sectionFields: SectionField[]): Field[] => {
    return sectionFields.map(f => ({
      ...f,
      placeholder: f.placeholder || ''
    }))
  }

  const renderSection = (
    title: string,
    onTitleChange: (title: string) => void,
    fields: Field[],
    onFieldsChange: (fields: Field[]) => void,
    sectionType: 'from' | 'to'
  ) => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <span className="h-1.5 w-1.5 rounded-full bg-linear-to-br from-[#667eea] to-[#764ba2]" />
          <input
            type="text"
            aria-label={`${title} section title`}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="min-w-[120px] rounded-lg border-2 border-slate-200 bg-slate-100 px-3 py-1.5 text-base font-semibold text-slate-700 outline-hidden transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </h3>

        {/* Load/Save buttons - only shown when logged in */}
        {user && (
          <div className="no-print flex gap-1">
            <button
              onClick={() => sectionType === 'from' ? setShowFromLoadModal(true) : setShowToLoadModal(true)}
              className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition"
              title="Load saved contact"
            >
              Load
            </button>
            <button
              onClick={() => sectionType === 'from' ? setShowFromSaveModal(true) : setShowToSaveModal(true)}
              className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded transition"
              title="Save as contact"
            >
              Save
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {fields.map((field) => (
          <div key={field.id} className="flex items-center gap-3">
            <input
              type="text"
              value={field.value}
              placeholder={field.placeholder}
              onChange={(e) => updateField(field.id, e.target.value, fields, onFieldsChange)}
              autoComplete="off"
              className="flex-1 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-hidden transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />
            {fields.length > 1 && (
              <button
                className="no-print inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-rose-200 bg-rose-50 text-lg font-semibold text-rose-600 transition hover:scale-105 hover:border-rose-500 hover:bg-rose-500 hover:text-white focus:outline-hidden focus:ring-4 focus:ring-rose-100"
                onClick={() => removeField(field.id, fields, onFieldsChange)}
                title="Remove field"
              >×</button>
            )}
          </div>
        ))}
        <button
          className="no-print mt-2 inline-flex h-10 w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed border-sky-500 bg-sky-50 text-sm font-semibold text-sky-600 transition hover:-translate-y-0.5 hover:border-solid hover:bg-sky-500 hover:text-white focus:outline-hidden focus:ring-4 focus:ring-sky-100"
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
      <div className="from-to-section details-grid mb-10 grid gap-8 md:grid-cols-2 md:gap-8 lg:gap-10">
        {renderSection(fromTitle, onFromTitleChange, fromFields, onFromFieldsChange, 'from')}
        {renderSection(toTitle, onToTitleChange, toFields, onToFieldsChange, 'to')}
      </div>

      {/* Modals for From section */}
      <ContactSelectorModal
        type="business"
        isOpen={showFromLoadModal}
        onClose={() => setShowFromLoadModal(false)}
        onSelect={(fields) => onFromFieldsChange(convertToFields(fields))}
      />
      <SaveContactModal
        type="business"
        fields={fromFields}
        isOpen={showFromSaveModal}
        onClose={() => setShowFromSaveModal(false)}
        onSaved={() => {}}
      />

      {/* Modals for To section */}
      <ContactSelectorModal
        type="client"
        isOpen={showToLoadModal}
        onClose={() => setShowToLoadModal(false)}
        onSelect={(fields) => onToFieldsChange(convertToFields(fields))}
      />
      <SaveContactModal
        type="client"
        fields={toFields}
        isOpen={showToSaveModal}
        onClose={() => setShowToSaveModal(false)}
        onSaved={() => {}}
      />
    </>
  )
}
