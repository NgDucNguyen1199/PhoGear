-- Thêm dữ liệu sản phẩm mới (Yunzii B75 Pro Max, Yunzii B75 Pro, CIDOO V68)
INSERT INTO public.products (id, name, brand, description, price, stock_quantity, images_url, category_id, layout, connectivity, average_rating)
VALUES
  (
    '22222222-2222-2222-2222-222222222226',
    'Yunzii B75 Pro Max',
    'Yunzii',
    'Bàn phím cơ Yunzii B75 Pro Max thiết kế gasket mount, âm thanh trầm ấm chuẩn "thocky". Hỗ trợ hot-swap, núm xoay đa năng, và màn hình LED hiển thị sinh động.',
    1850000,
    30,
    '{"https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=80"}',
    '11111111-1111-1111-1111-111111111111',
    '75%',
    '2.4G, Bluetooth, Wired',
    4.8
  ),
  (
    '22222222-2222-2222-2222-222222222227',
    'Yunzii B75 Pro',
    'Yunzii',
    'Phiên bản tiêu chuẩn của dòng B75, mang lại cảm giác gõ êm ái nhờ lót phím silicon cao cấp. Layout 75% tối ưu không gian, kết nối 3 mode tiện lợi.',
    1550000,
    45,
    '{"https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"}',
    '11111111-1111-1111-1111-111111111111',
    '75%',
    '2.4G, Bluetooth, Wired',
    4.6
  ),
  (
    '22222222-2222-2222-2222-222222222228',
    'CIDOO V68',
    'CIDOO',
    'Bàn phím cơ layout 65% với vỏ nhôm nguyên khối (Full Aluminum). Switch Matte siêu mượt từ nhà máy, kết hợp cùng keycap PBT dày dặn tạo âm thanh cực kỳ phấn khích.',
    3100000,
    15,
    '{"https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80"}',
    '11111111-1111-1111-1111-111111111111',
    '65%',
    '2.4G, Bluetooth, Wired',
    4.9
  )
ON CONFLICT (id) DO NOTHING;
