# Phase 1: Database Schema

## Objective
Create the database tables for storing business profiles and clients using Supabase migrations.

## Prerequisites
- Local Supabase running (`supabase start`)
- `/supabase` directory exists from `supabase init`

## Files to Create

### 1. Migration File
**Path**: `/supabase/migrations/<timestamp>_create_contacts_tables.sql`

**Create with**:
```bash
supabase migration new create_contacts_tables
```

**Content**:
```sql
-- ===========================================
-- BUSINESS PROFILES (From information)
-- ===========================================
-- Your business info - small list, rarely changes

CREATE TABLE business_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  fields JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX idx_business_profiles_user ON business_profiles(user_id);

-- Enable Row Level Security
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own business profiles" ON business_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business profiles" ON business_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profiles" ON business_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own business profiles" ON business_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Only one default per user (partial unique index)
CREATE UNIQUE INDEX idx_business_profiles_default
  ON business_profiles(user_id)
  WHERE is_default = true;


-- ===========================================
-- CLIENTS (To information)
-- ===========================================
-- Client list - grows large, frequently added

CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  fields JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_clients_user ON clients(user_id);
CREATE INDEX idx_clients_name ON clients(user_id, name);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON clients
  FOR DELETE USING (auth.uid() = user_id);

-- Only one default per user
CREATE UNIQUE INDEX idx_clients_default
  ON clients(user_id)
  WHERE is_default = true;


-- ===========================================
-- SHARED: Auto-update timestamps
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER business_profiles_updated_at
  BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## Apply Migration

```bash
supabase db reset
```

This will:
1. Drop and recreate the database
2. Apply all migrations in order
3. Seed data (if any seed files exist)

## Data Structure Reference

The `fields` JSONB column stores an array matching the existing `SectionField` type:

```typescript
// From /lib/types.ts
interface SectionField {
  id: string
  label: string
  value: string
  placeholder?: string
}

// Example fields data:
[
  { "id": "1", "label": "Business Name", "value": "Acme Corp", "placeholder": "Your Business Name" },
  { "id": "2", "label": "Address", "value": "123 Main St", "placeholder": "Street Address" },
  { "id": "3", "label": "Email", "value": "info@acme.com", "placeholder": "your.email@business.com" }
]
```

## Acceptance Criteria

- [ ] Migration file created in `/supabase/migrations/`
- [ ] `supabase db reset` runs without errors
- [ ] Tables visible in Supabase Studio (`http://127.0.0.1:54323`)
- [ ] Both `business_profiles` and `clients` tables exist
- [ ] RLS is enabled on both tables (check in Studio → Authentication → Policies)

## Verification

1. Open Supabase Studio: `http://127.0.0.1:54323`
2. Go to Table Editor
3. Verify `business_profiles` and `clients` tables exist
4. Go to Authentication → Policies
5. Verify RLS policies are created for both tables

## Next Phase
→ [02-supabase-setup.md](./02-supabase-setup.md)
