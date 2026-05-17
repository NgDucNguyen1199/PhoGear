'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSystemSettings() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('system_settings')
    .select('*')
    .eq('id', 'main')
    .maybeSingle()

  if (error) {
    // Only log if it's not a 'table not found' error to reduce noise during setup
    const isTableMissing = error.code === '42P01' || 
      error.code === 'PGRST205' ||
      error.message?.includes('Could not find the table') ||
      error.message?.includes('schema cache')

    if (!isTableMissing) {
      console.error('Error fetching system settings:', error.message || error)
    }
  }

  // Return data if found, otherwise return default settings
  return data || {
    site_name: 'Pho Gear',
    contact_email: 'contact@phogear.com',
    currency: 'VND',
    language: 'vi',
    order_notifications: true,
    weekly_reports: false,
    two_factor_auth: false
  }
}

export async function updateSystemSettings(formData: FormData) {
  const supabase = await createClient()

  console.log('--- Start updateSystemSettings ---')
  
  // Verify admin role
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('Auth error or no user:', userError)
    return { error: 'Bạn cần đăng nhập.' }
  }
  
  console.log('User ID:', user.id)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.error('Profile fetch error:', profileError)
    return { error: 'Không thể xác thực quyền hạn.' }
  }

  console.log('User role:', profile.role)

  if (profile.role !== 'admin') {
    return { error: 'Bạn không có quyền thực hiện hành động này.' }
  }

  const updates = {
    site_name: formData.get('siteName') as string,
    contact_email: formData.get('contactEmail') as string,
    currency: formData.get('currency') as string,
    language: formData.get('language') as string,
    order_notifications: formData.get('orderNotifications') === 'on',
    weekly_reports: formData.get('weeklyReports') === 'on',
    two_factor_auth: formData.get('twoFactorAuth') === 'on',
    updated_at: new Date().toISOString()
  }

  console.log('Attempting upsert with:', updates)

  const { data, error } = await supabase
    .from('system_settings')
    .upsert({ id: 'main', ...updates })
    .select()

  if (error) {
    console.error('Full UPSERT error:', error)
    
    if (error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('not found')) {
      return { 
        error: 'Bảng system_settings chưa được tạo. Hãy sao chép nội dung file supabase/system_settings.sql và chạy trong SQL Editor của Supabase.' 
      }
    }
    
    return { error: `Lỗi cập nhật cài đặt: ${error.message} (Code: ${error.code})` }
  }

  console.log('Upsert successful, returned data:', data)

  revalidatePath('/', 'layout')
  revalidatePath('/admin/settings')
  return { success: 'Cập nhật cài đặt thành công!' }
}

export async function getLoginHistory() {
  const supabase = await createClient()

  // Verify admin role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return []
  }

  const { data, error } = await supabase
    .from('login_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching login history:', error)
    return []
  }

  return data
}
