# Phase 6: Invoice Editor Integration

## Objective
Integrate saved contacts into the invoice editor with Load/Save buttons and auto-load defaults.

## Prerequisites
- Phase 3 complete (Authentication working)
- Phase 4 complete (CRUD functions available)
- Phase 5 complete (Contact management pages working)

## Files to Create/Modify

### 1. Contact Selector Modal
**Path**: `/components/contacts/ContactSelectorModal.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getBusinessProfiles } from '@/lib/supabase/business-profiles'
import { getClients, searchClients } from '@/lib/supabase/clients'
import type { BusinessProfile, Client } from '@/lib/supabase/types'
import type { SectionField } from '@/lib/types'

interface ContactSelectorModalProps {
  type: 'business' | 'client'
  isOpen: boolean
  onClose: () => void
  onSelect: (fields: SectionField[]) => void
}

export function ContactSelectorModal({
  type,
  isOpen,
  onClose,
  onSelect,
}: ContactSelectorModalProps) {
  const [items, setItems] = useState<(BusinessProfile | Client)[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isOpen) return

    const load = async () => {
      setLoading(true)
      try {
        if (type === 'business') {
          const data = await getBusinessProfiles()
          setItems(data)
        } else {
          const data = searchQuery
            ? await searchClients(searchQuery)
            : await getClients()
          setItems(data)
        }
      } catch (error) {
        console.error('Failed to load contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isOpen, type, searchQuery])

  if (!isOpen) return null

  const handleSelect = (item: BusinessProfile | Client) => {
    onSelect(item.fields)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Select {type === 'business' ? 'Business Profile' : 'Client'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Search (clients only) */}
          {type === 'client' && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          )}
        </div>

        <div className="overflow-y-auto max-h-96 p-2">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No {type === 'business' ? 'profiles' : 'clients'} found
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    {item.is_default && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {item.fields
                      .filter(f => f.value)
                      .slice(0, 2)
                      .map(f => f.value)
                      .join(' • ')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <a
            href={`/contacts/${type === 'business' ? 'business' : 'clients'}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Manage {type === 'business' ? 'Business Profiles' : 'Clients'} →
          </a>
        </div>
      </div>
    </div>
  )
}
```

---

### 2. Save Contact Modal
**Path**: `/components/contacts/SaveContactModal.tsx`

```typescript
'use client'

import { useState } from 'react'
import { createBusinessProfile } from '@/lib/supabase/business-profiles'
import { createClient } from '@/lib/supabase/clients'
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
        await createClient({
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
```

---

### 3. Modify ContactDetails Component
**Path**: `/components/invoice-editor/ContactDetails.tsx` (MODIFY)

Add Load/Save buttons. This shows the additions needed:

```typescript
// Add these imports at the top
import { useAuth } from '@/components/auth/AuthProvider'
import { ContactSelectorModal } from '@/components/contacts/ContactSelectorModal'
import { SaveContactModal } from '@/components/contacts/SaveContactModal'

// Inside the component, add state for modals:
const { user } = useAuth()
const [showLoadModal, setShowLoadModal] = useState(false)
const [showSaveModal, setShowSaveModal] = useState(false)

// Add buttons next to the section title (From: or To:)
// Example for "From" section:
<div className="flex items-center justify-between mb-2">
  <EditableField ... />  {/* Existing title field */}

  {user && (
    <div className="flex gap-1">
      <button
        onClick={() => setShowLoadModal(true)}
        className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
        title="Load saved contact"
      >
        Load
      </button>
      <button
        onClick={() => setShowSaveModal(true)}
        className="px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded"
        title="Save as contact"
      >
        Save
      </button>
    </div>
  )}
</div>

// Add modals at the end of the component:
<ContactSelectorModal
  type="business"  // or "client" for To section
  isOpen={showLoadModal}
  onClose={() => setShowLoadModal(false)}
  onSelect={(fields) => {
    // Call the parent's update function to replace fields
    onFromFieldsChange(fields)  // or onToFieldsChange
  }}
/>

<SaveContactModal
  type="business"  // or "client" for To section
  fields={fromFields}  // or toFields
  isOpen={showSaveModal}
  onClose={() => setShowSaveModal(false)}
  onSaved={() => {
    // Optionally show success message
  }}
/>
```

**Note**: The exact implementation depends on the current structure of `ContactDetails.tsx`. The key additions are:
1. Import auth and modal components
2. Add state for modal visibility
3. Add Load/Save buttons (visible only when logged in)
4. Add modal components

---

### 4. Modify InvoiceEditor for Auto-Load
**Path**: `/components/invoice-editor/InvoiceEditor.tsx` (MODIFY)

Add logic to load default contacts on mount:

```typescript
// Add imports
import { useAuth } from '@/components/auth/AuthProvider'
import { getDefaultBusinessProfile } from '@/lib/supabase/business-profiles'
import { getDefaultClient } from '@/lib/supabase/clients'

// Inside the component:
const { user } = useAuth()

// Add useEffect to load defaults when user logs in
useEffect(() => {
  if (!user) return

  const loadDefaults = async () => {
    try {
      // Load default business profile
      const defaultProfile = await getDefaultBusinessProfile()
      if (defaultProfile) {
        // Update the from fields with the default profile
        setInvoiceData(prev => ({
          ...prev,
          from: {
            ...prev.from,
            fields: defaultProfile.fields,
          }
        }))
      }

      // Load default client
      const defaultClient = await getDefaultClient()
      if (defaultClient) {
        // Update the to fields with the default client
        setInvoiceData(prev => ({
          ...prev,
          to: {
            ...prev.to,
            fields: defaultClient.fields,
          }
        }))
      }
    } catch (error) {
      console.error('Failed to load default contacts:', error)
    }
  }

  loadDefaults()
}, [user])
```

---

### 5. Auto-Migrate localStorage on First Login
**Path**: `/components/invoice-editor/InvoiceEditor.tsx` (MODIFY - Additional)

Add migration logic:

```typescript
// Add to the useEffect that runs on user login
useEffect(() => {
  if (!user) return

  const migrateLocalStorage = async () => {
    // Check if we've already migrated
    const migrated = localStorage.getItem('supabase_migrated')
    if (migrated) return

    // Get current localStorage data
    const stored = localStorage.getItem('invoiceData')
    if (!stored) return

    try {
      const data = JSON.parse(stored)

      // Check if there's meaningful From data to migrate
      const fromHasData = data.from?.fields?.some((f: any) => f.value?.trim())
      if (fromHasData) {
        // Create a business profile from current From data
        await createBusinessProfile({
          name: 'Imported from Invoice',
          fields: data.from.fields,
          is_default: true,
        })
      }

      // Check if there's meaningful To data to migrate
      const toHasData = data.to?.fields?.some((f: any) => f.value?.trim())
      if (toHasData) {
        // Create a client from current To data
        await createClient({
          name: 'Imported Client',
          fields: data.to.fields,
          is_default: true,
        })
      }

      // Mark as migrated
      localStorage.setItem('supabase_migrated', 'true')
    } catch (error) {
      console.error('Failed to migrate localStorage:', error)
    }
  }

  migrateLocalStorage()
}, [user])
```

---

### 6. Update Layout with Header
**Path**: `/app/layout.tsx` (MODIFY)

Add a header with navigation:

```typescript
import { AuthProvider } from '@/components/auth/AuthProvider'
import { UserMenu } from '@/components/auth/UserMenu'
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Header */}
          <header className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="font-semibold text-lg">
                  Simple Invoice
                </Link>
                <nav className="hidden sm:flex gap-4">
                  <Link
                    href="/contacts"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Contacts
                  </Link>
                </nav>
              </div>
              <UserMenu />
            </div>
          </header>

          {/* Main content */}
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
```

---

## File Structure After This Phase

```
/components/contacts/
  ContactForm.tsx           # (Phase 5)
  BusinessProfileList.tsx   # (Phase 5)
  ClientList.tsx            # (Phase 5)
  ContactSelectorModal.tsx  # NEW - Load contact modal
  SaveContactModal.tsx      # NEW - Save contact modal

/components/invoice-editor/
  ContactDetails.tsx        # MODIFIED - Added Load/Save buttons
  InvoiceEditor.tsx         # MODIFIED - Auto-load defaults, migration

/app/layout.tsx             # MODIFIED - Added header with nav
```

## Acceptance Criteria

- [ ] Both modal components created
- [ ] Load button shows when logged in (From and To sections)
- [ ] Save button shows when logged in (From and To sections)
- [ ] Clicking Load opens selector modal
- [ ] Selecting a contact updates the invoice fields
- [ ] Clicking Save opens save modal
- [ ] Saving creates new contact in database
- [ ] Default contacts auto-load on page load (when logged in)
- [ ] localStorage data migrates on first login
- [ ] Header shows with Contacts link and user menu

## Testing

1. Start fresh (logged out)
2. Fill in From/To information
3. Sign up / Sign in
4. Verify localStorage data migrated (check /contacts)
5. Refresh page - defaults should auto-load
6. Test Load button - should show saved contacts
7. Test Save button - should save current data
8. Sign out - Load/Save buttons should disappear
9. App still works without login (localStorage only)

## Complete Integration Summary

After all 6 phases, users can:
1. Use the app without an account (localStorage)
2. Sign up to sync across devices
3. Save From/To as reusable contacts
4. Load saved contacts into invoices
5. Set default contacts for new invoices
6. Manage contacts on dedicated pages
7. Existing data migrates on first login

## Production Deployment (Future)

When ready to go live:
1. Create Supabase cloud project
2. `supabase link --project-ref <id>`
3. `supabase db push`
4. Update environment variables
5. Deploy to Vercel/etc.
