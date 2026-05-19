-- Create products bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for products bucket
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'products');

CREATE POLICY "Admins can upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'products' 
    AND (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
);

CREATE POLICY "Admins can update product images" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'products' 
    AND (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
);

CREATE POLICY "Admins can delete product images" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'products' 
    AND (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
);
