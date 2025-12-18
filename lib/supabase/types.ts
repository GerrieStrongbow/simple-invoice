import type { SectionField } from '@/lib/types'

// Database row types
export interface BusinessProfile {
  id: string
  user_id: string
  name: string
  fields: SectionField[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  fields: SectionField[]
  is_default: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

// Insert types (without id, timestamps)
export interface BusinessProfileInsert {
  name: string
  fields: SectionField[]
  is_default?: boolean
}

export interface ClientInsert {
  name: string
  fields: SectionField[]
  is_default?: boolean
  notes?: string
}

// Update types (all optional)
export interface BusinessProfileUpdate {
  name?: string
  fields?: SectionField[]
  is_default?: boolean
}

export interface ClientUpdate {
  name?: string
  fields?: SectionField[]
  is_default?: boolean
  notes?: string
}

// Banking details types
export interface BankingDetails {
  id: string
  user_id: string
  name: string
  fields: SectionField[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface BankingDetailsInsert {
  name: string
  fields: SectionField[]
  is_default?: boolean
}

export interface BankingDetailsUpdate {
  name?: string
  fields?: SectionField[]
  is_default?: boolean
}
