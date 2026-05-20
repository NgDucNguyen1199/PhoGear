import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CheckoutPage from './page'
import { useCartStore } from '@/store/cartStore'
import { createOrder } from '@/actions/orders'
import { getUser } from '@/actions/auth'

// Mock dependencies
vi.mock('@/store/cartStore', () => ({
  useCartStore: vi.fn(),
  getCartItemId: vi.fn((id) => id),
}))

vi.mock('@/actions/orders', () => ({
  createOrder: vi.fn(),
}))

vi.mock('@/actions/auth', () => ({
  getUser: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('CheckoutPage Integration', () => {
  const mockClearCart = vi.fn()
  const mockGetTotalPrice = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementation for useCartStore
    ;(useCartStore as any).mockReturnValue({
      items: [],
      getTotalPrice: mockGetTotalPrice,
      clearCart: mockClearCart,
    })

    // Default mock for getUser
    ;(getUser as any).mockResolvedValue({ id: 'user-1', full_name: 'Test User' })
  })

  it('renders empty cart message when no items', async () => {
    render(<CheckoutPage />)
    
    // Wait for the mounted state and user check
    await waitFor(() => {
      expect(screen.getByText(/Giỏ hàng của bạn đang trống/i)).toBeInTheDocument()
    })
  })

  it('renders checkout form when cart has items', async () => {
    const mockItems = [
      { id: 'p1', name: 'Product 1', price: 100000, quantity: 1, images_url: ['/img1.png'] }
    ]
    ;(useCartStore as any).mockReturnValue({
      items: mockItems,
      getTotalPrice: () => 100000,
      clearCart: mockClearCart,
    })

    render(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByText(/Thông tin giao hàng/i)).toBeInTheDocument()
      expect(screen.getByText(/Product 1/i)).toBeInTheDocument()
      expect(screen.getByDisplayValue(/Test User/i)).toBeInTheDocument()
    })
  })

  it('submits order successfully', async () => {
    const mockItems = [
      { id: 'p1', name: 'Product 1', price: 100000, quantity: 1, images_url: ['/img1.png'] }
    ]
    ;(useCartStore as any).mockReturnValue({
      items: mockItems,
      getTotalPrice: () => 100000,
      clearCart: mockClearCart,
    })

    ;(createOrder as any).mockResolvedValue({ success: 'Đặt hàng thành công!', orderId: 'order-123' })

    render(<CheckoutPage />)

    await waitFor(() => {
      expect(screen.getByText(/Thông tin giao hàng/i)).toBeInTheDocument()
    })

    // Fill the form
    fireEvent.change(screen.getByLabelText(/Số điện thoại/i), { target: { value: '0987654321' } })
    fireEvent.change(screen.getByLabelText(/Địa chỉ nhận hàng/i), { target: { value: '123 Test St' } })

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Xác nhận đặt hàng/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalled()
      expect(screen.getByText(/Đặt hàng thành công!/i)).toBeInTheDocument()
      expect(mockClearCart).toHaveBeenCalled()
    })
  })
})
