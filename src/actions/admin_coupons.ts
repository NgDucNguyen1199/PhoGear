'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Coupon } from '@/types'

export async function createCoupon(data: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('coupons')
    .insert({
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.type === 'free_shipping' ? 0 : (parseFloat(data.value) || 0),
      min_order_amount: parseFloat(data.min_order_amount) || 0,
      max_discount_amount: data.max_discount_amount ? parseFloat(data.max_discount_amount) : null,
      start_date: data.start_date || new Date().toISOString(),
      end_date: data.end_date || null,
      is_active: data.is_active !== undefined ? data.is_active : true,
      usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
    })

  if (error) {
    console.error('Error handling coupon operation:', error.message, error.details, error.hint)
    return { error: `Lỗi: ${error.message}` }
  }

  revalidatePath('/admin/coupons')
  return { success: 'Đã thêm mã giảm giá thành công!' }
}

export async function updateCoupon(id: string, data: any) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('coupons')
    .update({
      code: data.code.toUpperCase(),
      type: data.type,
      value: data.type === 'free_shipping' ? 0 : (parseFloat(data.value) || 0),
      min_order_amount: parseFloat(data.min_order_amount) || 0,
      max_discount_amount: data.max_discount_amount ? parseFloat(data.max_discount_amount) : null,
      start_date: data.start_date,
      end_date: data.end_date,
      is_active: data.is_active,
      usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating coupon:', error.message, error.details, error.hint)
    return { error: `Lỗi cập nhật mã giảm giá: ${error.message}` }
  }

  revalidatePath('/admin/coupons')
  return { success: 'Đã cập nhật mã giảm giá thành công!' }
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting coupon:', error.message, error.details, error.hint)
    return { error: `Lỗi xóa mã giảm giá: ${error.message}` }
  }

  revalidatePath('/admin/coupons')
  return { success: 'Đã xóa mã giảm giá thành công!' }
}

export async function getCoupons(): Promise<Coupon[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching coupons:', error.message, error.details, error.hint)
    return []
  }

  return data as Coupon[]
}
