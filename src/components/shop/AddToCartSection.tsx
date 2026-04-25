'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Plus, Minus, Check, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function AddToCartSection({ product }: { product: Product }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const addItem = useCartStore((state) => state.addItem)

  const isOutOfStock = product.stock_quantity === 0

  // Tự động chọn tùy chọn đầu tiên của mỗi nhóm khi tải trang
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
    // Đảm bảo chỉ chọn 1 giá trị duy nhất cho mỗi nhóm (optionName)
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
      <div className="mt-6 space-y-4">
        <Badge variant="destructive" className="h-10 px-6 text-base font-bold uppercase">Hết hàng</Badge>
        <p className="text-sm text-muted-foreground italic italic">Sản phẩm này hiện đang tạm hết, vui lòng quay lại sau.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 mt-6">
      {/* KHU VỰC CHỌN TÙY CHỌN (OPTIONS) */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-6">
          {product.options.map((option) => (
            <div key={option.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                  {option.name}
                </label>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {selectedOptions[option.name]}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {option.values.map((val) => {
                  const isSelected = selectedOptions[option.name] === val
                  return (
                    <button
                      key={val}
                      onClick={() => handleOptionSelect(option.name, val)}
                      className={cn(
                        "px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center gap-2 relative group",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20 shadow-md scale-[1.02]"
                          : "border-muted bg-background hover:border-primary/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {val}
                      {isSelected && (
                        <div className="absolute top-0 right-0">
                           <div className="bg-primary text-primary-foreground p-0.5 rounded-bl-lg shadow-sm">
                             <Check className="h-3 w-3" strokeWidth={4} />
                           </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KHU VỰC CHỌN SỐ LƯỢNG VÀ NÚT MUA */}
      <div className="space-y-6 pt-4 border-t border-dashed">
        <div className="flex items-center gap-6">
          <span className="font-black text-sm uppercase tracking-widest text-muted-foreground">Số lượng</span>
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-white/5 shadow-inner">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-lg hover:bg-background" 
              onClick={handleDecrease} 
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center font-black text-xl tabular-nums">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-lg hover:bg-background" 
              onClick={handleIncrease} 
              disabled={quantity >= product.stock_quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs font-bold text-muted-foreground uppercase bg-muted/30 px-3 py-2 rounded-lg">
            Sẵn có: <span className="text-foreground">{product.stock_quantity}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleAddToCart} 
            variant="outline"
            className="flex-1 h-16 text-lg font-black gap-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl transition-all shadow-lg shadow-primary/5 active:scale-95"
          >
            <ShoppingCart className="h-6 w-6" /> THÊM VÀO GIỎ
          </Button>
          <Button 
            onClick={handleBuyNow} 
            className="flex-1 h-16 text-lg font-black gap-3 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary hover:bg-primary/90"
          >
            <CreditCard className="h-6 w-6" /> MUA NGAY
          </Button>
        </div>
      </div>
    </div>
  )
}

function Badge({ className, children, variant = 'default' }: { className?: string, children: React.ReactNode, variant?: 'default' | 'destructive' }) {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    destructive: 'bg-destructive text-destructive-foreground'
  }
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}
