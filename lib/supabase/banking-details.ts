import { createClient } from './client'
import type { BankingDetails, BankingDetailsInsert, BankingDetailsUpdate } from './types'

/**
 * Get all banking details for the current user
 */
export async function getBankingDetails(): Promise<BankingDetails[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('banking_details')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Get a single banking detail record by ID
 */
export async function getBankingDetail(id: string): Promise<BankingDetails | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('banking_details')
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
 * Get the default banking details for the current user
 */
export async function getDefaultBankingDetails(): Promise<BankingDetails | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('banking_details')
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
 * Create a new banking detail record
 */
export async function createBankingDetails(
  bankingDetails: BankingDetailsInsert
): Promise<BankingDetails> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('banking_details')
    .insert({
      ...bankingDetails,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update banking details
 */
export async function updateBankingDetails(
  id: string,
  updates: BankingDetailsUpdate
): Promise<BankingDetails> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('banking_details')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete banking details
 */
export async function deleteBankingDetails(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('banking_details')
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Set banking details as the default (unsets any existing default)
 */
export async function setDefaultBankingDetails(id: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // First, unset any existing default
  await supabase
    .from('banking_details')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true)

  // Then set the new default
  const { error } = await supabase
    .from('banking_details')
    .update({ is_default: true })
    .eq('id', id)

  if (error) throw error
}

/**
 * Clear default banking details
 */
export async function clearDefaultBankingDetails(): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('banking_details')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true)

  if (error) throw error
}
