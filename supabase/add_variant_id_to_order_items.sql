-- Add variant_id to order_items for better inventory tracking
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL;

-- Force schema reload
NOTIFY pgrst, 'reload schema';
