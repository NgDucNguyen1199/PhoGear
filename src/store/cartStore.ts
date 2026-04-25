import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

export type CartItem = Product & {
  quantity: number
  selectedOptions?: Record<string, string>
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, selectedOptions?: Record<string, string>, quantity?: number) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

// Helper to generate a unique key for a cart item based on product ID and options
export const getCartItemId = (productId: string, options?: Record<string, string>) => {
  if (!options || Object.keys(options).length === 0) return productId
  const optionsString = Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|')
  return `${productId}-${optionsString}`
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, selectedOptions?: Record<string, string>, quantity: number = 1) => {
        const currentItems = get().items
        const cartItemId = getCartItemId(product.id, selectedOptions)
        
        // We need a unique ID for the cart item, but we'll use a virtual one for comparison
        // Let's add a `cartId` field to CartItem for easier management
        const existingItemIndex = currentItems.findIndex((item) => {
          const itemCartId = getCartItemId(item.id, item.selectedOptions)
          return itemCartId === cartItemId
        })

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems]
          updatedItems[existingItemIndex].quantity += quantity
          set({ items: updatedItems })
        } else {
          set({ items: [...currentItems, { ...product, quantity, selectedOptions }] })
        }
      },

      removeItem: (cartItemId: string) => {
        // cartItemId here is the composite key
        set({
          items: get().items.filter((item) => getCartItemId(item.id, item.selectedOptions) !== cartItemId),
        })
      },

      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId)
          return
        }

        set({
          items: get().items.map((item) =>
            getCartItemId(item.id, item.selectedOptions) === cartItemId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'pho-gear-cart',
    }
  )
)
