-- Thêm các cột phục vụ tính năng Flash Sale cho sản phẩm
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_flash_sale BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS flash_sale_price NUMERIC CHECK (flash_sale_price >= 0),
ADD COLUMN IF NOT EXISTS flash_sale_stock INTEGER DEFAULT 0 CHECK (flash_sale_stock >= 0),
ADD COLUMN IF NOT EXISTS flash_sale_sold INTEGER DEFAULT 0 CHECK (flash_sale_sold >= 0);

-- Comment giải thích
COMMENT ON COLUMN public.products.is_flash_sale IS 'Đánh dấu sản phẩm đang trong chương trình Flash Sale';
COMMENT ON COLUMN public.products.flash_sale_price IS 'Giá ưu đãi trong thời gian Flash Sale';
COMMENT ON COLUMN public.products.flash_sale_stock IS 'Tổng số lượng hàng dành riêng cho Flash Sale';
COMMENT ON COLUMN public.products.flash_sale_sold IS 'Số lượng sản phẩm Flash Sale đã bán được';
