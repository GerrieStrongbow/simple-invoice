# Phase 4: Data Layer (CRUD Operations)

## Objective
Create functions to read/write business profiles and clients from Supabase.

## Prerequisites
- Phase 2 complete (Supabase clients configured)
- Phase 1 complete (database tables exist)

**Note**: This phase can run in parallel with Phase 3 (Authentication).

## Files to Create

### 1. Business Profiles CRUD
**Path**: `/lib/supabase/business-profiles.ts`

```typescript
import { createClient } from './client'
import type { BusinessProfile, BusinessProfileInsert, BusinessProfileUpdate } from './types'

const supabase = createClient()

/**
 * Get all business profiles for the current user
 */
export async function getBusinessProfiles(): Promise<BusinessProfile[]> {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get a single business profile by ID
 */
export async function getBusinessProfile(id: string): Promise<BusinessProfile | null> {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}

/**
 * Get the default business profile for the current user
 */
export async function getDefaultBusinessProfile(): Promise<BusinessProfile | null> {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('*')
    .eq('is_default', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No default set
    throw error
  }
  return data
}

/**
 * Create a new business profile
 */
export async function createBusinessProfile(
  profile: BusinessProfileInsert
): Promise<BusinessProfile> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('business_profiles')
    .insert({
      ...profile,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a business profile
 */
export async function updateBusinessProfile(
  id: string,
  updates: BusinessProfileUpdate
): Promise<BusinessProfile> {
  const { data, error } = await supabase
    .from('business_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a business profile
 */
export async function deleteBusinessProfile(id: string): Promise<void> {
  const { error } = await supabase
    .from('business_profiles')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Set a business profile as the default (unsets any existing default)
 */
export async function setDefaultBusinessProfile(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // First, unset any existing default
  await supabase
    .from('business_profiles')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true)

  // Then set the new default
  const { error } = await supabase
    .from('business_profiles')
    .update({ is_default: true })
    .eq('id', id)

  if (error) throw error
}

/**
 * Clear default business profile
 */
export async function clearDefaultBusinessProfile(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('business_profiles')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true)

  if (error) throw error
}
```

---

### 2. Clients CRUD
**Path**: `/lib/supabase/clients.ts`

```typescript
import { createClient } from './client'
import type { Client, ClientInsert, ClientUpdate } from './types'

const supabase = createClient()

/**
 * Get all clients for the current user
 */
export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

/**
 * Get a single client by ID
 */
export async function getClient(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  return data
}

/**
 * Get the default client for the current user
 */
export async function getDefaultClient(): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('is_default', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No default set
    throw error
  }
  return data
}

/**
 * Search clients by name
 */
export async function searchClients(query: string): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name', { ascending: true })
    .limit(20)

  if (error) throw error
  return data || []
}

/**
 * Create a new client
 */
export async function createClient(client: ClientInsert): Promise<Client> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('clients')
    .insert({
      ...client,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a client
 */
export async function updateClient(
  id: string,
  updates: ClientUpdate
): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a client
 */
export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Set a client as the default (unsets any existing default)
 */
export async function setDefaultClient(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // First, unset any existing default
  await supabase
    .from('clients')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true)

  // Then set the new default
  const { error } = await supabase
    .from('clients')
    .update({ is_default: true })
    .eq('id', id)

  if (error) throw error
}

/**
 * Clear default client
 */
export async function clearDefaultClient(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('clients')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true)

  if (error) throw error
}
```

---

### 3. Barrel Export (Optional)
**Path**: `/lib/supabase/index.ts`

```typescript
// Clients
export { createClient } from './client'
export { createClient as createServerClient } from './server'

// Business Profiles
export {
  getBusinessProfiles,
  getBusinessProfile,
  getDefaultBusinessProfile,
  createBusinessProfile,
  updateBusinessProfile,
  deleteBusinessProfile,
  setDefaultBusinessProfile,
  clearDefaultBusinessProfile,
} from './business-profiles'

// Clients
export {
  getClients,
  getClient,
  getDefaultClient,
  searchClients,
  createClient as createClientRecord,
  updateClient,
  deleteClient,
  setDefaultClient,
  clearDefaultClient,
} from './clients'

// Types
export type {
  BusinessProfile,
  BusinessProfileInsert,
  BusinessProfileUpdate,
  Client,
  ClientInsert,
  ClientUpdate,
} from './types'
```

---

## File Structure After This Phase

```
/lib/supabase/
  client.ts              # Browser client (Phase 2)
  server.ts              # Server client (Phase 2)
  middleware.ts          # Session helper (Phase 2)
  types.ts               # TypeScript types (Phase 2)
  business-profiles.ts   # Business profile CRUD (NEW)
  clients.ts             # Client CRUD (NEW)
  index.ts               # Barrel exports (NEW, optional)
```

## Acceptance Criteria

- [ ] Both CRUD files created
- [ ] No TypeScript errors
- [ ] Can import functions without errors

## Testing the Data Layer

Create a temporary test page or use browser console:

```typescript
// In a 'use client' component after login:
import {
  createBusinessProfile,
  getBusinessProfiles,
  createClient as createClientRecord,
  getClients
} from '@/lib/supabase'

// Test creating a business profile
const profile = await createBusinessProfile({
  name: 'My Business',
  fields: [
    { id: '1', label: 'Business Name', value: 'Acme Corp', placeholder: '' },
    { id: '2', label: 'Email', value: 'info@acme.com', placeholder: '' },
  ],
  is_default: true,
})
console.log('Created profile:', profile)

// Test getting all profiles
const profiles = await getBusinessProfiles()
console.log('All profiles:', profiles)

// Test creating a client
const client = await createClientRecord({
  name: 'Client ABC',
  fields: [
    { id: '1', label: 'Client Name', value: 'ABC Corp', placeholder: '' },
  ],
})
console.log('Created client:', client)

// Test getting all clients
const clients = await getClients()
console.log('All clients:', clients)
```

## Important Notes

1. **RLS Protection**: All queries automatically filter by `user_id` due to RLS policies
2. **Authentication Required**: Functions throw error if user not logged in
3. **Default Handling**: Only one default per type allowed (enforced by DB index)
4. **Search**: Client search uses `ilike` for case-insensitive partial matching

## Next Phase
→ [05-contact-pages.md](./05-contact-pages.md)
