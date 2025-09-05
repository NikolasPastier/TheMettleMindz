-- Create checkout_sessions table to store cart data during checkout
CREATE TABLE IF NOT EXISTS public.checkout_sessions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id text UNIQUE NOT NULL,
    user_email text NOT NULL,
    products jsonb NOT NULL, -- Array of {id, title, type, price}
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    total_amount numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON public.checkout_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user_email ON public.checkout_sessions(user_email);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON public.checkout_sessions(status);

-- Enable RLS
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own checkout sessions" ON public.checkout_sessions
    FOR SELECT USING (true); -- Allow reading for verification

CREATE POLICY "System can insert checkout sessions" ON public.checkout_sessions
    FOR INSERT WITH CHECK (true); -- Allow system to create sessions

CREATE POLICY "System can update checkout sessions" ON public.checkout_sessions
    FOR UPDATE USING (true); -- Allow system to update status
