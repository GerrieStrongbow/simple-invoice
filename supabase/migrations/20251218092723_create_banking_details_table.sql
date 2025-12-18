-- ===========================================
-- BANKING DETAILS (Payment information)
-- ===========================================
-- Bank account info - small list, rarely changes

CREATE TABLE banking_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  fields JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX idx_banking_details_user ON banking_details(user_id);

-- Enable Row Level Security
ALTER TABLE banking_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own banking details" ON banking_details
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own banking details" ON banking_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own banking details" ON banking_details
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own banking details" ON banking_details
  FOR DELETE USING (auth.uid() = user_id);

-- Only one default per user (partial unique index)
CREATE UNIQUE INDEX idx_banking_details_default
  ON banking_details(user_id)
  WHERE is_default = true;

-- Auto-update timestamps (reuse existing function from contacts migration)
CREATE TRIGGER banking_details_updated_at
  BEFORE UPDATE ON banking_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
