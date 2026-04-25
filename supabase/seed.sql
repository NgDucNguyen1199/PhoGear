-- 1. Insert Categories
INSERT INTO public.categories (id, name, slug, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Bàn phím cơ', 'ban-phim-co', 'Các mẫu bàn phím cơ hoàn thiện (Full-build)'),
  ('11111111-1111-1111-1111-111111111112', 'Keycap', 'keycap', 'Bộ nút phím (Keycap sets) đa dạng chất liệu PBT, ABS'),
  ('11111111-1111-1111-1111-111111111113', 'Switch', 'switch', 'Các loại switch Linear, Tactile, Clicky'),
  ('11111111-1111-1111-1111-111111111114', 'Kit bàn phím', 'kit-ban-phim', 'Vỏ nhôm, mạch xuôi, đầy đủ phụ kiện build'),
  ('11111111-1111-1111-1111-111111111115', 'Phụ kiện', 'phu-kien', 'Lube, nhíp, dây cáp custom')
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Products
INSERT INTO public.products (id, name, brand, description, price, stock_quantity, images_url, category_id, layout, connectivity, average_rating)
VALUES
  (
    '22222222-2222-2222-2222-222222222221',
    'Keychron Q1 Pro (Bản Full Nhôm)',
    'Keychron',
    'Bàn phím cơ custom QMK/VIA không dây toàn thân nhôm cao cấp. Hỗ trợ Bluetooth 5.1 và cáp Type-C. Trải nghiệm gõ phím đỉnh cao với thiết kế Double-Gasket.',
    4990000,
    15,
    '{"https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80"}',
    '11111111-1111-1111-1111-111111111111',
    '75%',
    'Bluetooth, Wired',
    4.8
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'NuPhy Halo75 V2',
    'NuPhy',
    'Bàn phím cơ Low-profile không dây thiết kế hiện đại, hoàn hảo cho dân văn phòng và lập trình viên. Đèn LED RGB viền "Halo" độc đáo.',
    3250000,
    20,
    '{"https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"}',
    '11111111-1111-1111-1111-111111111111',
    '75%',
    '2.4G, Bluetooth, Wired',
    4.5
  ),
  (
    '22222222-2222-2222-2222-222222222223',
    'Wooting 60HE+',
    'Wooting',
    'Bàn phím cơ sử dụng switch từ tính (Magnetic switch) cho phép tùy chỉnh điểm nhận phím (actuation point). Vũ khí tối thượng cho game thủ chuyên nghiệp.',
    5200000,
    5,
    '{"https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80"}',
    '11111111-1111-1111-1111-111111111111',
    '60%',
    'Wired',
    5.0
  ),
  (
    '22222222-2222-2222-2222-222222222224',
    'Bộ Keycap GMK Botanical',
    'GMK',
    'Bộ keycap chất liệu ABS Doubleshot cao cấp, profile Cherry. Phối màu xanh lá cây mát mắt, mang thiên nhiên vào góc làm việc của bạn.',
    3800000,
    10,
    '{"https://images.unsplash.com/photo-1642231268377-50b0ee564dc9?auto=format&fit=crop&w=800&q=80"}',
    '11111111-1111-1111-1111-111111111112',
    'All',
    'N/A',
    4.9
  ),
  (
    '22222222-2222-2222-2222-222222222225',
    'Switch Gateron Oil King (Pack 35)',
    'Gateron',
    'Switch Linear siêu mượt, được lube sẵn từ nhà máy. Lực nhấn 55g, âm thanh trầm ấm (thocky).',
    550000,
    50,
    '{"https://images.unsplash.com/photo-1621361365424-06f0e1eb5c49?auto=format&fit=crop&w=800&q=80"}',
    '11111111-1111-1111-1111-111111111113',
    'N/A',
    'N/A',
    4.7
  )
ON CONFLICT (id) DO NOTHING;
