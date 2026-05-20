import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createOrder } from './orders'

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
}

// Ensure select is available after insert for chaining
mockSupabase.insert.mockReturnValue(mockSupabase)
mockSupabase.select.mockReturnValue(mockSupabase)

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => Promise.resolve(mockSupabase),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Order Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return error if user is not logged in', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })
    
    const formData = new FormData()
    const result = await createOrder(formData, [])
    
    expect(result.error).toBe('Bạn cần đăng nhập để đặt hàng.')
  })

  it('should return error if shipping info is missing', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    
    const formData = new FormData()
    const result = await createOrder(formData, [])
    
    expect(result.error).toBe('Vui lòng cung cấp đầy đủ địa chỉ và số điện thoại.')
  })

  it('should calculate total amount correctly with shipping fee', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    
    // Mock system settings
    mockSupabase.single.mockResolvedValueOnce({ data: { flash_sale_enabled: false } })
    
    // Mock product
    mockSupabase.single.mockResolvedValueOnce({ 
      data: { id: 'p1', price: 100000, is_flash_sale: false } 
    })
    
    // Mock order creation - first insert should return mockSupabase for chaining
    mockSupabase.insert.mockReturnValueOnce(mockSupabase)
    mockSupabase.single.mockResolvedValueOnce({ 
      data: { id: 'order-123' }, error: null 
    })

    // Mock order items insertion - second insert
    mockSupabase.insert.mockResolvedValueOnce({ error: null })
    
    const formData = new FormData()
    formData.append('address', '123 Test St')
    formData.append('phone', '0987654321')

    const items = [{ product_id: 'p1', quantity: 1, price_at_time: 100000 }]
    const result = await createOrder(formData, items)
    
    expect(result.success).toBe('Đặt hàng thành công!')
    expect(result.orderId).toBe('order-123')
    
    // Check if total amount includes shipping fee (100k < 800k, so +30k = 130k)
    expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
      total_amount: 130000
    }))
  })

  it('should apply flash sale price when active and stock available', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    
    // Mock system settings (flash sale enabled)
    mockSupabase.single.mockResolvedValueOnce({ 
      data: { 
        flash_sale_enabled: true, 
        flash_sale_end_time: new Date(Date.now() + 100000).toISOString() 
      } 
    })
    
    // Mock product (has flash sale price and stock)
    mockSupabase.single.mockResolvedValueOnce({ 
      data: { 
        id: 'p1', 
        price: 100000, 
        is_flash_sale: true, 
        flash_sale_price: 50000,
        flash_sale_stock: 10,
        flash_sale_sold: 2
      } 
    })
    
    mockSupabase.insert.mockReturnValueOnce(mockSupabase)
    mockSupabase.single.mockResolvedValueOnce({ data: { id: 'order-123' }, error: null })
    mockSupabase.insert.mockResolvedValueOnce({ error: null })
    
    const formData = new FormData()
    formData.append('address', '123 Test St')
    formData.append('phone', '0987654321')

    const items = [{ product_id: 'p1', quantity: 2, price_at_time: 50000 }]
    const result = await createOrder(formData, items)
    
    // Total should be (50k * 2) + 30k shipping = 130k
    expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
      total_amount: 130000
    }))
    expect(result.success).toBe('Đặt hàng thành công!')
  })
})
