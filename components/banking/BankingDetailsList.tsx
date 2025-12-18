'use client'

import { useState, useEffect } from 'react'
import {
  getBankingDetails,
  createBankingDetails,
  updateBankingDetails,
  deleteBankingDetails,
  setDefaultBankingDetails,
} from '@/lib/supabase/banking-details'
import type { BankingDetails } from '@/lib/supabase/types'
import type { SectionField } from '@/lib/types'
import { ContactForm } from '@/components/contacts/ContactForm'

const DEFAULT_BANKING_FIELDS: SectionField[] = [
  { id: '1', label: 'Bank Name', value: '', placeholder: 'Enter bank name' },
  { id: '2', label: 'Account Name', value: '', placeholder: 'Account holder name' },
  { id: '3', label: 'Account Number', value: '', placeholder: 'Account number' },
  { id: '4', label: 'Routing Number', value: '', placeholder: 'Routing/Sort code' },
  { id: '5', label: 'SWIFT/BIC', value: '', placeholder: 'SWIFT or BIC code' },
  { id: '6', label: 'IBAN', value: '', placeholder: 'IBAN (if applicable)' },
]

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function getDateLabel(createdAt: string, updatedAt: string): string {
  const created = new Date(createdAt)
  const updated = new Date(updatedAt)
  // If updated more than 1 minute after created, show "Updated"
  if (updated.getTime() - created.getTime() > 60000) {
    return `Updated ${formatDate(updatedAt)}`
  }
  return `Created ${formatDate(createdAt)}`
}

export function BankingDetailsList() {
  const [bankingDetails, setBankingDetails] = useState<BankingDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const loadBankingDetails = async () => {
    try {
      setLoading(true)
      const data = await getBankingDetails()
      setBankingDetails(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load banking details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBankingDetails()
  }, [])

  const handleCreate = async (data: { name: string; fields: SectionField[] }) => {
    await createBankingDetails({
      name: data.name,
      fields: data.fields,
      is_default: bankingDetails.length === 0, // First one is default
    })
    setShowAddForm(false)
    await loadBankingDetails()
  }

  const handleUpdate = async (id: string, data: { name: string; fields: SectionField[] }) => {
    await updateBankingDetails(id, {
      name: data.name,
      fields: data.fields,
    })
    setEditingId(null)
    await loadBankingDetails()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete these banking details?')) return
    await deleteBankingDetails(id)
    await loadBankingDetails()
  }

  const handleSetDefault = async (id: string) => {
    await setDefaultBankingDetails(id)
    await loadBankingDetails()
  }

  if (loading) {
    return <div className="p-4 text-center text-ink-muted">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-error">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl text-ink">Banking Details</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-ink text-white rounded-lg font-medium transition hover:bg-ink-soft active:scale-[0.98]"
          >
            Add Banking Details
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl border border-border shadow-soft">
          <h3 className="font-display text-lg text-ink mb-4">New Banking Details</h3>
          <ContactForm
            onSave={handleCreate}
            onCancel={() => setShowAddForm(false)}
            submitLabel="Save Banking Details"
            namePlaceholder="Main Business Account"
            defaultFields={DEFAULT_BANKING_FIELDS}
          />
        </div>
      )}

      {bankingDetails.length === 0 && !showAddForm ? (
        <div className="text-center py-12 bg-paper-warm rounded-xl border border-border">
          <p className="text-ink-muted mb-4">No banking details saved yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-accent hover:text-accent-soft transition-colors"
          >
            Add your first banking details
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bankingDetails.map((details) => (
            <div
              key={details.id}
              className="bg-white p-4 rounded-xl border border-border shadow-soft hover:shadow-md transition-shadow"
            >
              {editingId === details.id ? (
                <ContactForm
                  initialName={details.name}
                  initialFields={details.fields}
                  onSave={(data) => handleUpdate(details.id, data)}
                  onCancel={() => setEditingId(null)}
                  submitLabel="Update Banking Details"
                  namePlaceholder="Main Business Account"
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-ink">{details.name}</h3>
                      {details.is_default && (
                        <span className="px-2 py-0.5 bg-accent-muted text-accent text-xs rounded-full font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-ink-muted">
                      {details.fields
                        .filter(f => f.value)
                        .slice(0, 2)
                        .map(f => f.value)
                        .join(' • ')}
                    </div>
                    <div className="mt-1 text-xs text-ink-faint italic">
                      {getDateLabel(details.created_at, details.updated_at)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!details.is_default && (
                      <button
                        onClick={() => handleSetDefault(details.id)}
                        className="px-3 py-1 text-sm text-ink-muted hover:bg-paper-warm rounded-lg transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => setEditingId(details.id)}
                      className="px-3 py-1 text-sm text-accent hover:bg-accent-muted rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(details.id)}
                      className="px-3 py-1 text-sm text-error hover:bg-error/5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
