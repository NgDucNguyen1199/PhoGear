import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

export type CartItem = Product & {
  quantity: number
  variantId?: string
  selectedOptions?: Record<string, string>
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  setOpen: (open: boolean) => void
  addItem: (product: Product, variantId?: string, selectedOptions?: Record<string, string>, quantity?: number) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

// Helper to generate a unique key for a cart item based on product ID and variant/options
export const getCartItemId = (productId: string, variantId?: string, options?: Record<string, string>) => {
  let id = productId
  if (variantId) id += `-${variantId}`
  if (!options || Object.keys(options).length === 0) return id
  
  const optionsString = Object.entries(options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|')
  return `${id}-${optionsString}`
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (open: boolean) => set({ isOpen: open }),
      
      addItem: (product: Product, variantId?: string, selectedOptions?: Record<string, string>, quantity: number = 1) => {
        const currentItems = get().items
        const cartItemId = getCartItemId(product.id, variantId, selectedOptions)
        
        const existingItemIndex = currentItems.findIndex((item) => {
          const itemCartId = getCartItemId(item.id, item.variantId, item.selectedOptions)
          return itemCartId === cartItemId
        })

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems]
          updatedItems[existingItemIndex].quantity += quantity
          set({ items: updatedItems, isOpen: true }) // Auto-open cart on add
        } else {
          set({ items: [...currentItems, { ...product, variantId, quantity, selectedOptions }], isOpen: true }) // Auto-open cart on add
        }
      },

      removeItem: (cartItemId: string) => {
        set({
          items: get().items.filter((item) => getCartItemId(item.id, item.variantId, item.selectedOptions) !== cartItemId),
        })
      },

      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId)
          return
        }

        set({
          items: get().items.map((item) =>
            getCartItemId(item.id, item.variantId, item.selectedOptions) === cartItemId ? { ...item, quantity } : item
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
      // Don't persist isOpen state
      partialize: (state) => ({ items: state.items }),
    }
  )
)
