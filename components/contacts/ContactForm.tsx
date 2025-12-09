'use client'

import { useState } from 'react'
import type { SectionField } from '@/lib/types'

interface ContactFormProps {
  initialName?: string
  initialFields?: SectionField[]
  initialNotes?: string
  showNotes?: boolean  // Only for clients
  onSave: (data: { name: string; fields: SectionField[]; notes?: string }) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

const DEFAULT_FIELDS: SectionField[] = [
  { id: '1', label: 'Business Name', value: '', placeholder: 'Enter name' },
  { id: '2', label: 'Address', value: '', placeholder: 'Street address' },
  { id: '3', label: 'City', value: '', placeholder: 'City' },
  { id: '4', label: 'Country', value: '', placeholder: 'Country' },
  { id: '5', label: 'Email', value: '', placeholder: 'email@example.com' },
  { id: '6', label: 'Phone', value: '', placeholder: '+1 234 567 8900' },
]

export function ContactForm({
  initialName = '',
  initialFields = DEFAULT_FIELDS,
  initialNotes = '',
  showNotes = false,
  onSave,
  onCancel,
  submitLabel = 'Save',
}: ContactFormProps) {
  const [name, setName] = useState(initialName)
  const [fields, setFields] = useState<SectionField[]>(initialFields)
  const [notes, setNotes] = useState(initialNotes)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = (id: string, key: 'label' | 'value', newValue: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: newValue } : f))
  }

  const addField = () => {
    setFields([
      ...fields,
      { id: Date.now().toString(), label: 'New Field', value: '', placeholder: '' }
    ])
  }

  const removeField = (id: string) => {
    if (fields.length > 1) {
      setFields(fields.filter(f => f.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSave({ name: name.trim(), fields, notes: showNotes ? notes : undefined })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., My Business, Client ABC"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          This name helps you identify this contact in lists
        </p>
      </div>

      {/* Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Details
        </label>
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id} className="flex gap-2">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(field.id, 'label', e.target.value)}
                placeholder="Field label"
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => updateField(field.id, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => removeField(field.id)}
                disabled={fields.length <= 1}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addField}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Field
        </button>
      </div>

      {/* Notes (clients only) */}
      {showNotes && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about this client..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
