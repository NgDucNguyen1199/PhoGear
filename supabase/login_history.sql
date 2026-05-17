-- Table for login history
CREATE TABLE IF NOT EXISTS public.login_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'success',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

-- Admins can view all login history
CREATE POLICY "Admins can view all login history" ON public.login_history FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Users can view their own login history (optional, but good practice)
CREATE POLICY "Users can view own login history" ON public.login_history FOR SELECT
    USING (auth.uid() = user_id);
