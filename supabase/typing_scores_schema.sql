-- 1. Create typing_scores table
CREATE TABLE IF NOT EXISTS public.typing_scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    wpm NUMERIC NOT NULL,
    accuracy NUMERIC NOT NULL,
    mode TEXT NOT NULL, -- e.g., 'time_30_vn', 'words_50_en'
    rank_name TEXT NOT NULL, -- e.g., 'Thần tốc', 'Lão tướng'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.typing_scores ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Typing scores are viewable by everyone" ON public.typing_scores
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own typing scores" ON public.typing_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Indexes for performance (leaderboard queries)
CREATE INDEX IF NOT EXISTS idx_typing_scores_wpm ON public.typing_scores (wpm DESC);
CREATE INDEX IF NOT EXISTS idx_typing_scores_created_at ON public.typing_scores (created_at DESC);
