'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type OrderItemInput = {
  product_id: string
  quantity: number
  price_at_time: number
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

  // 2. Tính tổng tiền
  const total_amount = items.reduce((total, item) => total + (item.price_at_time * item.quantity), 0)

  // 3. Tạo đơn hàng (Transaction-like flow)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount,
      shipping_address,
      phone_number,
      status: 'pending'
    })
    .select()
    .single()

  if (orderError) return { error: `Lỗi tạo đơn hàng: ${orderError.message}` }

  // 4. Tạo chi tiết đơn hàng
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price_at_time: item.price_at_time
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    // Trong thực tế nên có logic rollback ở đây
    return { error: `Lỗi lưu chi tiết đơn hàng: ${itemsError.message}` }
  }

  // 5. (Tùy chọn) Cập nhật số lượng kho hàng
  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', item.product_id)
      .single()
    
    if (product) {
      await supabase
        .from('products')
        .update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) })
        .eq('id', item.product_id)
    }
  }

  revalidatePath('/orders')
  revalidatePath('/admin/orders')
  return { success: 'Đặt hàng thành công!', orderId: order.id }
}

export async function getUserOrders() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return data
}
