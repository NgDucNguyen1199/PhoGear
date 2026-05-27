'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'
import { logAuditAction } from './audit'

export async function getAllOrders() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles (full_name),
      order_items (
        *,
        products (*)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all orders:', error.message, error.details, error.hint)
    return []
  }

  return data
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()

  // 1. Lấy thông tin đơn hàng hiện tại để kiểm tra trạng thái cũ và lấy danh sách sản phẩm
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('status, user_id, order_items(*)')
    .eq('id', orderId)
    .single()

  if (fetchError) return { error: `Lỗi lấy thông tin đơn hàng: ${fetchError.message}` }

  const oldStatus = order.status
  
  // 2. Cập nhật trạng thái mới
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (updateError) return { error: updateError.message }

  // Log audit action
  await logAuditAction({
    action: 'UPDATE_ORDER_STATUS',
    target_type: 'order',
    target_id: orderId,
    old_values: { status: oldStatus },
    new_values: { status }
  })

  // 3. Tạo thông báo cho người dùng
  const statusLabels: Record<string, string> = {
    'pending': 'đang chờ xác nhận',
    'processing': 'đang được xử lý',
    'shipped': 'đang trên đường giao đến bạn',
    'delivered': 'đã được giao thành công',
    'cancelled': 'đã bị hủy'
  }

  const notificationResult = await createNotification({
    user_id: order.user_id,
    type: 'order_status',
    title: `Cập nhật đơn hàng #${orderId.slice(0, 8).toUpperCase()}`,
    content: `Đơn hàng của bạn hiện tại ${statusLabels[status] || status}.`,
    link: '/orders'
  })

  console.log('Notification creation result:', notificationResult)

  // 4. Xử lý logic kho hàng dựa trên chuyển đổi trạng thái
  
  // TRƯỜNG HỢP: Huỷ đơn hàng (Hoàn lại kho)
  if (status === 'cancelled' && oldStatus !== 'cancelled') {
    for (const item of order.order_items) {
      const { data: product } = await supabase.from('products').select('stock_quantity').eq('id', item.product_id).single()
      if (product) {
        await supabase.from('products').update({ stock_quantity: product.stock_quantity + item.quantity }).eq('id', item.product_id)
      }
      if (item.variant_id) {
        const { data: variant } = await supabase.from('product_variants').select('stock_quantity').eq('id', item.variant_id).single()
        if (variant) {
          await supabase.from('product_variants').update({ stock_quantity: variant.stock_quantity + item.quantity }).eq('id', item.variant_id)
        }
      }
    }
  }
  
  // TRƯỜNG HỢP: Phục hồi đơn hàng từ 'cancelled'
  else if (oldStatus === 'cancelled' && status !== 'cancelled') {
     for (const item of order.order_items) {
      const { data: product } = await supabase.from('products').select('stock_quantity').eq('id', item.product_id).single()
      if (product) {
        await supabase.from('products').update({ stock_quantity: Math.max(0, product.stock_quantity - item.quantity) }).eq('id', item.product_id)
      }
      if (item.variant_id) {
        const { data: variant } = await supabase.from('product_variants').select('stock_quantity').eq('id', item.variant_id).single()
        if (variant) {
          await supabase.from('product_variants').update({ stock_quantity: Math.max(0, variant.stock_quantity - item.quantity) }).eq('id', item.variant_id)
        }
      }
    }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/orders')
  return { success: `Đã cập nhật đơn hàng sang trạng thái: ${status}` }
}
