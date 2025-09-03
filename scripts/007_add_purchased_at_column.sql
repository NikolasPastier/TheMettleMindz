-- Add missing purchased_at column to purchases table
ALTER TABLE purchases 
ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing records to have purchased_at = created_at if purchased_at is null
UPDATE purchases 
SET purchased_at = created_at 
WHERE purchased_at IS NULL;
