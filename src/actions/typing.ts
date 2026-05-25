'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TypingScore } from '@/types'
import { createNotification } from './notifications'

export async function saveTypingScore(score: {
  wpm: number
  accuracy: number
  mode: string
  rank_name: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Cần đăng nhập để lưu điểm.' }

  // 1. Lưu điểm số bình thường
  const { error } = await supabase
    .from('typing_scores')
    .insert({
      user_id: user.id,
      ...score
    })

  if (error) return { error: error.message }

  // 2. Kiểm tra các mốc thành tựu
  const achievements = [
    { 
      threshold: 100, 
      key: 'WPM_100_REWARD', 
      discount: 10, 
      maxAmount: 200000, 
      title: 'SIÊU CẤP TỐC ĐỘ', 
      rankName: 'Pho Master' 
    },
    { 
      threshold: 50, 
      key: 'WPM_50_REWARD', 
      discount: 5, 
      maxAmount: 100000, 
      title: 'TAY ĐUA TỐC ĐỘ', 
      rankName: 'Thần sấm' 
    }
  ]

  for (const ach of achievements) {
    if (score.wpm >= ach.threshold) {
      try {
        // Kiểm tra xem đã nhận thưởng mốc này chưa
        const { data: existingAchievement } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id)
          .eq('achievement_key', ach.key)
          .maybeSingle()

        if (!existingAchievement) {
          // Đánh dấu đã nhận thưởng
          const { error: achievementError } = await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              achievement_key: ach.key
            })

          if (!achievementError) {
            // Tạo mã giảm giá độc nhất
            const couponCode = `PHO${ach.threshold}WPM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
            
            // Tính toán ngày hết hạn (6 tháng kể từ bây giờ)
            const expiryDate = new Date()
            expiryDate.setMonth(expiryDate.getMonth() + 6)

            const { error: couponError } = await supabase
              .from('coupons')
              .insert({
                code: couponCode,
                type: 'percentage',
                value: ach.discount,
                max_discount_amount: ach.maxAmount,
                is_active: true,
                usage_limit: 1,
                end_date: expiryDate.toISOString(),
                description: `Thành tựu PhoType: Đạt ${ach.threshold} WPM (Hạn dùng 6 tháng)`
              })

            if (!couponError) {
              // Gửi thông báo chúc mừng
              await createNotification({
                user_id: user.id,
                type: 'system',
                title: `🎉 THÀNH TỰU MỚI: ${ach.title}!`,
                content: `Chúc mừng bạn đạt ${ach.threshold} WPM! PhoGear tặng bạn mã giảm giá ${ach.discount}% (giảm tối đa ${ach.maxAmount.toLocaleString('vi-VN')}đ). Mã: ${couponCode}. Hạn sử dụng: ${expiryDate.toLocaleDateString('vi-VN')}`,
                link: '/photype'
              })
              
              revalidatePath('/photype')
              // Nếu đạt mốc cao nhất thì trả về ngay để Frontend hiển thị mốc đó
              if (ach.threshold === 100) {
                  return { 
                    success: true, 
                    achievement: {
                      title: ach.title,
                      message: `Bạn nhận được mã giảm giá ${ach.discount}%: ${couponCode}`,
                      code: couponCode
                    } 
                  }
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error in achievement logic for ${ach.key}:`, err)
      }
    }
  }

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
