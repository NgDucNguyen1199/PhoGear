'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TypingScore } from '@/types'

export async function saveTypingScore(score: {
  wpm: number
  accuracy: number
  mode: string
  rank_name: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Cần đăng nhập để lưu điểm.' }

  const { error } = await supabase
    .from('typing_scores')
    .insert({
      user_id: user.id,
      ...score
    })

  if (error) return { error: error.message }

  revalidatePath('/photype')
  return { success: true }
}

export async function getLeaderboard(filter: 'all-time' | 'weekly' | 'monthly' = 'all-time'): Promise<TypingScore[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('typing_scores')
    .select(`
      *,
      profiles (full_name, avatar_url)
    `)
    .order('wpm', { ascending: false })
    .limit(20)

  if (filter === 'weekly') {
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    query = query.gte('created_at', lastWeek.toISOString())
  } else if (filter === 'monthly') {
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    query = query.gte('created_at', lastMonth.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }

  return data as TypingScore[]
}

export async function getUserTypingHistory(): Promise<TypingScore[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('typing_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching typing history:', error)
    return []
  }

  return data
}
