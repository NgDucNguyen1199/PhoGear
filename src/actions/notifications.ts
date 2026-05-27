'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data
}

export async function markAsRead(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/')
  return { success: true }
}

export async function markAllAsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) return { error: error.message }
  
  revalidatePath('/')
  return { success: true }
}

export async function createNotification(notif: {
  user_id: string
  type: 'order_status' | 'forum_reply' | 'flash_sale' | 'system'
  title: string
  content: string
  link?: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .insert(notif)

  if (error) {
    console.error('Error creating notification:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
