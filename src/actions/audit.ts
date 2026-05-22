'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export type AuditAction = 
  | 'CREATE_PRODUCT' | 'UPDATE_PRODUCT' | 'DELETE_PRODUCT'
  | 'CREATE_COUPON' | 'UPDATE_COUPON' | 'DELETE_COUPON'
  | 'CREATE_CATEGORY' | 'UPDATE_CATEGORY' | 'DELETE_CATEGORY'
  | 'UPDATE_ORDER_STATUS' | 'UPDATE_SYSTEM_SETTINGS'
  | 'MODERATE_POST' | 'DELETE_POST' | 'DELETE_COMMENT'

interface LogAuditParams {
  action: AuditAction
  target_type: string
  target_id?: string
  old_values?: any
  new_values?: any
}

/**
 * Ghi lại nhật ký thay đổi của Admin
 */
export async function logAuditAction({
  action,
  target_type,
  target_id,
  old_values,
  new_values
}: LogAuditParams) {
  try {
    const supabase = await createClient()
    
    // Lấy thông tin admin hiện tại
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Lấy thông tin network
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 'Unknown'
    const userAgent = headersList.get('user-agent') || 'Unknown'

    // Ghi vào bảng audit_logs
    await supabase.from('audit_logs').insert({
      admin_id: user.id,
      action,
      target_type,
      target_id,
      old_values,
      new_values,
      ip_address: ip,
      user_agent: userAgent
    })
  } catch (error) {
    console.error('Failed to log audit action:', error)
  }
}
