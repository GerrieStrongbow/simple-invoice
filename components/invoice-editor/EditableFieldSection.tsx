'use client'

import { useState } from 'react'
import EditableField from './EditableField'
import { FieldSection, SectionField } from '../../lib/types'

interface EditableFieldSectionProps {
  section: FieldSection
  onChange: (section: FieldSection) => void
  className?: string
}

export default function EditableFieldSection({
  section,
  onChange,
  className = '',
}: EditableFieldSectionProps) {
  const [showAddField, setShowAddField] = useState(false)
  const [newFieldLabel, setNewFieldLabel] = useState('')

  // Safety check - return early if section is undefined
  if (!section) {
    return <div className={className}>Loading...</div>
  }

  const updateSectionLabel = (label: string) => {
    onChange({ ...section, label })
  }

  const updateField = (fieldId: string, updates: Partial<SectionField>) => {
    if (!section.fields) return
    const updatedFields = section.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    )
    onChange({ ...section, fields: updatedFields })
  }

  const addField = () => {
    if (!newFieldLabel.trim()) return

    const newField: SectionField = {
      id: Date.now().toString(),
      label: '', // Keep label empty for consistency
      value: '',
      placeholder: `${newFieldLabel}`
    }
    
    onChange({
      ...section,
      fields: [...(section.fields || []), newField]
    })
    
    setNewFieldLabel('')
    setShowAddField(false)
  }

  const removeField = (fieldId: string) => {
    if (!section.fields || section.fields.length <= 1) return // Keep at least one field
    
    const updatedFields = section.fields.filter(field => field.id !== fieldId)
    onChange({ ...section, fields: updatedFields })
  }

  return (
    <div className={className}>
      {/* Section Label */}
      <EditableField
        value={section.label}
        onChange={updateSectionLabel}
        className="font-semibold text-invoice-blue text-base mb-2 block"
        placeholder="Section Label"
      />

      {/* Fields */}
      <div className="space-y-1">
        {(section.fields || []).map((field, index) => (
          <div key={field.id} className="group">
            {field.label && field.label.trim() && (
              <div className="flex items-center gap-2 mb-1 no-print">
                <EditableField
                  value={field.label}
                  onChange={(label) => updateField(field.id, { label })}
                  className="text-xs text-gray-500 font-medium"
                  placeholder="Field Name"
                />
                {section.fields && section.fields.length > 1 && (
                  <button
                    onClick={() => removeField(field.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity"
                    title="Remove field"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 group">
              <EditableField
                value={field.value}
                onChange={(value) => updateField(field.id, { value })}
                className="flex-1 text-gray-700 leading-tight"
                placeholder={field.placeholder || `Enter ${field.label ? field.label.toLowerCase() : 'text'}...`}
              />
              {(!field.label || !field.label.trim()) && section.fields && section.fields.length > 1 && (
                <button
                  onClick={() => removeField(field.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs transition-opacity no-print"
                  title="Remove field"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Field Button */}
      <div className="mt-2 no-print">
        {!showAddField ? (
          <button
            onClick={() => setShowAddField(true)}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
          >
            + Add Field
          </button>
        ) : (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              placeholder="Field name..."
              className="px-2 py-1 border border-gray-300 rounded-sm text-xs flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addField()
                } else if (e.key === 'Escape') {
                  setShowAddField(false)
                  setNewFieldLabel('')
                }
              }}
              autoFocus
            />
            <button
              onClick={addField}
              disabled={!newFieldLabel.trim()}
              className="px-2 py-1 bg-blue-600 text-white rounded-sm text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddField(false)
                setNewFieldLabel('')
              }}
              className="px-2 py-1 border border-gray-300 text-gray-600 rounded-sm text-xs hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}