'use client'

import { useState, useEffect } from 'react'
import { getBankingDetails } from '@/lib/supabase/banking-details'
import type { BankingDetails } from '@/lib/supabase/types'
import type { SectionField } from '@/lib/types'

export interface BankingSelection {
  id: string
  name: string
  fields: SectionField[]
}

interface BankingSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (selection: BankingSelection) => void
}

export function BankingSelectorModal({
  isOpen,
  onClose,
  onSelect,
}: Readonly<BankingSelectorModalProps>) {
  const [items, setItems] = useState<BankingDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen) return

    const load = async () => {
      setLoading(true)
      try {
        const data = await getBankingDetails()
        setItems(data)
      } catch (error) {
        console.error('Failed to load banking details:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isOpen])

  if (!isOpen) return null

  const handleSelect = (item: BankingDetails) => {
    onSelect({
      id: item.id,
      name: item.name,
      fields: item.fields
    })
    onClose()
  }

  const renderContent = () => {
    if (loading) {
      return <div className="p-4 text-center text-ink-muted">Loading...</div>
    }

    if (items.length === 0) {
      return (
        <div className="p-4 text-center text-ink-muted">
          No saved banking details found
        </div>
      )
    }

    return (
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            className="w-full text-left p-3 rounded-lg hover:bg-paper-warm transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-ink">{item.name}</span>
              {item.is_default && (
                <span className="px-2 py-0.5 bg-accent-muted text-accent text-xs rounded-full font-medium">
                  Default
                </span>
              )}
            </div>
            <div className="text-sm text-ink-muted mt-0.5">
              {item.fields
                .filter(f => f.value)
                .slice(0, 2)
                .map(f => f.value)
                .join(' • ')}
            </div>
          </button>
        ))}
      </div>
    )
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
      <div className="relative bg-white rounded-xl shadow-xl border border-border w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-lg text-ink">
              Select Banking Details
            </h2>
            <button
              onClick={onClose}
              className="text-ink-muted hover:text-ink transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-96 p-2">
          {renderContent()}
        </div>

        <div className="p-4 border-t border-border bg-paper-warm">
          <a
            href="/contacts/banking"
            className="text-sm text-accent hover:text-accent-soft transition-colors"
          >
            Manage Banking Details →
          </a>
        </div>
      </div>
    </div>
  )
}
