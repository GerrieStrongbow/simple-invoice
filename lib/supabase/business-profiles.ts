import { createClient } from './client'
import type { BusinessProfile, BusinessProfileInsert, BusinessProfileUpdate } from './types'

/**
 * Get all business profiles for the current user
 */
export async function getBusinessProfiles(): Promise<BusinessProfile[]> {
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
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
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('business_profiles')
    .update({ is_default: false })
    .eq('user_id', user.id)
    .eq('is_default', true)

  if (error) throw error
}
