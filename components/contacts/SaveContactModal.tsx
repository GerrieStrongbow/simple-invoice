'use client'

import { useState } from 'react'
import { createBusinessProfile } from '@/lib/supabase/business-profiles'
import { createClientRecord } from '@/lib/supabase/clients'
import type { SectionField } from '@/lib/types'

interface SaveContactModalProps {
  type: 'business' | 'client'
  fields: SectionField[]
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

export function SaveContactModal({
  type,
  fields,
  isOpen,
  onClose,
  onSaved,
}: SaveContactModalProps) {
  const [name, setName] = useState('')
  const [setAsDefault, setSetAsDefault] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (type === 'business') {
        await createBusinessProfile({
          name: name.trim(),
          fields,
          is_default: setAsDefault,
        })
      } else {
        await createClientRecord({
          name: name.trim(),
          fields,
          is_default: setAsDefault,
        })
      }
      onSaved()
      onClose()
      setName('')
      setSetAsDefault(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Save as {type === 'business' ? 'Business Profile' : 'Client'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'business' ? 'My Business' : 'Client Name'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={setAsDefault}
              onChange={(e) => setSetAsDefault(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Set as default</span>
          </label>

          {error && (
            <div className="p-2 bg-red-100 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
