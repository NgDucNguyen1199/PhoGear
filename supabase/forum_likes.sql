-- 1. Create post_likes table
CREATE TABLE IF NOT EXISTS public.post_likes (
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- 2. Enable RLS
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Anyone can view likes" ON public.post_likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can toggle likes" ON public.post_likes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own likes" ON public.post_likes
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Add index for performance
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes (post_id);
