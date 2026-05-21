'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type OrderItemInput = {
  product_id: string
  variant_id?: string
  quantity: number
  price_at_time: number
  selected_options?: Record<string, string>
}

export async function validateCoupon(code: string, subtotal: number) {
  const supabase = await createClient()
  
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (error || !coupon) {
    return { error: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' }
  }

  // Kiểm tra ngày bắt đầu/kết thúc
  const now = new Date()
  if (coupon.start_date && new Date(coupon.start_date) > now) {
    return { error: 'Mã giảm giá chưa đến thời gian sử dụng.' }
  }
  if (coupon.end_date && new Date(coupon.end_date) < now) {
    return { error: 'Mã giảm giá đã hết hạn.' }
  }

  // Kiểm tra giới hạn sử dụng
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    return { error: 'Mã giảm giá đã hết lượt sử dụng.' }
  }

  // Kiểm tra đơn hàng tối thiểu
  if (subtotal < coupon.min_order_amount) {
    return { error: `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.min_order_amount)} để sử dụng mã này.` }
  }

  let discountAmount = 0
  let isFreeShipping = false

  if (coupon.type === 'percentage') {
    discountAmount = (subtotal * coupon.value) / 100
    if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
      discountAmount = coupon.max_discount_amount
    }
  } else if (coupon.type === 'fixed_amount') {
    discountAmount = coupon.value
  } else if (coupon.type === 'free_shipping') {
    isFreeShipping = true
  }

  return { 
    success: true, 
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount,
      isFreeShipping
    }
  }
}

export async function createOrder(formData: FormData, items: OrderItemInput[]) {
  const supabase = await createClient()
  
  // 1. Kiểm tra đăng nhập
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Bạn cần đăng nhập để đặt hàng.' }

  const shipping_address = formData.get('address') as string
  const phone_number = formData.get('phone') as string
  const payment_method = formData.get('paymentMethod') as string || 'cod'
  const coupon_code = formData.get('couponCode') as string
  
  if (!shipping_address || !phone_number) {
    return { error: 'Vui lòng cung cấp đầy đủ địa chỉ và số điện thoại.' }
  }

  // 2. Xác thực giá tiền thực tế (Flash Sale check)
  const { data: settings } = await supabase.from('system_settings').select('*').eq('id', 'main').single()
  const isGlobalFlashSaleActive = settings?.flash_sale_enabled && 
    settings?.flash_sale_end_time && 
    new Date(settings.flash_sale_end_time) > new Date()

  const verifiedOrderItems = []
  let calculated_subtotal = 0

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

    calculated_subtotal += price_to_apply * item.quantity
    verifiedOrderItems.push({
      order_id: '', // Will be set after order creation
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: price_to_apply,
      selected_options: item.selected_options || {}
    })
  }

  // Áp dụng mã giảm giá nếu có
  let discount_amount = 0
  let coupon_id = null
  let is_free_shipping = false

  if (coupon_code) {
    const couponResult = await validateCoupon(coupon_code, calculated_subtotal)
    if (couponResult.success && couponResult.coupon) {
      coupon_id = couponResult.coupon.id
      discount_amount = couponResult.coupon.discountAmount
      is_free_shipping = couponResult.coupon.isFreeShipping
    }
  }

  // Tính phí vận chuyển
  let shipping_fee = calculated_subtotal >= 800000 ? 0 : 30000
  if (is_free_shipping) {
    shipping_fee = 0
  }

  const final_total_amount = Math.max(0, calculated_subtotal + shipping_fee - discount_amount)

  // 3. Tạo đơn hàng
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: final_total_amount,
      discount_amount: discount_amount,
      coupon_id: coupon_id,
      shipping_address,
      phone_number,
      status: payment_method === 'online' ? 'processing' : 'pending',
      payment_method: payment_method
    })
    .select()
    .single()

  if (orderError) return { error: `Lỗi tạo đơn hàng: ${orderError.message}` }

  // Cập nhật số lượng sử dụng coupon
  if (coupon_id) {
    await supabase.rpc('increment_coupon_usage', { coupon_id })
  }

  // 4. Tạo chi tiết đơn hàng
  const finalOrderItems = verifiedOrderItems.map((vItem, index) => ({
    ...vItem,
    order_id: order.id,
    variant_id: items[index].variant_id // Đồng bộ variant_id từ input ban đầu
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(finalOrderItems.map(({ order_id, product_id, variant_id, quantity, price_at_time, selected_options }) => ({
       order_id,
       product_id,
       variant_id,
       quantity,
       price_at_time,
       selected_options
    })))

  if (itemsError) {
    return { error: `Lỗi lưu chi tiết đơn hàng: ${itemsError.message}` }
  }

  // 5. Cập nhật số lượng kho hàng (Trừ kho ngay khi đặt hàng để giữ chỗ)
  for (const item of finalOrderItems) {
    // 5.1. Trừ kho sản phẩm chính
    const { data: productData } = await supabase
      .from('products')
      .select('stock_quantity, is_flash_sale, flash_sale_sold, flash_sale_price')
      .eq('id', item.product_id)
      .single()
    
    const product = productData as any
    
    if (product) {
      const updates: any = { 
        stock_quantity: Math.max(0, product.stock_quantity - item.quantity) 
      }

      // Nếu mua với giá flash sale
      if (isGlobalFlashSaleActive && product.is_flash_sale && item.price_at_time === product.flash_sale_price) {
        updates.flash_sale_sold = (product.flash_sale_sold || 0) + item.quantity
      }

      await supabase
        .from('products')
        .update(updates)
        .eq('id', item.product_id)
    }

    // 5.2. Trừ kho biến thể (nếu có)
    if (item.variant_id) {
        const { data: variantData } = await supabase
            .from('product_variants')
            .select('stock_quantity')
            .eq('id', item.variant_id)
            .single()
        
        const variant = variantData as any
        
        if (variant) {
            await supabase
                .from('product_variants')
                .update({ stock_quantity: Math.max(0, variant.stock_quantity - item.quantity) })
                .eq('id', item.variant_id)
        }
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
