-- Migration: Add is_global_winner and is_active_elsewhere columns to listings table
-- Run this SQL in your PostgreSQL database (Supabase SQL Editor or Railway PostgreSQL)

-- Check if columns exist before adding them
DO $$ 
BEGIN
    -- Add is_global_winner column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = 'is_global_winner'
    ) THEN
        ALTER TABLE listings ADD COLUMN is_global_winner INTEGER DEFAULT 0 NOT NULL;
    END IF;
    
    -- Add is_active_elsewhere column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = 'is_active_elsewhere'
    ) THEN
        ALTER TABLE listings ADD COLUMN is_active_elsewhere INTEGER DEFAULT 0 NOT NULL;
    END IF;
END $$;




