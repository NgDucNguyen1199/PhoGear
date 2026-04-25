'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product, ProductVariant } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Plus, Minus, Check, CreditCard, Box, Tag, LayoutGrid } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AddToCartSectionProps {
  product: Product
  onVariantChange?: (variant: ProductVariant) => void
}

export function AddToCartSection({ product, onVariantChange }: AddToCartSectionProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  
  // 1. Quản lý Biến thể (Variants Table)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  
  // 2. Quản lý Tùy chọn (JSONB Options)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  
  const addItem = useCartStore((state) => state.addItem)
  const variants = product.product_variants || []

  // Khởi tạo mặc định
  useEffect(() => {
    // Mặc định cho Biến thể
    if (variants.length > 0) {
      const defaultVariant = variants[0]
      setSelectedVariant(defaultVariant)
      if (onVariantChange) onVariantChange(defaultVariant)
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
  }, [variants, product.options, onVariantChange])

  // Lấy giá và kho hiện tại
  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity
  const isOutOfStock = currentStock === 0

  const handleVariantClick = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    setQuantity(1)
    if (onVariantChange) onVariantChange(variant)
  }

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }))
  }

  const handleAddToCart = () => {
    // Kiểm tra xem đã chọn đủ các Options JSONB chưa
    if (product.options && Object.keys(selectedOptions).length < product.options.length) {
      toast.error('Vui lòng chọn đầy đủ các tùy chọn sản phẩm.')
      return
    }

    const combinedOptions: Record<string, string> = { ...selectedOptions }
    if (selectedVariant) {
      combinedOptions["Phiên bản"] = selectedVariant.variant_name
    }

    const productWithPrice = { ...product, price: currentPrice }
    addItem(productWithPrice, combinedOptions, quantity)
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  const handleBuyNow = () => {
    if (product.options && Object.keys(selectedOptions).length < product.options.length) {
      toast.error('Vui lòng chọn đầy đủ các tùy chọn sản phẩm.')
      return
    }

    const combinedOptions: Record<string, string> = { ...selectedOptions }
    if (selectedVariant) {
      combinedOptions["Phiên bản"] = selectedVariant.variant_name
    }

    const productWithPrice = { ...product, price: currentPrice }
    addItem(productWithPrice, combinedOptions, quantity)
    router.push('/checkout')
  }

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="space-y-8 mt-4">
      {/* GIÁ TIỀN VÀ SKU */}
      <div className="flex items-center justify-between bg-muted/20 p-5 rounded-2xl border border-white/5 shadow-sm">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Giá bán chính thức</span>
          <div className="text-4xl font-black text-primary drop-shadow-sm transition-all duration-300">
            {formatVND(currentPrice)}
          </div>
        </div>
        {selectedVariant?.sku && (
          <div className="text-right">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-[9px]">Mã SKU</span>
            <p className="font-mono text-xs font-bold text-foreground">{selectedVariant.sku}</p>
          </div>
        )}
      </div>

      {/* 1. HIỂN THỊ TÙY CHỌN (OPTIONS JSONB) - Chỉ chọn 1 trong mỗi nhóm */}
      {product.options && product.options.length > 0 && (
        <div className="space-y-6">
          {product.options.map((option) => (
            <div key={option.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Tag size={14} className="text-primary" /> {option.name}
                </label>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
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
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-0.5 rounded-bl-lg shadow-sm">
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

      {/* 2. HIỂN THỊ BIẾN THỂ (VARIANTS TABLE) - Chọn 1 phiên bản duy nhất */}
      {variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <LayoutGrid size={14} className="text-primary" /> Lựa chọn phiên bản
            </label>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id
              const vOutOfStock = variant.stock_quantity === 0
              
              return (
                <button
                  key={variant.id}
                  disabled={vOutOfStock}
                  onClick={() => handleVariantClick(variant)}
                  className={cn(
                    "group flex flex-col p-2 rounded-2xl border-2 transition-all relative overflow-hidden bg-background",
                    isSelected
                      ? "border-primary bg-primary/[0.03] ring-4 ring-primary/10 shadow-md scale-[1.02]"
                      : "border-muted hover:border-primary/40 hover:bg-muted/30 opacity-80",
                    vOutOfStock && "opacity-40 grayscale cursor-not-allowed"
                  )}
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted mb-2 border border-white/5">
                    {variant.image_url ? (
                      <img 
                        src={variant.image_url} 
                        alt={variant.variant_name} 
                        className="object-cover w-full h-full transition-transform group-hover:scale-110" 
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Box className="h-6 w-6 text-muted-foreground opacity-20" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-1 rounded-bl-lg shadow-sm z-10">
                        <Check className="h-3 w-3" strokeWidth={4} />
                      </div>
                    )}
                  </div>

                  <div className="px-1 text-left">
                    <p className={cn(
                      "text-[10px] font-black truncate transition-colors uppercase leading-tight",
                      isSelected ? "text-primary" : "text-foreground/70"
                    )}>
                      {variant.variant_name}
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground mt-0.5">
                      {formatVND(variant.price)}
                    </p>
                  </div>

                  {vOutOfStock && (
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-[9px] font-black text-destructive uppercase tracking-tighter border border-destructive bg-background/80 px-1.5 py-0.5 rounded">Hết hàng</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* SỐ LƯỢNG & NÚT MUA */}
      <div className="space-y-6 pt-6 border-t border-dashed border-muted-foreground/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-black text-xs uppercase tracking-widest text-muted-foreground">Số lượng</span>
            <div className="flex items-center gap-1 bg-muted/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-background" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1 || isOutOfStock}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-black text-2xl tabular-nums">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-background" onClick={() => setQuantity(q => q + 1)} disabled={quantity >= currentStock || isOutOfStock}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col text-right">
             <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter italic">Trạng thái</span>
             <span className={cn("text-xs font-black", isOutOfStock ? "text-destructive" : "text-green-600")}>
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
