'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
  }

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price)

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images_url?.[0] ? (
            <Image
              src={product.images_url[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
              <Badge variant="destructive" className="text-sm">Hết hàng</Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</p>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{product.average_rating}</span>
          </div>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-xl font-bold text-primary">{formattedPrice}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full gap-2" 
          disabled={product.stock_quantity === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          Thêm vào giỏ
        </Button>
      </CardFooter>
    </Card>
  )
}
