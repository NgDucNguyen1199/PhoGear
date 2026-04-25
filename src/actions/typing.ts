'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

export async function getLeaderboard() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('typing_scores')
    .select(`
      *,
      profiles (full_name, avatar_url)
    `)
    .order('wpm', { ascending: false })
    .limit(23)

  if (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }

  return data
}
