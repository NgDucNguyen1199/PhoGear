'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product, ProductVariant } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Plus, Minus, Check, CreditCard, Box, Tag } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function AddToCartSection({ product }: { product: Product }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  
  // 1. Quản lý Biến thể (Variants - Table)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  
  // 2. Quản lý Tùy chọn (Simple Options - JSONB)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  
  const addItem = useCartStore((state) => state.addItem)
  const variants = product.product_variants || []

  // Khởi tạo mặc định
  useEffect(() => {
    // Mặc định cho Biến thể
    if (variants.length > 0) {
      setSelectedVariant(variants[0])
    }
    
    // Mặc định cho Tùy chọn JSONB
    if (product.options && product.options.length > 0) {
      const initialOptions: Record<string, string> = {}
      product.options.forEach(opt => {
        if (opt.values && opt.values.length > 0) {
          initialOptions[opt.name] = opt.values[0]
        }
      })
      setSelectedOptions(initialOptions)
    }
  }, [variants, product.options])

  // Lấy giá và kho
  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity
  const isOutOfStock = currentStock === 0

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }))
  }

  const handleAddToCart = () => {
    // Gộp cả Variant và Options JSONB
    const combinedOptions: Record<string, string> = { ...selectedOptions }
    if (selectedVariant) {
      combinedOptions["Phiên bản"] = selectedVariant.variant_name
    }

    const productWithPrice = { ...product, price: currentPrice }
    addItem(productWithPrice, combinedOptions, quantity)
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  const handleBuyNow = () => {
    const combinedOptions: Record<string, string> = { ...selectedOptions }
    if (selectedVariant) {
      combinedOptions["Phiên bản"] = selectedVariant.variant_name
    }

    const productWithPrice = { ...product, price: currentPrice }
    addItem(productWithPrice, combinedOptions, quantity)
    router.push('/checkout')
  }

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* GIÁ TIỀN */}
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Giá bán hiện tại</span>
        <div className="text-4xl font-black text-primary drop-shadow-sm transition-all duration-300">
          {formatVND(currentPrice)}
        </div>
      </div>

      {/* 1. HIỂN THỊ TÙY CHỌN (OPTIONS JSONB) - Đã thêm lại phần này */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-6">
          {product.options.map((option) => (
            <div key={option.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Tag size={14} className="text-primary" /> {option.name}
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
                        "px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all flex items-center gap-2 relative",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/10 scale-[1.02]"
                          : "border-muted bg-background hover:border-primary/40 text-muted-foreground"
                      )}
                    >
                      {val}
                      {isSelected && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-0.5 rounded-bl-lg">
                          <Check className="h-3 w-3" strokeWidth={4} />
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

      {/* 2. HIỂN THỊ BIẾN THỂ (VARIANTS TABLE) */}
      {variants.length > 0 && (
        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
             <Box size={14} className="text-primary" /> Lựa chọn phiên bản
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id
              return (
                <div key={variant.id} className="flex flex-col gap-2">
                  <span className={cn(
                    "text-[10px] font-bold uppercase transition-colors px-1 truncate text-left",
                    isSelected ? "text-primary" : "text-muted-foreground/60"
                  )}>
                    {variant.variant_name}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedVariant(variant)
                      setQuantity(1)
                    }}
                    className={cn(
                      "group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all relative overflow-hidden h-24 bg-background",
                      isSelected
                        ? "border-primary bg-primary/[0.03] ring-4 ring-primary/10 scale-[1.02] shadow-lg"
                        : "border-muted hover:border-primary/40 hover:bg-muted/30"
                    )}
                  >
                    <div className={cn(
                      "text-lg font-black transition-colors",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {formatVND(variant.price)}
                    </div>
                    <div className="mt-1 text-[10px] font-bold text-muted-foreground opacity-60">KHO: {variant.stock_quantity}</div>
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-1 rounded-bl-xl shadow-sm">
                        <Check className="h-3.5 w-3.5" strokeWidth={4} />
                      </div>
                    )}
                    {variant.stock_quantity === 0 && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-destructive uppercase tracking-tighter">Hết hàng</span>
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* SỐ LƯỢNG & NÚT MUA */}
      <div className="space-y-6 pt-6 border-t border-dashed border-muted-foreground/20">
        <div className="flex items-center gap-6">
          <span className="font-black text-xs uppercase tracking-widest text-muted-foreground">Số lượng</span>
          <div className="flex items-center gap-1 bg-muted/40 p-1.5 rounded-2xl border border-white/5">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1 || isOutOfStock}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-black text-2xl tabular-nums text-foreground">{quantity}</span>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => setQuantity(q => q + 1)} disabled={quantity >= currentStock || isOutOfStock}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col text-left">
             <span className="text-[10px] font-bold text-muted-foreground uppercase">Trạng thái kho</span>
             <span className={cn("text-sm font-black", isOutOfStock ? "text-destructive" : "text-green-600")}>
                {isOutOfStock ? "TẠM HẾT HÀNG" : `SẴN CÓ: ${currentStock}`}
             </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button onClick={handleAddToCart} variant="outline" disabled={isOutOfStock} className="flex-1 h-16 text-lg font-black gap-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl transition-all shadow-lg active:scale-95">
            <ShoppingCart className="h-6 w-6" /> THÊM VÀO GIỎ
          </Button>
          <Button onClick={handleBuyNow} disabled={isOutOfStock} className="flex-1 h-16 text-lg font-black gap-3 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all bg-primary hover:bg-primary/90 text-primary-foreground border-none">
            <CreditCard className="h-6 w-6" /> MUA NGAY
          </Button>
        </div>
      </div>
    </div>
  )
}
