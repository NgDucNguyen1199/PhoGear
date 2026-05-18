-- Thêm các cột phục vụ cài đặt thời gian Flash Sale vào bảng system_settings
ALTER TABLE public.system_settings 
ADD COLUMN IF NOT EXISTS flash_sale_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS flash_sale_end_time TIMESTAMPTZ;

-- Comment giải thích
COMMENT ON COLUMN public.system_settings.flash_sale_enabled IS 'Bật/Tắt hiển thị Flash Sale trên toàn trang web';
COMMENT ON COLUMN public.system_settings.flash_sale_end_time IS 'Thời điểm kết thúc đếm ngược Flash Sale';

-- Cập nhật giá trị mặc định cho record 'main' nếu cần
UPDATE public.system_settings 
SET flash_sale_enabled = false 
WHERE id = 'main' AND flash_sale_enabled IS NULL;
