-- ============================================================
-- Delightful Meals — Supabase Setup
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- 1. Create the storage table
CREATE TABLE IF NOT EXISTS dm_store (
  key        TEXT PRIMARY KEY,
  data       JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE dm_store ENABLE ROW LEVEL SECURITY;

-- 3. Allow full access (app handles its own login)
CREATE POLICY "allow_all" ON dm_store
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Index for fast lookups
CREATE INDEX IF NOT EXISTS dm_store_key_idx ON dm_store (key);

-- Done! Click "Run" — you should see "Success. No rows returned"
