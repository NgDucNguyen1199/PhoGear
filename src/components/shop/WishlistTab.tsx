'use client'

import { useWishlistStore } from '@/store/wishlistStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'

export function WishlistTab() {
  const { items, removeItem } = useWishlistStore()
  const addItemToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: any) => {
    addItemToCart(product)
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Heart className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <p className="text-lg font-bold mb-2">Danh sách yêu thích trống</p>
        <p className="text-muted-foreground mb-6 max-w-sm">Hãy thêm những sản phẩm bạn yêu thích để theo dõi chúng dễ dàng hơn.</p>
        <Link href="/products" className="bg-primary text-primary-foreground h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center">
          Khám phá sản phẩm
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((product) => (
        <Card key={product.id} className="border-none shadow-md rounded-3xl overflow-hidden bg-background group hover:shadow-xl transition-all duration-300">
          <div className="aspect-square relative overflow-hidden bg-muted">
            {product.images_url?.[0] ? (
              <Image 
                src={product.images_url[0]} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="text-muted-foreground opacity-20" size={48} />
              </div>
            )}
            <button 
              onClick={() => removeItem(product.id)}
              className="absolute top-4 right-4 h-10 w-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <CardContent className="p-5 space-y-4">
            <div>
              <Link href={`/products/${product.id}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </Link>
              <p className="text-primary font-black text-xl mt-1">
                {Number(product.price).toLocaleString('vi-VN')}đ
              </p>
            </div>
            <Button 
              onClick={() => handleAddToCart(product)}
              className="w-full rounded-xl font-bold uppercase tracking-widest text-[10px] h-10 gap-2"
            >
              <ShoppingCart size={14} /> Thêm vào giỏ
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
