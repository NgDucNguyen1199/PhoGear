'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'

export function AddToCartSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const isOutOfStock = product.stock_quantity === 0

  const handleIncrease = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(q => q + 1)
    } else {
      toast.warning(`Chỉ còn ${product.stock_quantity} sản phẩm trong kho.`)
    }
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  const handleAddToCart = () => {
    // Add multiples items by calling addItem multiple times or update logic.
    // However, our cartStore `addItem` adds 1 item per call. 
    // To fix this quickly without changing cartStore logic for multiple quantity at once:
    // We update cartStore if item exists, or we add one, then update quantity.
    
    // Better way: cartStore updateQuantity handles setting exact quantity if item is already in cart.
    // Let's add 1 first, then if quantity > 1, get current items and increase.
    
    // For simplicity, we just add the product once, then use updateQuantity logic if needed.
    // Actually, I'll loop it for now since addItem handles incrementing if exists:
    for(let i = 0; i < quantity; i++) {
      addItem(product)
    }

    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  if (isOutOfStock) {
    return (
      <Button disabled className="w-full h-12 text-lg font-bold" variant="destructive">
        Hết hàng
      </Button>
    )
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center gap-4">
        <span className="font-medium text-sm">Số lượng:</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleDecrease} disabled={quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-bold">{quantity}</span>
          <Button variant="outline" size="icon" onClick={handleIncrease} disabled={quantity >= product.stock_quantity}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground ml-2">
          (Còn {product.stock_quantity} sản phẩm)
        </span>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleAddToCart} className="flex-1 h-12 text-lg font-bold gap-2">
          <ShoppingCart className="h-5 w-5" /> Thêm vào giỏ
        </Button>
      </div>
    </div>
  )
}
