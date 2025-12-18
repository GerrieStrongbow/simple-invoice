'use client'

import { useState, useEffect } from 'react'
import {
  getClients,
  searchClients,
  createClientRecord,
  updateClient,
  deleteClient,
  setDefaultClient,
} from '@/lib/supabase/clients'
import type { Client } from '@/lib/supabase/types'
import type { SectionField } from '@/lib/types'
import { ContactForm } from './ContactForm'

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

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const loadClients = async (query?: string) => {
    try {
      setLoading(true)
      const data = query ? await searchClients(query) : await getClients()
      setClients(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadClients(searchQuery || undefined)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleCreate = async (data: { name: string; fields: SectionField[]; notes?: string }) => {
    await createClientRecord({
      name: data.name,
      fields: data.fields,
      notes: data.notes,
      is_default: clients.length === 0,
    })
    setShowAddForm(false)
    await loadClients()
  }

  const handleUpdate = async (id: string, data: { name: string; fields: SectionField[]; notes?: string }) => {
    await updateClient(id, {
      name: data.name,
      fields: data.fields,
      notes: data.notes,
    })
    setEditingId(null)
    await loadClients()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return
    await deleteClient(id)
    await loadClients()
  }

  const handleSetDefault = async (id: string) => {
    await setDefaultClient(id)
    await loadClients()
  }

  const renderContent = () => {
    if (loading) {
      return <div className="p-4 text-center text-ink-muted">Loading...</div>
    }

    if (error) {
      return <div className="p-4 text-error">{error}</div>
    }

    if (clients.length === 0) {
      return (
        <div className="text-center py-12 bg-paper-warm rounded-xl border border-border">
          <p className="text-ink-muted mb-4">
            {searchQuery ? 'No clients found' : 'No clients yet'}
          </p>
          {!searchQuery && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="text-accent hover:text-accent-soft transition-colors"
            >
              Add your first client
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white p-4 rounded-xl border border-border shadow-soft hover:shadow-md transition-shadow"
          >
            {editingId === client.id ? (
              <ContactForm
                initialName={client.name}
                initialFields={client.fields}
                initialNotes={client.notes || ''}
                showNotes
                onSave={(data) => handleUpdate(client.id, data)}
                onCancel={() => setEditingId(null)}
                submitLabel="Update Client"
              />
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-ink">{client.name}</h3>
                    {client.is_default && (
                      <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-ink-muted">
                    {client.fields
                      .filter(f => f.value)
                      .slice(0, 2)
                      .map(f => f.value)
                      .join(' • ')}
                  </div>
                  {client.notes && (
                    <div className="mt-1 text-sm text-ink-faint italic">
                      {client.notes.substring(0, 50)}
                      {client.notes.length > 50 ? '...' : ''}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-ink-faint italic">
                    {getDateLabel(client.created_at, client.updated_at)}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!client.is_default && (
                    <button
                      onClick={() => handleSetDefault(client.id)}
                      className="px-3 py-1 text-sm text-ink-muted hover:bg-paper-warm rounded-lg transition-colors"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => setEditingId(client.id)}
                    className="px-3 py-1 text-sm text-accent hover:bg-accent-muted rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
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
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h2 className="font-display text-2xl text-ink">Clients</h2>
        <div className="flex gap-4 flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="flex-1 px-4 py-2 border border-border rounded-lg bg-paper-warm/50 text-ink placeholder:text-ink-faint outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-muted"
          />
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-ink text-white rounded-lg font-medium transition hover:bg-ink-soft active:scale-[0.98] whitespace-nowrap"
            >
              Add Client
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl border border-border shadow-soft">
          <h3 className="font-display text-lg text-ink mb-4">New Client</h3>
          <ContactForm
            onSave={handleCreate}
            onCancel={() => setShowAddForm(false)}
            submitLabel="Create Client"
            showNotes
          />
        </div>
      )}

      {renderContent()}
    </div>
  )
}
