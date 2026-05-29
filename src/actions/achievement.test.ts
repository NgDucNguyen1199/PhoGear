import { describe, it, expect, vi, beforeEach } from 'vitest'
import { saveTypingScore } from './typing'
import { createNotification } from './notifications'

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn().mockReturnThis(),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('./notifications', () => ({
  createNotification: vi.fn().mockResolvedValue({ success: true }),
}))

describe('Typing Achievement Test', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' }

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null })
  })

  it('should grant a coupon when user reaches 100 WPM for the first time', async () => {
    const score = {
      wpm: 105,
      accuracy: 98,
      mode: 'time_30_vn',
      rank_name: 'Siêu cấp tốc độ'
    }

    // Mock: user has no existing achievement for 100 WPM
    mockSupabase.maybeSingle.mockResolvedValue({ data: null, error: null })
    
    // Mock: all insertions successful
    mockSupabase.insert.mockResolvedValue({ error: null })

    const result = await saveTypingScore(score)

    // Verify typing score was saved
    expect(mockSupabase.from).toHaveBeenCalledWith('typing_scores')
    
    // Verify achievement check
    expect(mockSupabase.from).toHaveBeenCalledWith('user_achievements')
    expect(mockSupabase.eq).toHaveBeenCalledWith('achievement_key', 'WPM_100_REWARD')

    // Verify coupon creation
    expect(mockSupabase.from).toHaveBeenCalledWith('coupons')
    expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
      value: 10,
      type: 'percentage',
      usage_limit: 1
    }))

    // Verify notification was sent
    expect(createNotification).toHaveBeenCalled()
    
    expect(result.success).toBe(true)
    expect(result.achievement).toBeDefined()
    expect(result.achievement?.message).toContain('PHO100WPM-')
  })

  it('should NOT grant a second coupon if user reaches 100 WPM again', async () => {
    const score = {
      wpm: 110,
      accuracy: 99,
      mode: 'time_30_vn',
      rank_name: 'Siêu cấp tốc độ'
    }

    // Mock: user ALREADY has the achievement
    mockSupabase.maybeSingle.mockResolvedValue({ 
      data: { id: 'ach-1', achievement_key: 'WPM_100_REWARD' }, 
      error: null 
    })
    
    mockSupabase.insert.mockResolvedValue({ error: null })

    const result = await saveTypingScore(score)

    // Verify typing score was saved
    expect(mockSupabase.from).toHaveBeenCalledWith('typing_scores')

    // Verify it checked for existing achievement
    expect(mockSupabase.from).toHaveBeenCalledWith('user_achievements')

    // Verify coupon was NOT created again
    const couponCalls = vi.mocked(mockSupabase.from).mock.calls.filter(call => call[0] === 'coupons')
    expect(couponCalls.length).toBe(0)

    // Verify notification was NOT sent again
    expect(createNotification).not.toHaveBeenCalled()
    
    expect(result.success).toBe(true)
    expect(result.achievement).toBeUndefined()
  })

  it('should NOT grant a coupon if WPM is below 100', async () => {
    const score = {
      wpm: 85,
      accuracy: 95,
      mode: 'time_30_vn',
      rank_name: 'Lão tướng'
    }

    mockSupabase.insert.mockResolvedValue({ error: null })

    const result = await saveTypingScore(score)

    // Verify typing score was saved
    expect(mockSupabase.from).toHaveBeenCalledWith('typing_scores')

    // Verify achievement check was NOT even performed
    const achCalls = vi.mocked(mockSupabase.from).mock.calls.filter(call => call[0] === 'user_achievements')
    expect(achCalls.length).toBe(0)
    
    expect(result.success).toBe(true)
    expect(result.achievement).toBeUndefined()
  })
})
