-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'order_status', 'forum_reply', 'flash_sale', 'system'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    link TEXT, -- e.g., '/orders/order-id' or '/forum/post-id'
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
    );

-- 4. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications (created_at DESC);
