# Fixing PGRST204 Error: Missing 'category' Column

## Problem
The Supabase client throws a PGRST204 error: "Could not find the 'category' column of 'tasks' in the schema cache" when trying to create tasks.

This happens because:
1. The frontend code expects `category` and `priority` columns in the `tasks` table
2. These columns are missing from the database schema
3. The Supabase client's schema cache hasn't been updated

## Solution

### 1. Add Missing Columns to Tasks Table
Run this SQL in the Supabase SQL editor:

```sql
-- Add category column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'tasks' AND column_name = 'category') THEN
    ALTER TABLE tasks ADD COLUMN category TEXT DEFAULT 'personal';
  END IF;
END $$;

-- Add priority column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'tasks' AND column_name = 'priority') THEN
    ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'medium';
  END IF;
END $$;

-- Make user_id nullable (if needed for guest users)
ALTER TABLE tasks ALTER COLUMN user_id DROP NOT NULL;
```

### 2. Clear Supabase Schema Cache
After updating the schema, clear the cache:

```bash
curl -X POST "https://jtfmkkaapsvthslsseem.supabase.co/clear-cache" \
  -H "Authorization: Bearer YOUR_PUBLIC_KEY"
```
Replace `YOUR_PUBLIC_KEY` with your Supabase anon key.

### 3. Restart Application
Restart your frontend application to ensure it picks up the updated schema.

## Verification
Check that the columns exist in your Supabase Dashboard:
1. Go to Database → Tables → tasks
2. Verify `category` and `priority` columns are present
3. Try creating a task again - the error should be resolved