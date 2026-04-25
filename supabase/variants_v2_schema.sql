-- Cập nhật bảng product_variants để hỗ trợ SKU và Switch Type
ALTER TABLE public.product_variants 
ADD COLUMN IF NOT EXISTS switch_type TEXT,
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE;

-- Đảm bảo tính nhất quán của dữ liệu
COMMENT ON COLUMN public.product_variants.sku IS 'Mã định danh sản phẩm duy nhất tự động tạo';
