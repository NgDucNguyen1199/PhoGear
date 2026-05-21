'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useRealtimeProduct } from '@/lib/supabase/realtime'

export function ProductSkeleton() {
  return (
    <Card className="overflow-hidden border-white/5 bg-background/50 backdrop-blur-sm flex flex-col h-full rounded-[2rem]">
      <div className="relative aspect-square bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>
        <div className="pt-2 space-y-2">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductCard({ product: initialProduct, isGlobalSaleActive = true }: { product: Product, isGlobalSaleActive?: boolean }) {
  const router = useRouter()
  const product = useRealtimeProduct(initialProduct)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const isLiked = isInWishlist(product.id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleItem(product)
    if (!isLiked) {
      toast.success(`Đã thêm ${product.name} vào danh sách yêu thích`)
    }
  }

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price)

  // Chỉ hiển thị giá sale nếu cả sản phẩm VÀ hệ thống đều đang trong đợt sale
  const showSalePrice = isGlobalSaleActive && product.is_sale && product.sale_price

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-2xl relative border-white/5 bg-background/50 backdrop-blur-sm flex flex-col h-full active:scale-[0.98] sm:active:scale-100">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10 bg-background/80 backdrop-blur-md rounded-full hover:bg-background h-8 w-8 sm:h-10 sm:w-10 border border-white/5 shadow-md transition-transform active:scale-90"
        onClick={handleToggleWishlist}
      >
        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
      </Button>
      
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images_url?.[0] ? (
            <Image
              src={product.images_url[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-[10px] sm:text-xs">
              No Image
            </div>
          )}
          
          {/* Quick View Overlay - Hidden on mobile, shown on hover for desktop */}
          <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
            {product.stock_quantity === 0 ? (
              <div className="bg-destructive text-destructive-foreground px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-xl border border-white/10">
                ĐÃ HẾT HÀNG
              </div>
            ) : (
              <div className="bg-background text-foreground px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-black flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-xl border border-white/10">
                <Eye className="h-4 w-4" /> XEM CHI TIẾT
              </div>
            )}
          </div>

          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
              <Badge variant="destructive" className="text-[8px] sm:text-xs font-black uppercase tracking-tighter">Tạm hết hàng</Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-3 sm:p-5 space-y-2 sm:space-y-3 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-muted/5">
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em] sm:tracking-[0.25em] opacity-80">{product.brand}</p>
              <div className="flex items-center gap-1 bg-yellow-400/10 px-1.5 sm:px-2 py-0.5 rounded-full border border-yellow-400/20">
                <Star className="h-2 w-2 sm:h-3 sm:w-3 fill-yellow-500 text-yellow-500" />
                <span className="text-[8px] sm:text-[10px] font-black text-yellow-700">{product.average_rating}</span>
              </div>
            </div>
            
            <h3 className="font-bold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors tracking-tight leading-snug">
              {product.name}
            </h3>
          </div>

          <div className="pt-1 sm:pt-2">
            {showSalePrice ? (
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                    <p className="text-base sm:text-xl font-black text-primary drop-shadow-sm tracking-tighter">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.sale_price as number)}
                    </p>
                    <p className="text-[10px] sm:text-xs font-bold text-muted-foreground line-through opacity-50">
                        {formattedPrice}
                    </p>
                </div>
              </div>
            ) : (
              <p className="text-base sm:text-xl font-black text-foreground drop-shadow-sm tracking-tighter">
                {formattedPrice}
              </p>
            )}
            <p className="text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase mt-1 opacity-50 hidden sm:block">
               Click để xem các tùy chọn màu sắc
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
