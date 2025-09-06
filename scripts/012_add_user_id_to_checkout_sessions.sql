-- Add user_id column to checkout_sessions table if it doesn't exist
ALTER TABLE public.checkout_sessions 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_id ON public.checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_product ON public.purchases(user_id, product_id);
