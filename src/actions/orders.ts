'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type OrderItemInput = {
  product_id: string
  quantity: number
  price_at_time: number
  selected_options?: Record<string, string>
}

export async function createOrder(formData: FormData, items: OrderItemInput[]) {
  const supabase = await createClient()
  
  // 1. Kiểm tra đăng nhập
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Bạn cần đăng nhập để đặt hàng.' }

  const shipping_address = formData.get('address') as string
  const phone_number = formData.get('phone') as string
  
  if (!shipping_address || !phone_number) {
    return { error: 'Vui lòng cung cấp đầy đủ địa chỉ và số điện thoại.' }
  }

  // 2. Xác thực giá tiền thực tế (Flash Sale check)
  const { data: settings } = await supabase.from('system_settings').select('*').eq('id', 'main').single()
  const isGlobalFlashSaleActive = settings?.flash_sale_enabled && 
    settings?.flash_sale_end_time && 
    new Date(settings.flash_sale_end_time) > new Date()

  const verifiedOrderItems = []
  let calculated_total_amount = 0

  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('price, is_flash_sale, flash_sale_price, flash_sale_stock, flash_sale_sold')
      .eq('id', item.product_id)
      .single()

    if (!product) return { error: `Sản phẩm với ID ${item.product_id} không tồn tại.` }

    let price_to_apply = product.price

    // Nếu flash sale đang bật toàn hệ thống và sản phẩm cũng bật flash sale
    if (isGlobalFlashSaleActive && product.is_flash_sale && product.flash_sale_price) {
        // Kiểm tra xem còn lượt sale không
        if ((product.flash_sale_sold || 0) < (product.flash_sale_stock || 0)) {
            price_to_apply = product.flash_sale_price
        }
    }

    calculated_total_amount += price_to_apply * item.quantity
    verifiedOrderItems.push({
      order_id: '', // Will be set after order creation
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: price_to_apply,
      selected_options: item.selected_options || {}
    })
  }

  // 3. Tạo đơn hàng
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: calculated_total_amount,
      shipping_address,
      phone_number,
      status: 'pending'
    })
    .select()
    .single()

  if (orderError) return { error: `Lỗi tạo đơn hàng: ${orderError.message}` }

  // 4. Tạo chi tiết đơn hàng
  const finalOrderItems = verifiedOrderItems.map(vItem => ({
    ...vItem,
    order_id: order.id
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(finalOrderItems)

  if (itemsError) {
    return { error: `Lỗi lưu chi tiết đơn hàng: ${itemsError.message}` }
  }

  // 5. Cập nhật số lượng kho hàng và flash sale sold
  for (const item of finalOrderItems) {
    const { data: product } = await supabase
      .from('products')
      .select('stock_quantity, is_flash_sale, flash_sale_sold, flash_sale_price')
      .eq('id', item.product_id)
      .single()
    
    if (product) {
      const updates: any = { 
        stock_quantity: Math.max(0, product.stock_quantity - item.quantity) 
      }

      // Nếu mua với giá flash sale (xác định bằng cách so sánh giá áp dụng với giá flash sale)
      if (isGlobalFlashSaleActive && product.is_flash_sale && item.price_at_time === product.flash_sale_price) {
        updates.flash_sale_sold = (product.flash_sale_sold || 0) + item.quantity
      }

      await supabase
        .from('products')
        .update(updates)
        .eq('id', item.product_id)
    }
  }

  revalidatePath('/orders')
  revalidatePath('/admin/orders')
  revalidatePath('/')
  return { success: 'Đặt hàng thành công!', orderId: order.id }
}

export async function getUserOrders(options: {
  query?: string,
  status?: string,
  minPrice?: number,
  maxPrice?: number,
  startDate?: string,
  endDate?: string,
  sort?: string
} = {}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let dbQuery = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('user_id', user.id)

  // 1. Filter by Status
  if (options.status && options.status !== 'all') {
    dbQuery = dbQuery.eq('status', options.status)
  }

  // 2. Filter by Price Range
  if (options.minPrice !== undefined) {
    dbQuery = dbQuery.gte('total_amount', options.minPrice)
  }
  if (options.maxPrice !== undefined) {
    dbQuery = dbQuery.lte('total_amount', options.maxPrice)
  }

  // 3. Filter by Date Range
  if (options.startDate) {
    dbQuery = dbQuery.gte('created_at', options.startDate)
  }
  if (options.endDate) {
    dbQuery = dbQuery.lte('created_at', options.endDate)
  }

  // 4. Sorting
  const [column, direction] = (options.sort || 'created_at-desc').split('-')
  dbQuery = dbQuery.order(column === 'price' ? 'total_amount' : column, { 
    ascending: direction === 'asc' 
  })

  const { data, error } = await dbQuery

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  // 5. Client-side Search (for nested product names or specific fields)
  if (options.query) {
    const q = options.query.toLowerCase()
    return data.filter(order => {
      const matchesId = order.id.toLowerCase().includes(q)
      const matchesAddress = order.shipping_address.toLowerCase().includes(q)
      const matchesPhone = order.phone_number.toLowerCase().includes(q)
      const matchesAmount = order.total_amount.toString().includes(q)
      const matchesProducts = order.order_items.some((item: any) => 
        item.products?.name.toLowerCase().includes(q)
      )
      
      return matchesId || matchesAddress || matchesPhone || matchesAmount || matchesProducts
    })
  }

  return data
}
