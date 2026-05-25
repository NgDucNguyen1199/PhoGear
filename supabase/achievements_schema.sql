-- 1. Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_key TEXT NOT NULL, -- e.g., 'WPM_100_REWARD'
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_key)
);

-- 2. Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);
