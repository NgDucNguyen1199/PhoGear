'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const isLiked = isInWishlist(product.id)

  // Kiểm tra xem sản phẩm có tùy chọn không
  const hasOptions = product.options && product.options.length > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Nếu có tùy chọn, dẫn vào trang chi tiết để chọn
    if (hasOptions) {
      router.push(`/products/${product.id}`)
      return
    }

    // Nếu không có tùy chọn, thêm thẳng vào giỏ
    addItem(product)
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
  }

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
    <Card className="group overflow-hidden transition-all hover:shadow-xl relative border-white/5 bg-background/50 backdrop-blur-sm">
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 bg-background/80 backdrop-blur-md rounded-full hover:bg-background h-9 w-9 border border-white/5 shadow-sm"
        onClick={handleToggleWishlist}
      >
        <Heart className={`h-5 w-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
      </Button>
      
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images_url?.[0] ? (
            <Image
              src={product.images_url[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <div className="bg-background text-foreground px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <Eye className="h-3.5 w-3.5" /> XEM CHI TIẾT
            </div>
          </div>

          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
              <Badge variant="destructive" className="text-sm font-bold">Hết hàng</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.brand}</p>
          <div className="flex items-center gap-1 bg-yellow-400/10 px-1.5 py-0.5 rounded">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="text-[10px] font-bold text-yellow-700">{product.average_rating}</span>
          </div>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-lg font-black text-foreground">{formattedPrice}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className={cn(
            "w-full gap-2 font-bold h-11 transition-all rounded-xl",
            hasOptions ? "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground" : ""
          )} 
          disabled={product.stock_quantity === 0}
          onClick={handleAddToCart}
        >
          {hasOptions ? (
            <>
              <Eye className="h-4 w-4" />
              XEM TÙY CHỌN
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              THÊM VÀO GIỎ
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
