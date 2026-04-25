'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
    console.error('Error fetching all orders:', error)
    return []
  }

  return data
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/orders')
  return { success: `Đã cập nhật đơn hàng sang trạng thái: ${status}` }
}
