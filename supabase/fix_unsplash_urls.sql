-- Sửa lỗi các URL ảnh Unsplash bị thiếu dấu '?' trước các tham số query
-- Chạy lệnh này để dọn dẹp dữ liệu hiện tại trong Database

-- 1. Sửa trong bảng products (mảng images_url)
UPDATE public.products
SET images_url = array(
  SELECT 
    CASE 
      WHEN img LIKE 'https://images.unsplash.com/%auto=%' AND img NOT LIKE '%?%' 
      THEN REPLACE(img, 'photo-', 'photo-') -- Giữ nguyên phần đầu
           || '?' || SUBSTRING(img FROM POSITION('auto=' IN img)) -- Thêm dấu ? trước auto=
           -- Lưu ý: Logic này hơi phức tạp vì array_replace không hỗ trợ regex tốt
      ELSE img 
    END
  FROM unnest(images_url) AS img
)
WHERE EXISTS (
  SELECT 1 FROM unnest(images_url) AS img 
  WHERE img LIKE 'https://images.unsplash.com/%auto=%' AND img NOT LIKE '%?%'
);

-- 2. Sửa trong bảng product_variants (cột image_url)
UPDATE public.product_variants
SET image_url = REGEXP_REPLACE(image_url, '(https://images\.unsplash\.com/[^?]+)(auto=)', '\1?\2')
WHERE image_url LIKE 'https://images.unsplash.com/%' 
  AND image_url NOT LIKE '%?%'
  AND image_url LIKE '%auto=%';
