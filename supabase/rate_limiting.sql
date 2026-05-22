-- Rate Limiting Table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    identifier TEXT NOT NULL, -- IP address, User ID, or email
    action_type TEXT NOT NULL, -- e.g., 'login', 'create_post', 'add_comment'
    attempt_count INTEGER DEFAULT 1,
    last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (identifier, action_type)
);

-- Function to check and update rate limit
-- Returns TRUE if allowed, FALSE if rate limited
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier TEXT,
    p_action_type TEXT,
    p_max_attempts INTEGER,
    p_window_minutes INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
    v_last_attempt TIMESTAMPTZ;
BEGIN
    SELECT attempt_count, last_attempt_at INTO v_count, v_last_attempt
    FROM public.rate_limits
    WHERE identifier = p_identifier AND action_type = p_action_type;

    -- If no record, create one and allow
    IF NOT FOUND THEN
        INSERT INTO public.rate_limits (identifier, action_type, attempt_count, last_attempt_at)
        VALUES (p_identifier, p_action_type, 1, NOW());
        RETURN TRUE;
    END IF;

    -- If window has passed (e.g., more than p_window_minutes since last attempt), reset count
    IF v_last_attempt < NOW() - (p_window_minutes || ' minutes')::INTERVAL THEN
        UPDATE public.rate_limits
        SET attempt_count = 1, last_attempt_at = NOW()
        WHERE identifier = p_identifier AND action_type = p_action_type;
        RETURN TRUE;
    END IF;

    -- If under limit, increment and allow
    IF v_count < p_max_attempts THEN
        UPDATE public.rate_limits
        SET attempt_count = v_count + 1, last_attempt_at = NOW()
        WHERE identifier = p_identifier AND action_type = p_action_type;
        RETURN TRUE;
    END IF;

    -- Over limit, update last_attempt_at to keep the block active if they keep trying?
    -- Or just return false. Let's return false.
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
