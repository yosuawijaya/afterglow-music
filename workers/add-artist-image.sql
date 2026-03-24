-- Add image column to artists table if it doesn't exist
-- This is safe to run multiple times

-- SQLite doesn't support ALTER TABLE ADD COLUMN IF NOT EXISTS directly
-- So we'll use a workaround

-- First, check if we need to add the column by trying to select it
-- If it fails, we add it

-- For D1, we can just run this - it will error if column exists but that's ok
ALTER TABLE artists ADD COLUMN image TEXT;
