'use client'

import { useEffect, useState } from 'react'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { ProductCard } from '@/components/shop/ProductCard'
import { useWishlistStore } from '@/store/wishlistStore'
import { Heart, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function WishlistPage() {
  const { items } = useWishlistStore()
  const [profile, setProfile] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const fetchProfile = async () => {
      const p = await getProfile()
      setProfile(p)
    }
    fetchProfile()
  }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="mb-8 flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sản phẩm yêu thích</h1>
            <p className="text-muted-foreground mt-1">
              Lưu giữ những mẫu bàn phím cơ và linh kiện bạn ưng ý nhất.
            </p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-2xl bg-muted/10">
            <Heart className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-2xl font-medium text-foreground mb-2">Danh sách đang trống</h3>
            <p className="text-muted-foreground mb-8 max-w-md">
              Bạn chưa lưu sản phẩm nào vào danh sách yêu thích. Hãy khám phá và nhấn icon ❤️ để lưu lại nhé!
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-5 w-5" /> Khám phá sản phẩm
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
