-- Fix course access and product history
-- Add user_id to checkout_sessions and fix purchases table

-- 1. Add user_id to checkout_sessions if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'checkout_sessions' 
                   AND column_name = 'user_id') THEN
        ALTER TABLE public.checkout_sessions 
        ADD COLUMN user_id uuid REFERENCES auth.users(id);
    END IF;
END $$;

-- 2. Add missing columns to purchases table
DO $$ 
BEGIN
    -- Add customer_email if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchases' 
                   AND column_name = 'customer_email') THEN
        ALTER TABLE public.purchases 
        ADD COLUMN customer_email text;
    END IF;
    
    -- Add purchased_at if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchases' 
                   AND column_name = 'purchased_at') THEN
        ALTER TABLE public.purchases 
        ADD COLUMN purchased_at timestamp with time zone DEFAULT now();
    END IF;
END $$;

-- 3. Fix user_id foreign key constraint in purchases
DO $$
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'purchases' 
               AND constraint_name = 'purchases_user_id_fkey') THEN
        ALTER TABLE public.purchases DROP CONSTRAINT purchases_user_id_fkey;
    END IF;
    
    -- Add proper foreign key constraint
    ALTER TABLE public.purchases 
    ADD CONSTRAINT purchases_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
END $$;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON public.checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON public.checkout_sessions(session_id);

-- 5. Create unique indexes to prevent duplicate purchases
CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_user_product 
ON public.purchases(user_id, product_id) 
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_email_product 
ON public.purchases(customer_email, product_id) 
WHERE customer_email IS NOT NULL;

-- 6. Add indexes for access control queries
CREATE INDEX IF NOT EXISTS idx_purchases_user_status ON public.purchases(user_id, status);
CREATE INDEX IF NOT EXISTS idx_purchases_email_status ON public.purchases(customer_email, status);
