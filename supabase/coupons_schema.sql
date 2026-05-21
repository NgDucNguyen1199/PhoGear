-- 1. Create Coupons Table
CREATE TABLE public.coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    type TEXT CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')) NOT NULL,
    value NUMERIC NOT NULL CHECK (value >= 0),
    min_order_amount NUMERIC DEFAULT 0 CHECK (min_order_amount >= 0),
    max_discount_amount NUMERIC CHECK (max_discount_amount >= 0),
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    usage_limit INTEGER CHECK (usage_limit >= 0),
    usage_count INTEGER DEFAULT 0 CHECK (usage_count >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Update Orders Table
ALTER TABLE public.orders ADD COLUMN coupon_id UUID REFERENCES public.coupons(id);
ALTER TABLE public.orders ADD COLUMN discount_amount NUMERIC DEFAULT 0 CHECK (discount_amount >= 0);

-- 3. Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Coupons are viewable by authenticated users for validation" ON public.coupons 
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything on coupons" ON public.coupons 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5. Helper Function to update usage count
CREATE OR REPLACE FUNCTION public.increment_coupon_usage(coupon_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.coupons
    SET usage_count = usage_count + 1
    WHERE id = coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
