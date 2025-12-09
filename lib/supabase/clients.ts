import { createClient } from './client'
import type { Client, ClientInsert, ClientUpdate } from './types'

/**
 * Get all clients for the current user
 */
export async function getClients(): Promise<Client[]> {
  const supabase = createClient()
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
export async function getClientById(id: string): Promise<Client | null> {
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
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
export async function createClientRecord(client: ClientInsert): Promise<Client> {
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('clients')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true)

  if (error) throw error
}
