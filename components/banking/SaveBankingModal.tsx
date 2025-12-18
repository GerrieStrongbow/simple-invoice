'use client'

import { useState } from 'react'
import { createBankingDetails } from '@/lib/supabase/banking-details'
import type { SectionField } from '@/lib/types'

interface SaveBankingModalProps {
  fields: SectionField[]
  isOpen: boolean
  onClose: () => void
  onSaved: (id: string, name: string) => void
}

export function SaveBankingModal({
  fields,
  isOpen,
  onClose,
  onSaved,
}: Readonly<SaveBankingModalProps>) {
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
      const createdRecord = await createBankingDetails({
        name: name.trim(),
        fields,
        is_default: setAsDefault,
      })
      const savedName = name.trim()
      setName('')
      setSetAsDefault(false)
      onSaved(createdRecord.id, savedName)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl border border-border w-full max-w-sm p-6">
        <h2 className="font-display text-lg text-ink mb-4">
          Save Banking Details
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="banking-name" className="block text-sm font-medium text-ink-soft mb-1.5">
              Name
            </label>
            <input
              id="banking-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Main Business Account"
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-paper-warm/50 text-ink placeholder:text-ink-faint outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-muted"
              autoFocus
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={setAsDefault}
              onChange={(e) => setSetAsDefault(e.target.checked)}
              className="rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-sm text-ink-soft">Set as default</span>
          </label>

          {error && (
            <div className="p-3 bg-error/5 border border-error/20 text-error rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-ink-soft border border-border rounded-lg hover:bg-paper-warm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-ink text-white rounded-lg font-medium transition hover:bg-ink-soft active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
