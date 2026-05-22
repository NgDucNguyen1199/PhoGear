'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export type RateLimitAction = 'login' | 'create_post' | 'add_comment' | 'typing_score'

/**
 * Kiểm tra giới hạn tần suất (Rate Limiting)
 * Trả về true nếu được phép, false nếu bị chặn
 */
export async function checkRateLimit(
  action_type: RateLimitAction,
  max_attempts: number = 5,
  window_minutes: number = 1
): Promise<boolean> {
  try {
    const supabase = await createClient()
    
    // Lấy định danh (IP address)
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 'Unknown'
    
    // Nếu là user đã đăng nhập, có thể dùng user_id làm identifier bổ sung
    const { data: { user } } = await supabase.auth.getUser()
    const identifier = user ? `${ip}:${user.id}` : ip

    // Gọi RPC function trong Postgres
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_action_type: action_type,
      p_max_attempts: max_attempts,
      p_window_minutes: window_minutes
    })

    if (error) {
      console.error('Rate limit RPC error:', error)
      return true // Mặc định cho qua nếu lỗi hệ thống? Hoặc chặn tùy policy.
    }

    return !!data
  } catch (error) {
    console.error('Failed to check rate limit:', error)
    return true
  }
}
