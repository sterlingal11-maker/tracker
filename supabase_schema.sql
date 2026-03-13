-- Delightful Meals - Supabase Schema
-- Run this in Supabase SQL Editor

-- Each table stores JSON data for simplicity (no rigid columns to migrate)
-- and has a single row per "store" key, identified by a fixed id

CREATE TABLE IF NOT EXISTS dm_store (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow all operations (this is a single-user app protected by app-level auth)
ALTER TABLE dm_store ENABLE ROW LEVEL SECURITY;

-- Public read/write policy (app handles its own auth)
CREATE POLICY "allow_all" ON dm_store
  FOR ALL USING (true) WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS dm_store_key_idx ON dm_store (key);
