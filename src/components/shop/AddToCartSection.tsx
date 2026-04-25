'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Check, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function AddToCartSection({ product }: { product: Product }) {
  const router = useRouter()
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
    if (product.options && Object.keys(selectedOptions).length < product.options.length) {
      toast.error('Vui lòng chọn đầy đủ các tùy chọn sản phẩm.')
      return
    }

    addItem(product, selectedOptions, quantity)
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  const handleBuyNow = () => {
    if (product.options && Object.keys(selectedOptions).length < product.options.length) {
      toast.error('Vui lòng chọn đầy đủ các tùy chọn sản phẩm.')
      return
    }

    addItem(product, selectedOptions, quantity)
    router.push('/checkout')
  }

  if (isOutOfStock) {
    return (
      <Button disabled className="w-full h-12 text-lg font-bold" variant="destructive">
        Hết hàng
      </Button>
    )
  }

  return (
    <div className="space-y-8 mt-6">
      {/* HIỂN THỊ CÁC TÙY CHỌN (OPTIONS) */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-6">
          {product.options.map((option) => (
            <div key={option.name} className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                <span>{option.name}</span>
                <span className="text-primary normal-case font-medium">{selectedOptions[option.name]}</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {option.values.map((val) => (
                  <button
                    key={val}
                    onClick={() => handleOptionSelect(option.name, val)}
                    className={cn(
                      "px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all flex items-center gap-2 relative overflow-hidden",
                      selectedOptions[option.name] === val
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-muted bg-background hover:border-primary/40 text-muted-foreground"
                    )}
                  >
                    {val}
                    {selectedOptions[option.name] === val && (
                      <div className="absolute top-0 right-0">
                         <div className="bg-primary text-primary-foreground p-0.5 rounded-bl-lg">
                           <Check className="h-3 w-3" strokeWidth={4} />
                         </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-2xl w-fit border border-white/5">
          <span className="font-bold text-sm ml-2">Số lượng:</span>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full bg-background" onClick={handleDecrease} disabled={quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-6 text-center font-black text-lg font-mono">{quantity}</span>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full bg-background" onClick={handleIncrease} disabled={quantity >= product.stock_quantity}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <span className="text-xs font-medium text-muted-foreground mr-2">
            Kho: {product.stock_quantity}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button 
            onClick={handleAddToCart} 
            variant="outline"
            className="flex-1 h-14 text-lg font-bold gap-2 border-2 border-primary text-primary hover:bg-primary/5 transition-all"
          >
            <ShoppingCart className="h-5 w-5" /> Thêm vào giỏ
          </Button>
          <Button 
            onClick={handleBuyNow} 
            className="flex-1 h-14 text-lg font-bold gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <CreditCard className="h-5 w-5" /> MUA NGAY
          </Button>
        </div>
      </div>
    </div>
  )
}

import { Separator } from '@/components/ui/separator'
