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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <h2 className="text-xl font-semibold">Clients</h2>
        <div className="flex gap-4 flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
            >
              Add Client
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">New Client</h3>
          <ContactForm
            onSave={handleCreate}
            onCancel={() => setShowAddForm(false)}
            submitLabel="Create Client"
            showNotes
          />
        </div>
      )}

      {loading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'No clients found' : 'No clients yet'}
          </p>
          {!searchQuery && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="text-blue-600 hover:underline"
            >
              Add your first client
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white p-4 rounded-lg border hover:shadow-sm transition-shadow"
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
                      <h3 className="font-medium">{client.name}</h3>
                      {client.is_default && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {client.fields
                        .filter(f => f.value)
                        .slice(0, 2)
                        .map(f => f.value)
                        .join(' • ')}
                    </div>
                    {client.notes && (
                      <div className="mt-1 text-sm text-gray-400 italic">
                        {client.notes.substring(0, 50)}
                        {client.notes.length > 50 ? '...' : ''}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!client.is_default && (
                      <button
                        onClick={() => handleSetDefault(client.id)}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => setEditingId(client.id)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
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
