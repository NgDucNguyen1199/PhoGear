-- Table for system settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    site_name TEXT DEFAULT 'Pho Gear',
    contact_email TEXT DEFAULT 'contact@phogear.com',
    currency TEXT DEFAULT 'VND',
    language TEXT DEFAULT 'vi',
    order_notifications BOOLEAN DEFAULT true,
    weekly_reports BOOLEAN DEFAULT false,
    two_factor_auth BOOLEAN DEFAULT false,
    flash_sale_enabled BOOLEAN DEFAULT false,
    flash_sale_end_time TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view system settings (needed for site name, currency, etc. in UI)
CREATE POLICY "Everyone can view system settings" ON public.system_settings FOR SELECT 
    USING (true);

-- Allow admins to perform all operations
CREATE POLICY "Admins can manage system settings" ON public.system_settings 
    FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Initial settings
INSERT INTO public.system_settings (id, site_name, contact_email, currency, language)
VALUES ('main', 'Pho Gear', 'contact@phogear.com', 'VND', 'vi')
ON CONFLICT (id) DO NOTHING;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
