'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product, ProductVariant } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Plus, Minus, Check, CreditCard, Box } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function AddToCartSection({ product }: { product: Product }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  
  // Quản lý biến thể đang chọn (Sử dụng product_variants từ database)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  
  const addItem = useCartStore((state) => state.addItem)

  const variants = product.product_variants || []

  // Khởi tạo biến thể mặc định (Phiên bản đầu tiên)
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0])
    }
  }, [variants])

  // Lấy giá tiền và tồn kho hiện tại
  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity
  const isOutOfStock = currentStock === 0

  const handleIncrease = () => {
    if (quantity < currentStock) {
      setQuantity(q => q + 1)
    } else {
      toast.warning(`Chỉ còn ${currentStock} sản phẩm trong kho.`)
    }
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1)
    }
  }

  const handleAddToCart = () => {
    const options: Record<string, string> = selectedVariant 
      ? { "Phiên bản": selectedVariant.variant_name } 
      : {}
      
    const productWithVariantPrice = { ...product, price: currentPrice }
    
    addItem(productWithVariantPrice, options, quantity)
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`)
  }

  const handleBuyNow = () => {
    const options: Record<string, string> = selectedVariant 
      ? { "Phiên bản": selectedVariant.variant_name } 
      : {}
      
    const productWithVariantPrice = { ...product, price: currentPrice }
    
    addItem(productWithVariantPrice, options, quantity)
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
      {/* HIỂN THỊ GIÁ TIẾN ĐỘNG THEO VARIANT */}
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Giá bán hiện tại</span>
        <div className="text-4xl font-black text-primary drop-shadow-sm transition-all duration-300">
          {formatVND(currentPrice)}
        </div>
      </div>

      {/* KHU VỰC CHỌN BIẾN THỂ (VARIANTS) */}
      {variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Lựa chọn phiên bản
            </label>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
              {variants.length} Phiên bản có sẵn
            </span>
          </div>
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
                    
                    <div className="mt-1 text-[10px] font-bold text-muted-foreground opacity-60">
                       KHO: {variant.stock_quantity}
                    </div>
                    
                    {/* Icon Checkmark ở góc */}
                    {isSelected && (
                      <div className="absolute top-0 right-0">
                         <div className="bg-primary text-primary-foreground p-1 rounded-bl-xl shadow-sm animate-in fade-in zoom-in duration-300">
                           <Check className="h-3.5 w-3.5" strokeWidth={4} />
                         </div>
                      </div>
                    )}

                    {/* Trạng thái hết hàng cho variant */}
                    {variant.stock_quantity === 0 && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] flex flex-col items-center justify-center">
                        <Box className="h-4 w-4 text-destructive mb-1" />
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

      {/* KHU VỰC CHỌN SỐ LƯỢNG VÀ NÚT MUA */}
      <div className="space-y-6 pt-6 border-t border-dashed border-muted-foreground/20">
        <div className="flex items-center gap-6">
          <span className="font-black text-xs uppercase tracking-widest text-muted-foreground">Số lượng</span>
          <div className="flex items-center gap-1 bg-muted/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-xl hover:bg-background hover:shadow-sm" 
              onClick={handleDecrease} 
              disabled={quantity <= 1 || isOutOfStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-black text-2xl tabular-nums text-foreground">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-xl hover:bg-background hover:shadow-sm" 
              onClick={handleIncrease} 
              disabled={quantity >= currentStock || isOutOfStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col text-left">
             <span className="text-[10px] font-bold text-muted-foreground uppercase">Trạng thái kho</span>
             <span className={cn(
               "text-sm font-black transition-colors duration-300",
               isOutOfStock ? "text-destructive" : "text-green-600"
             )}>
                {isOutOfStock ? "TẠM HẾT HÀNG" : `SẴN CÓ: ${currentStock}`}
             </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button 
            onClick={handleAddToCart} 
            variant="outline"
            disabled={isOutOfStock}
            className="flex-1 h-16 text-lg font-black gap-3 border-2 border-primary text-primary hover:bg-primary/5 rounded-2xl transition-all shadow-lg shadow-primary/5 active:scale-95"
          >
            <ShoppingCart className="h-6 w-6" /> THÊM VÀO GIỎ
          </Button>
          <Button 
            onClick={handleBuyNow} 
            disabled={isOutOfStock}
            className="flex-1 h-16 text-lg font-black gap-3 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all bg-primary hover:bg-primary/90 text-primary-foreground border-none"
          >
            <CreditCard className="h-6 w-6" /> MUA NGAY
          </Button>
        </div>
      </div>
    </div>
  )
}
