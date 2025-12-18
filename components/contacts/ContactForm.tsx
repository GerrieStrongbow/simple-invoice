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
  namePlaceholder?: string
  defaultFields?: SectionField[]
}

const DEFAULT_CONTACT_FIELDS: SectionField[] = [
  { id: '1', label: 'Business Name', value: '', placeholder: 'Enter name' },
  { id: '2', label: 'Address', value: '', placeholder: 'Street address' },
  { id: '3', label: 'City', value: '', placeholder: 'City' },
  { id: '4', label: 'Country', value: '', placeholder: 'Country' },
  { id: '5', label: 'Email', value: '', placeholder: 'email@example.com' },
  { id: '6', label: 'Phone', value: '', placeholder: '+1 234 567 8900' },
]

export function ContactForm({
  initialName = '',
  initialFields,
  initialNotes = '',
  showNotes = false,
  onSave,
  onCancel,
  submitLabel = 'Save',
  namePlaceholder = 'e.g., My Business, Client ABC',
  defaultFields = DEFAULT_CONTACT_FIELDS,
}: Readonly<ContactFormProps>) {
  const [name, setName] = useState(initialName)
  const [fields, setFields] = useState<SectionField[]>(initialFields || defaultFields)
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
        <label htmlFor="contact-display-name" className="block text-sm font-medium text-ink-soft mb-1.5">
          Display Name *
        </label>
        <input
          id="contact-display-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={namePlaceholder}
          className="w-full px-4 py-2.5 border border-border rounded-lg bg-paper-warm/50 text-ink placeholder:text-ink-faint outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-muted"
          required
        />
        <p className="mt-1.5 text-sm text-ink-muted">
          This name helps you identify this contact in lists
        </p>
      </div>

      {/* Fields */}
      <fieldset>
        <legend className="block text-sm font-medium text-ink-soft mb-2">
          Contact Details
        </legend>
        <div className="space-y-3">
          {fields.map((field) => (
            <div key={field.id} className="flex gap-2">
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(field.id, 'label', e.target.value)}
                placeholder="Field label"
                className="w-1/3 px-3 py-2.5 border border-border rounded-lg bg-paper-warm/50 text-ink text-sm placeholder:text-ink-faint outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-muted"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => updateField(field.id, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-2.5 border border-border rounded-lg bg-paper-warm/50 text-ink placeholder:text-ink-faint outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-muted"
              />
              <button
                type="button"
                onClick={() => removeField(field.id)}
                disabled={fields.length <= 1}
                className="px-3 py-2 text-error hover:bg-error/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addField}
          className="mt-3 text-sm text-accent hover:text-accent-soft transition-colors"
        >
          + Add Field
        </button>
      </fieldset>

      {/* Notes (clients only) */}
      {showNotes && (
        <div>
          <label htmlFor="contact-notes" className="block text-sm font-medium text-ink-soft mb-1.5">
            Notes (optional)
          </label>
          <textarea
            id="contact-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about this client..."
            rows={3}
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-paper-warm/50 text-ink placeholder:text-ink-faint outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-muted resize-none"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-error/5 border border-error/20 text-error rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-ink-soft border border-border rounded-lg hover:bg-paper-warm transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-ink text-white rounded-lg font-medium transition hover:bg-ink-soft active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
