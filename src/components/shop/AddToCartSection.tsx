'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product, ProductVariant } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Plus, Minus, Check, CreditCard, LayoutGrid, Image as ImageIcon, Zap, Timer } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getSystemSettings } from '@/actions/admin_settings'

interface AddToCartSectionProps {
  product: Product
  selectedVariant: ProductVariant | null
  onVariantClick: (variant: ProductVariant) => void
}

export function AddToCartSection({ product, selectedVariant, onVariantClick }: AddToCartSectionProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isFlashSaleActive, setIsFlashSaleActive] = useState(false)
  const [endTime, setEndTime] = useState<string | null>(null)
  const addItem = useCartStore((state) => state.addItem)
  const variants = product.product_variants || []

  useEffect(() => {
    const checkFlashSale = async () => {
        const settings = await getSystemSettings()
        if (settings?.flash_sale_enabled && settings?.flash_sale_end_time) {
            setEndTime(settings.flash_sale_end_time)
            const isActive = new Date(settings.flash_sale_end_time) > new Date()
            setIsFlashSaleActive(isActive)
        }
    }
    checkFlashSale()
  }, [])

  // Dynamic check for end time to revert prices in real-time
  useEffect(() => {
    if (!endTime) return

    const interval = setInterval(() => {
        const isActive = new Date(endTime) > new Date()
        if (isActive !== isFlashSaleActive) {
            setIsFlashSaleActive(isActive)
        }
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime, isFlashSaleActive])

  const basePrice = selectedVariant ? selectedVariant.price : product.price
  
  // Calculate if sale price should be applied
  const canApplyFlashSale = isFlashSaleActive && product.is_flash_sale && product.flash_sale_price && (product.flash_sale_sold || 0) < (product.flash_sale_stock || 0)
  
  const currentPrice = canApplyFlashSale ? (product.flash_sale_price as number) : basePrice
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity
  const isOutOfStock = currentStock === 0

  const handleAddToCart = () => {
    if (!selectedVariant && variants.length > 0) {
      toast.error('Vui lòng chọn một phiên bản sản phẩm.')
      return
    }

    const options: Record<string, string> = selectedVariant 
      ? { "Phiên bản": selectedVariant.variant_name } 
      : {}
    
    // Khi thêm vào giỏ, ta gửi giá hiện tại (đã bao gồm giá sale nếu có)
    const productWithPrice = { ...product, price: currentPrice }
    addItem(productWithPrice, options, quantity)
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  const handleBuyNow = () => {
    if (!selectedVariant && variants.length > 0) {
      toast.error('Vui lòng chọn một phiên bản sản phẩm.')
      return
    }

    const options: Record<string, string> = selectedVariant 
      ? { "Phiên bản": selectedVariant.variant_name } 
      : {}
    const productWithPrice = { ...product, price: currentPrice }
    addItem(productWithPrice, options, quantity)
    router.push('/checkout')
  }

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="space-y-8 mt-4">
      {/* GIÁ TIỀN VÀ SKU */}
      <div className={cn(
        "flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl border transition-all duration-500",
        canApplyFlashSale ? "bg-primary/[0.03] border-primary/20 ring-2 ring-primary/10 shadow-lg" : "bg-muted/20 border-white/5 shadow-sm"
      )}>
        <div className="flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                {canApplyFlashSale ? "Giá Flash Sale" : "Giá bán chính thức"}
            </span>
            {canApplyFlashSale && (
                <span className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                    <Zap size={8} className="fill-white" /> TIẾT KIỆM {Math.round((1 - (product.flash_sale_price as number) / basePrice) * 100)}%
                </span>
            )}
          </div>
          <div className="flex items-baseline gap-3">
              <div className={cn(
                "text-4xl font-black drop-shadow-sm transition-all duration-300",
                canApplyFlashSale ? "text-primary" : "text-foreground"
              )}>
                {formatVND(currentPrice)}
              </div>
              {canApplyFlashSale && (
                <div className="text-lg font-bold text-muted-foreground line-through opacity-50">
                    {formatVND(basePrice)}
                </div>
              )}
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:items-end gap-2">
            {selectedVariant?.sku && (
            <div className="text-right">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-[9px]">Mã SKU</span>
                <p className="font-mono text-xs font-bold text-foreground">{selectedVariant.sku}</p>
            </div>
            )}
            {canApplyFlashSale && (
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/10">
                    <Timer size={14} className="text-primary animate-spin" />
                    <span className="text-[10px] font-black text-primary uppercase">Đang áp dụng ưu đãi</span>
                </div>
            )}
        </div>
      </div>

      {/* DANH SÁCH BIẾN THỂ (CHỈ CHỌN 1 TRONG NHIỀU) */}
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
                  type="button"
                  disabled={vOutOfStock}
                  onClick={() => {
                    onVariantClick(variant)
                    setQuantity(1)
                  }}
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
                        <ImageIcon className="h-6 w-6 text-muted-foreground opacity-20" />
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
