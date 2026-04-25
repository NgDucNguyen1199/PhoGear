'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function AddToCartSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const addItem = useCartStore((state) => state.addItem)

  const isOutOfStock = product.stock_quantity === 0

  // Khởi tạo tùy chọn mặc định nếu có
  useEffect(() => {
    if (product.options && product.options.length > 0) {
      const initialOptions: Record<string, string> = {}
      product.options.forEach(opt => {
        if (opt.values && opt.values.length > 0) {
          initialOptions[opt.name] = opt.values[0]
        }
      })
      setSelectedOptions(initialOptions)
    }
  }, [product.options])

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }))
  }

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
    // Kiểm tra xem đã chọn đủ options chưa (nếu cần bắt buộc)
    if (product.options && Object.keys(selectedOptions).length < product.options.length) {
      toast.error('Vui lòng chọn đầy đủ các tùy chọn sản phẩm.')
      return
    }

    addItem(product, selectedOptions, quantity)
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
    <div className="space-y-6 mt-6">
      {/* HIỂN THỊ CÁC TÙY CHỌN (OPTIONS) */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-4">
          {product.options.map((option) => (
            <div key={option.name} className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {option.name}: <span className="text-foreground">{selectedOptions[option.name]}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {option.values.map((val) => (
                  <button
                    key={val}
                    onClick={() => handleOptionSelect(option.name, val)}
                    className={cn(
                      "px-4 py-2 rounded-md border text-sm font-medium transition-all flex items-center gap-2",
                      selectedOptions[option.name] === val
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                        : "border-muted bg-background hover:border-primary/50 text-muted-foreground"
                    )}
                  >
                    {selectedOptions[option.name] === val && <Check className="h-3 w-3" />}
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <span className="font-medium text-sm">Số lượng:</span>
        <div className="flex items-center gap-2 border rounded-md p-1 bg-muted/20">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDecrease} disabled={quantity <= 1}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center font-bold">{quantity}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleIncrease} disabled={quantity >= product.stock_quantity}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <span className="text-xs text-muted-foreground ml-2">
          (Kho: {product.stock_quantity})
        </span>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleAddToCart} className="flex-1 h-12 text-lg font-bold gap-2 shadow-lg shadow-primary/20 transition-transform active:scale-95">
          <ShoppingCart className="h-5 w-5" /> Thêm vào giỏ hàng
        </Button>
      </div>
    </div>
  )
}
