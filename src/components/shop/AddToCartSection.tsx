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

export function AddToCartSection({ product }: { product: Product }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  
  // Quản lý duy nhất 1 lựa chọn phiên bản
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  
  const addItem = useCartStore((state) => state.addItem)
  const variants = product.product_variants || []

  // Khởi tạo mặc định: Luôn chọn phiên bản đầu tiên
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0])
    }
  }, [variants])

  // Lấy giá và kho của phiên bản đang chọn
  const currentPrice = selectedVariant ? selectedVariant.price : product.price
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
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  return (
    <div className="space-y-8 mt-4">
      {/* HIỂN THỊ GIÁ TỔNG THỂ */}
      <div className="flex flex-col gap-1 text-left bg-muted/20 p-4 rounded-2xl border border-white/5 shadow-sm">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Giá bán chính thức</span>
        <div className="text-4xl font-black text-primary drop-shadow-sm transition-all duration-300">
          {formatVND(currentPrice)}
        </div>
      </div>

      {/* DANH SÁCH CHỌN PHIÊN BẢN (CHỈ CHỌN 1 TRONG NHIỀU) */}
      {variants.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               <LayoutGrid size={14} className="text-primary" /> Chọn 1 phiên bản bạn thích
            </label>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
              {variants.length} Tùy chọn
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id
              const vOutOfStock = variant.stock_quantity === 0
              
              return (
                <button
                  key={variant.id}
                  disabled={vOutOfStock}
                  onClick={() => {
                    setSelectedVariant(variant)
                    setQuantity(1)
                  }}
                  className={cn(
                    "group flex items-center justify-between p-4 rounded-2xl border-2 transition-all relative overflow-hidden bg-background text-left",
                    isSelected
                      ? "border-primary bg-primary/[0.03] ring-4 ring-primary/10 shadow-md translate-x-1"
                      : "border-muted hover:border-primary/40 hover:bg-muted/30",
                    vOutOfStock && "opacity-50 grayscale cursor-not-allowed"
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "text-sm font-black transition-colors",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {variant.variant_name}
                    </span>
                    {variant.switch_type && (
                      <span className="text-[10px] text-muted-foreground font-medium uppercase italic">
                        Switch: {variant.switch_type}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className={cn(
                      "text-base font-black",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {formatVND(variant.price)}
                    </div>
                    <div className="text-[9px] font-bold text-muted-foreground opacity-60 uppercase">
                       Kho: {vOutOfStock ? "Hết hàng" : variant.stock_quantity}
                    </div>
                  </div>
                  
                  {/* Icon Checkmark xuất hiện khi chọn */}
                  {isSelected && (
                    <div className="absolute top-0 left-0">
                       <div className="bg-primary text-primary-foreground p-0.5 rounded-br-lg shadow-sm">
                         <Check className="h-3 w-3" strokeWidth={4} />
                       </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        /* Fallback nếu không có variants table, hiển thị options JSONB nếu có */
        product.options && product.options.length > 0 && (
          <div className="bg-muted/10 p-4 rounded-xl border border-dashed text-center">
             <p className="text-sm text-muted-foreground italic">Vui lòng chọn các tùy chọn bên dưới để xem giá.</p>
          </div>
        )
      )}

      {/* SỐ LƯỢNG & NÚT MUA */}
      <div className="space-y-6 pt-6 border-t border-dashed border-muted-foreground/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-black text-xs uppercase tracking-widest text-muted-foreground">Số lượng</span>
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-white/5">
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
