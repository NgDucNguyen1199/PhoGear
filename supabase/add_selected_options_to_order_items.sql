-- Thêm cột selected_options vào bảng order_items để lưu các tùy chọn của sản phẩm khi đặt hàng
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS selected_options JSONB DEFAULT '{}'::jsonb;

-- Comment để giải thích cột
COMMENT ON COLUMN public.order_items.selected_options IS 'Lưu các tùy chọn biến thể của sản phẩm (ví dụ: Màu sắc, Phiên bản)';
