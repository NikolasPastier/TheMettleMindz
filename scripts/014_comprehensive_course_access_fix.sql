-- Comprehensive fix for course access and product history including free purchases

-- 1. Add user_id to checkout_sessions table
ALTER TABLE public.checkout_sessions 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON public.checkout_sessions(user_id);

-- 2. Fix purchases table structure
-- Add missing columns
ALTER TABLE public.purchases 
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS purchased_at timestamp with time zone DEFAULT now();

-- Fix foreign key constraint to auth.users
DO $$ 
BEGIN
    -- Drop existing constraint if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'purchases_user_id_fkey' 
               AND table_name = 'purchases') THEN
        ALTER TABLE public.purchases DROP CONSTRAINT purchases_user_id_fkey;
    END IF;
    
    -- Add proper foreign key constraint
    ALTER TABLE public.purchases 
    ADD CONSTRAINT purchases_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id);
EXCEPTION
    WHEN others THEN
        -- Constraint might already exist or other issue, continue
        NULL;
END $$;

-- 3. Add unique indexes to prevent duplicate purchases
CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_user_product 
ON public.purchases(user_id, product_id) 
WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_email_product 
ON public.purchases(customer_email, product_id) 
WHERE customer_email IS NOT NULL;

-- 4. Add indexes for access control queries
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_customer_email ON public.purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_product_id ON public.purchases(product_id);

-- 5. Update RLS policies for purchases table
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;
CREATE POLICY "Users can view their own purchases" ON public.purchases
FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'email' = customer_email
);

DROP POLICY IF EXISTS "Users can insert their own purchases" ON public.purchases;
CREATE POLICY "Users can insert their own purchases" ON public.purchases
FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'email' = customer_email
);

-- Enable RLS on purchases table
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- 6. Update checkout_sessions RLS policies
DROP POLICY IF EXISTS "Users can view their own checkout sessions" ON public.checkout_sessions;
CREATE POLICY "Users can view their own checkout sessions" ON public.checkout_sessions
FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'email' = user_email
);

DROP POLICY IF EXISTS "Users can insert their own checkout sessions" ON public.checkout_sessions;
CREATE POLICY "Users can insert their own checkout sessions" ON public.checkout_sessions
FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'email' = user_email
);

-- Enable RLS on checkout_sessions table
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;
