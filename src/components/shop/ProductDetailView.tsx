'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Product, ProductVariant } from '@/types'
import { AddToCartSection } from '@/components/shop/AddToCartSection'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ProductDetailView({ product }: { product: Product }) {
  const variants = product.product_variants || []
  
  // Quản lý trạng thái DUY NHẤT ở đây
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [mainImage, setMainImage] = useState(product.images_url?.[0] || '')

  // Khởi tạo mặc định một lần duy nhất khi product thay đổi
  useEffect(() => {
    if (variants.length > 0) {
      const defaultVariant = variants[0]
      setSelectedVariant(defaultVariant)
      if (defaultVariant.image_url) {
        setMainImage(defaultVariant.image_url)
      }
    } else {
      setMainImage(product.images_url?.[0] || '')
    }
  }, [product.id]) // Chỉ chạy lại khi đổi sản phẩm khác

  // Hàm xử lý click chọn biến thể
  const handleVariantClick = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant)
    if (variant.image_url) {
      setMainImage(variant.image_url)
    }
  }, [])

  return (
    <div className="bg-background rounded-2xl shadow-sm border p-6 md:p-10 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border shadow-inner group">
            {mainImage ? (
              <Image 
                src={mainImage} 
                alt={product.name} 
                fill 
                className="object-cover object-center transition-all duration-700 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Không có hình ảnh
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          
          {/* Gallery Thumbnails */}
          {product.images_url && product.images_url.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {product.images_url.map((img, i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => setMainImage(img)}
                  className={cn(
                    "relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                    mainImage === img ? "border-primary shadow-sm" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {product.brand}
            </span>
            {product.categories && (
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                {product.categories.name}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-foreground leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-1 rounded-md border border-yellow-400/20">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-bold text-sm">{product.average_rating}</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-muted-foreground hover:underline cursor-pointer">
              (128 đánh giá)
            </span>
          </div>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-left">
            <div className="p-4 bg-muted/30 rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-widest">Layout</p>
              <p className="font-bold">{product.layout || 'Không áp dụng'}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-2xl border border-white/5">
              <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-widest">Kết nối</p>
              <p className="font-bold">{product.connectivity || 'Không áp dụng'}</p>
            </div>
          </div>

          <Separator className="mb-6 opacity-50" />

          {/* Truyền State và hàm xử lý xuống trang con */}
          <AddToCartSection 
            product={product} 
            selectedVariant={selectedVariant}
            onVariantClick={handleVariantClick}
          />

          {/* Trust Badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-dashed pt-8">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-2 bg-green-100/50 text-green-700 rounded-full border border-green-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black text-muted-foreground uppercase">Bảo hành 24 tháng</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-2 bg-blue-100/50 text-blue-700 rounded-full border border-blue-200">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black text-muted-foreground uppercase">Giao hàng hỏa tốc</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-2 bg-orange-100/50 text-orange-700 rounded-full border border-orange-200">
                <RotateCcw className="h-5 w-5" />
              </div>
              <span className="text-[9px] font-black text-muted-foreground uppercase">Đổi trả 7 ngày</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
