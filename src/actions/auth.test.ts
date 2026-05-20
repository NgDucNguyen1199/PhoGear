import { describe, it, expect, vi, beforeEach } from 'vitest'
import { enrollMfa, verifyMfaChallenge, unenrollMfa, getMfaFactors } from './auth'

// Mock Supabase
const mockSupabase = {
  auth: {
    mfa: {
      enroll: vi.fn(),
      challenge: vi.fn(),
      verify: vi.fn(),
      unenroll: vi.fn(),
      listFactors: vi.fn(),
    },
    getUser: vi.fn(),
  },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn().mockReturnThis(),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: () => Promise.resolve(new Map()),
}))

describe('Auth MFA Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('enrollMfa', () => {
    it('should enroll MFA and return data on success', async () => {
      const mockData = { id: 'factor-123', totp: { qr_code: 'qr-code-url' } }
      mockSupabase.auth.mfa.enroll.mockResolvedValue({ data: mockData, error: null })

      const result = await enrollMfa()

      expect(mockSupabase.auth.mfa.enroll).toHaveBeenCalledWith({
        factorType: 'totp',
        issuer: 'Pho Gear',
      })
      expect(result.data).toEqual(mockData)
    })

    it('should return error message on failure', async () => {
      mockSupabase.auth.mfa.enroll.mockResolvedValue({ data: null, error: { message: 'Enrollment failed' } })

      const result = await enrollMfa()

      expect(result.error).toBe('Enrollment failed')
    })
  })

  describe('verifyMfaChallenge', () => {
    it('should challenge and verify code successfully', async () => {
      const factorId = 'factor-123'
      const code = '123456'
      const challengeId = 'challenge-456'

      mockSupabase.auth.mfa.challenge.mockResolvedValue({ data: { id: challengeId }, error: null })
      mockSupabase.auth.mfa.verify.mockResolvedValue({ data: {}, error: null })

      const result = await verifyMfaChallenge(factorId, code)

      expect(mockSupabase.auth.mfa.challenge).toHaveBeenCalledWith({ factorId })
      expect(mockSupabase.auth.mfa.verify).toHaveBeenCalledWith({
        factorId,
        challengeId,
        code,
      })
      expect(result.success).toBe(true)
    })

    it('should return error if challenge fails', async () => {
      mockSupabase.auth.mfa.challenge.mockResolvedValue({ data: null, error: { message: 'Challenge failed' } })

      const result = await verifyMfaChallenge('f1', '123456')

      expect(result.error).toBe('Challenge failed')
      expect(mockSupabase.auth.mfa.verify).not.toHaveBeenCalled()
    })

    it('should return error if verification fails', async () => {
      mockSupabase.auth.mfa.challenge.mockResolvedValue({ data: { id: 'c1' }, error: null })
      mockSupabase.auth.mfa.verify.mockResolvedValue({ data: null, error: { message: 'Invalid code' } })

      const result = await verifyMfaChallenge('f1', '123456')

      expect(result.error).toBe('Invalid code')
    })
  })

  describe('unenrollMfa', () => {
    it('should unenroll MFA factor', async () => {
      mockSupabase.auth.mfa.unenroll.mockResolvedValue({ error: null })

      const result = await unenrollMfa('factor-123')

      expect(mockSupabase.auth.mfa.unenroll).toHaveBeenCalledWith({ factorId: 'factor-123' })
      expect(result.success).toBe(true)
    })
  })

  describe('getMfaFactors', () => {
    it('should return factors list', async () => {
      const mockFactors = { all: [{ id: 'f1', status: 'verified' }], unverified: [], verified: [] }
      mockSupabase.auth.mfa.listFactors.mockResolvedValue({ data: mockFactors, error: null })

      const result = await getMfaFactors()

      expect(result).toEqual(mockFactors)
    })

    it('should return empty list on error', async () => {
      mockSupabase.auth.mfa.listFactors.mockResolvedValue({ data: null, error: { message: 'Error' } })

      const result = await getMfaFactors()

      expect(result.all).toEqual([])
    })
  })
})
