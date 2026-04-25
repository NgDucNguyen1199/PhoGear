'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Heart, Eye } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
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

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-2xl relative border-white/5 bg-background/50 backdrop-blur-sm flex flex-col h-full">
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 z-10 bg-background/80 backdrop-blur-md rounded-full hover:bg-background h-10 w-10 border border-white/5 shadow-md transition-transform active:scale-90"
        onClick={handleToggleWishlist}
      >
        <Heart className={`h-5 w-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
      </Button>
      
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images_url?.[0] ? (
            <Image
              src={product.images_url[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center pointer-events-none">
            <div className="bg-background text-foreground px-6 py-2.5 rounded-full text-xs font-black flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-xl border border-white/10">
              <Eye className="h-4 w-4" /> XEM CHI TIẾT
            </div>
          </div>

          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
              <Badge variant="destructive" className="text-xs font-black uppercase tracking-tighter">Tạm hết hàng</Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-5 space-y-3 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-muted/5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] opacity-80">{product.brand}</p>
              <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span className="text-[10px] font-black text-yellow-700">{product.average_rating}</span>
              </div>
            </div>
            
            <h3 className="font-bold text-base line-clamp-2 group-hover:text-primary transition-colors tracking-tight leading-snug">
              {product.name}
            </h3>
          </div>

          <div className="pt-2">
            <p className="text-xl font-black text-foreground drop-shadow-sm tracking-tighter">
              {formattedPrice}
            </p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1 opacity-50">
               Click để xem các tùy chọn màu sắc
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
