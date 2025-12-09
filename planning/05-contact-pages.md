# Phase 5: Contact Management Pages

## Objective
Create pages to view, add, edit, and delete business profiles and clients.

## Prerequisites
- Phase 3 complete (Authentication working)
- Phase 4 complete (CRUD functions available)

## Files to Create

### 1. Contact Form Component (Shared)
**Path**: `/components/contacts/ContactForm.tsx`

```typescript
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
```

---

### 2. Business Profile List Component
**Path**: `/components/contacts/BusinessProfileList.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import {
  getBusinessProfiles,
  createBusinessProfile,
  updateBusinessProfile,
  deleteBusinessProfile,
  setDefaultBusinessProfile,
} from '@/lib/supabase/business-profiles'
import type { BusinessProfile } from '@/lib/supabase/types'
import { ContactForm } from './ContactForm'

export function BusinessProfileList() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const loadProfiles = async () => {
    try {
      setLoading(true)
      const data = await getBusinessProfiles()
      setProfiles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profiles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  const handleCreate = async (data: { name: string; fields: any[] }) => {
    await createBusinessProfile({
      name: data.name,
      fields: data.fields,
      is_default: profiles.length === 0, // First one is default
    })
    setShowAddForm(false)
    await loadProfiles()
  }

  const handleUpdate = async (id: string, data: { name: string; fields: any[] }) => {
    await updateBusinessProfile(id, {
      name: data.name,
      fields: data.fields,
    })
    setEditingId(null)
    await loadProfiles()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return
    await deleteBusinessProfile(id)
    await loadProfiles()
  }

  const handleSetDefault = async (id: string) => {
    await setDefaultBusinessProfile(id)
    await loadProfiles()
  }

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Business Profiles</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Profile
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">New Business Profile</h3>
          <ContactForm
            onSave={handleCreate}
            onCancel={() => setShowAddForm(false)}
            submitLabel="Create Profile"
          />
        </div>
      )}

      {profiles.length === 0 && !showAddForm ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No business profiles yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 hover:underline"
          >
            Create your first profile
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white p-4 rounded-lg border hover:shadow-sm transition-shadow"
            >
              {editingId === profile.id ? (
                <ContactForm
                  initialName={profile.name}
                  initialFields={profile.fields}
                  onSave={(data) => handleUpdate(profile.id, data)}
                  onCancel={() => setEditingId(null)}
                  submitLabel="Update Profile"
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{profile.name}</h3>
                      {profile.is_default && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {profile.fields
                        .filter(f => f.value)
                        .slice(0, 2)
                        .map(f => f.value)
                        .join(' • ')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!profile.is_default && (
                      <button
                        onClick={() => handleSetDefault(profile.id)}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => setEditingId(profile.id)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id)}
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
```

---

### 3. Client List Component
**Path**: `/components/contacts/ClientList.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import {
  getClients,
  searchClients,
  createClient,
  updateClient,
  deleteClient,
  setDefaultClient,
} from '@/lib/supabase/clients'
import type { Client } from '@/lib/supabase/types'
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

  const handleCreate = async (data: { name: string; fields: any[]; notes?: string }) => {
    await createClient({
      name: data.name,
      fields: data.fields,
      notes: data.notes,
      is_default: clients.length === 0,
    })
    setShowAddForm(false)
    await loadClients()
  }

  const handleUpdate = async (id: string, data: { name: string; fields: any[]; notes?: string }) => {
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
```

---

### 4. Contacts Overview Page
**Path**: `/app/contacts/page.tsx`

```typescript
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8">Contacts</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/contacts/business"
            className="block p-6 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-2">Business Profiles</h2>
            <p className="text-gray-500 text-sm">
              Manage your business information that appears in the "From" section of invoices.
            </p>
          </Link>

          <Link
            href="/contacts/clients"
            className="block p-6 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-2">Clients</h2>
            <p className="text-gray-500 text-sm">
              Manage your client list for the "To" section of invoices.
            </p>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Invoice
          </Link>
        </div>
      </div>
    </div>
  )
}
```

---

### 5. Business Profiles Page
**Path**: `/app/contacts/business/page.tsx`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BusinessProfileList } from '@/components/contacts/BusinessProfileList'
import Link from 'next/link'

export default async function BusinessProfilesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/contacts" className="text-blue-600 hover:underline text-sm">
            ← Back to Contacts
          </Link>
        </div>
        <BusinessProfileList />
      </div>
    </div>
  )
}
```

---

### 6. Clients Page
**Path**: `/app/contacts/clients/page.tsx`

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClientList } from '@/components/contacts/ClientList'
import Link from 'next/link'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/contacts" className="text-blue-600 hover:underline text-sm">
            ← Back to Contacts
          </Link>
        </div>
        <ClientList />
      </div>
    </div>
  )
}
```

---

## File Structure After This Phase

```
/components/contacts/
  ContactForm.tsx          # Shared form component
  BusinessProfileList.tsx  # Business profiles CRUD UI
  ClientList.tsx           # Clients CRUD UI

/app/contacts/
  page.tsx                 # Overview/dashboard
  business/page.tsx        # Business profiles page
  clients/page.tsx         # Clients page
```

## Acceptance Criteria

- [ ] All 6 files created
- [ ] `/contacts` redirects to login if not authenticated
- [ ] Can create, read, update, delete business profiles
- [ ] Can create, read, update, delete clients
- [ ] Can search clients by name
- [ ] Can set default for both types
- [ ] First created item automatically becomes default

## Testing

1. Sign in at `/login`
2. Navigate to `/contacts`
3. Click "Business Profiles"
4. Create a new profile
5. Verify it appears in the list
6. Edit and delete work correctly
7. Repeat for Clients
8. Test search functionality

## Next Phase
→ [06-invoice-integration.md](./06-invoice-integration.md)
