'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAdminStats() {
  const supabase = await createClient()

  // Thống kê doanh thu (tổng total_amount của đơn hàng 'delivered')
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount')
    .eq('status', 'delivered')
  
  const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0

  // Tổng số đơn hàng
  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  // Tổng số sản phẩm
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // Tổng số người dùng
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  return {
    totalRevenue,
    orderCount: orderCount || 0,
    productCount: productCount || 0,
    userCount: userCount || 0
  }
}

export async function seedCategories() {
  const supabase = await createClient()

  const categories = [
    { name: 'Bàn phím cơ', slug: 'ban-phim-co', description: 'Các mẫu bàn phím cơ hoàn thiện (Full-build)' },
    { name: 'Keycap', slug: 'keycap', description: 'Bộ nút phím (Keycap sets) đa dạng chất liệu PBT, ABS' },
    { name: 'Switch', slug: 'switch', description: 'Các loại switch Linear, Tactile, Clicky' },
    { name: 'Kit bàn phím', slug: 'kit-ban-phim', description: 'Vỏ nhôm, mạch xuôi, đầy đủ phụ kiện build' },
    { name: 'Phụ kiện', slug: 'phu-kien', description: 'Lube, nhíp, dây cáp custom' },
  ]

  const { error } = await supabase.from('categories').upsert(categories, { onConflict: 'name' })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: 'Đã khởi tạo danh mục mẫu thành công!' }
}

export async function seedProducts() {
  const supabase = await createClient()

  // Lấy id của danh mục 'Bàn phím cơ'
  const { data: categories } = await supabase.from('categories').select('id, name')
  if (!categories || categories.length === 0) {
    return { error: 'Vui lòng khởi tạo danh mục trước khi thêm sản phẩm mẫu!' }
  }

  const keyboardCategory = categories.find(c => c.name === 'Bàn phím cơ')
  const keycapCategory = categories.find(c => c.name === 'Keycap')
  const switchCategory = categories.find(c => c.name === 'Switch')

  const products = [
    {
      id: '22222222-2222-2222-2222-222222222221',
      name: 'Keychron Q1 Pro (Bản Full Nhôm)',
      brand: 'Keychron',
      description: 'Bàn phím cơ custom QMK/VIA không dây toàn thân nhôm cao cấp. Hỗ trợ Bluetooth 5.1 và cáp Type-C. Trải nghiệm gõ phím đỉnh cao với thiết kế Double-Gasket.',
      price: 4990000,
      stock_quantity: 15,
      category_id: keyboardCategory?.id || null,
      layout: '75%',
      connectivity: 'Bluetooth, Wired',
      images_url: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80'],
      average_rating: 4.8
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'NuPhy Halo75 V2',
      brand: 'NuPhy',
      description: 'Bàn phím cơ Low-profile không dây thiết kế hiện đại, hoàn hảo cho dân văn phòng và lập trình viên. Đèn LED RGB viền "Halo" độc đáo.',
      price: 3250000,
      stock_quantity: 20,
      category_id: keyboardCategory?.id || null,
      layout: '75%',
      connectivity: '2.4G, Bluetooth, Wired',
      images_url: ['https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'],
      average_rating: 4.5
    },
    {
      id: '22222222-2222-2222-2222-222222222223',
      name: 'Wooting 60HE+',
      brand: 'Wooting',
      description: 'Bàn phím cơ sử dụng switch từ tính (Magnetic switch) cho phép tùy chỉnh điểm nhận phím (actuation point). Vũ khí tối thượng cho game thủ chuyên nghiệp.',
      price: 5200000,
      stock_quantity: 5,
      category_id: keyboardCategory?.id || null,
      layout: '60%',
      connectivity: 'Wired',
      images_url: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80'],
      average_rating: 5.0
    },
    {
      id: '22222222-2222-2222-2222-222222222224',
      name: 'Bộ Keycap GMK Botanical',
      brand: 'GMK',
      description: 'Bộ keycap chất liệu ABS Doubleshot cao cấp, profile Cherry. Phối màu xanh lá cây mát mắt, mang thiên nhiên vào góc làm việc của bạn.',
      price: 3800000,
      stock_quantity: 10,
      category_id: keycapCategory?.id || null,
      layout: 'All',
      connectivity: 'N/A',
      images_url: [
        'https://images.unsplash.com/photo-1642231268377-50b0ee564dc9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=800&q=80'
      ],
      average_rating: 4.9
    },
    {
      id: '22222222-2222-2222-2222-222222222225',
      name: 'Switch Gateron Oil King (Pack 35)',
      brand: 'Gateron',
      description: 'Switch Linear siêu mượt, được lube sẵn từ nhà máy. Lực nhấn 55g, âm thanh trầm ấm (thocky).',
      price: 550000,
      stock_quantity: 50,
      category_id: switchCategory?.id || null,
      layout: 'N/A',
      connectivity: 'N/A',
      images_url: ['https://images.unsplash.com/photo-1621361365424-06f0e1eb5c49?auto=format&fit=crop&w=800&q=80'],
      average_rating: 4.7
    }
  ]

  // Sử dụng upsert để tránh trùng lặp và đảm bảo ID cố định
  for (const product of products) {
    await supabase.from('products').upsert(product, { onConflict: 'id' })
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: 'Đã thêm các sản phẩm mẫu thành công!' }
}

