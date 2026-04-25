-- Bật extension unaccent để hỗ trợ tìm kiếm không dấu
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Xóa function nếu đã tồn tại để tạo lại
DROP FUNCTION IF EXISTS search_products(text);

-- Tạo function tìm kiếm sản phẩm theo tên, thương hiệu, hoặc tên danh mục (không phân biệt hoa thường và không dấu)
CREATE OR REPLACE FUNCTION search_products(search_term text)
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT p.*
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  WHERE unaccent(p.name) ILIKE unaccent('%' || search_term || '%')
     OR unaccent(p.brand) ILIKE unaccent('%' || search_term || '%')
     OR unaccent(c.name) ILIKE unaccent('%' || search_term || '%');
END;
$$ LANGUAGE plpgsql;
