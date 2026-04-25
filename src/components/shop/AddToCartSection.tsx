'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product, ProductVariant } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Plus, Minus, Check, CreditCard, Box, LayoutGrid } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AddToCartSectionProps {
  product: Product
  onVariantChange?: (variant: ProductVariant) => void
}

export function AddToCartSection({ product, onVariantChange }: AddToCartSectionProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  
  // Quản lý biến thể đang chọn
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  
  const addItem = useCartStore((state) => state.addItem)
  const variants = product.product_variants || []

  // Khởi tạo mặc định
  useEffect(() => {
    if (variants.length > 0) {
      const defaultVariant = variants[0]
      setSelectedVariant(defaultVariant)
      if (onVariantChange) onVariantChange(defaultVariant)
    }
  }, [variants])

  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity
  const isOutOfStock = currentStock === 0

  const handleVariantClick = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    setQuantity(1)
    if (onVariantChange) onVariantChange(variant)
  }

  const handleAddToCart = () => {
    const options: Record<string, string> = selectedVariant 
      ? { "Phiên bản": selectedVariant.variant_name } 
      : {}
    const productWithPrice = { ...product, price: currentPrice }
    addItem(productWithPrice, options, quantity)
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  const handleBuyNow = () => {
    const options: Record<string, string> = selectedVariant 
      ? { "Phiên bản": selectedVariant.variant_name } 
      : {}
    const productWithPrice = { ...product, price: currentPrice }
    addItem(productWithPrice, options, quantity)
    router.push('/checkout')
  }

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
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
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Mã SKU</span>
            <p className="font-mono text-xs font-bold text-foreground">{selectedVariant.sku}</p>
          </div>
        )}
      </div>

      {/* MENU HÌNH ẢNH BIẾN THỂ (VARIANTS IMAGES) */}
      {variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <LayoutGrid size={14} className="text-primary" /> Lựa chọn phiên bản & Màu sắc
            </label>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
               {selectedVariant?.variant_name}
            </span>
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
                      : "border-muted hover:border-primary/40 hover:bg-muted/30 opacity-70 hover:opacity-100",
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
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-white/5 shadow-inner">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1 || isOutOfStock}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-black text-xl tabular-nums">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => setQuantity(q => q + 1)} disabled={quantity >= currentStock || isOutOfStock}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col text-right">
             <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter italic">Trạng thái kho</span>
             <span className={cn("text-xs font-black", isOutOfStock ? "text-destructive" : "text-green-600")}>
                {isOutOfStock ? "TẠM HẾT HÀNG" : `SẴN CÓ: ${currentStock}`}
             </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
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
