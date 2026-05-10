'use client'

import { getProducts } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { ProductCard } from '@/components/shop/ProductCard'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { UserGuideSection } from '@/components/home/UserGuideSection'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Keyboard, Zap, ShieldCheck, Truck } from 'lucide-react'
import { useI18n } from '@/components/providers/I18nProvider'
import { useState, useEffect } from 'react'
import { Product } from '@/types'

export default function HomePage() {
  const { t } = useI18n()
  const [heroProducts, setHeroProducts] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const heroData = await getProducts(5)
      const productsData = await getProducts(8)
      const profileData = await getProfile()
      setHeroProducts(heroData)
      setProducts(productsData)
      setProfile(profileData)
    }
    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={profile} />
      
      {/* Hero Section Carousel */}
      <HeroCarousel products={heroProducts} />

      {/* Features Section */}
      <section className="py-12 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-background rounded-full border shadow-sm">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">{t.home.features.warranty}</h3>
              <p className="text-sm text-muted-foreground">{t.home.features.warrantyDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-background rounded-full border shadow-sm">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">{t.home.features.shipping}</h3>
              <p className="text-sm text-muted-foreground">{t.home.features.shippingDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-background rounded-full border shadow-sm">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">{t.home.features.support}</h3>
              <p className="text-sm text-muted-foreground">{t.home.features.supportDesc}</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-background rounded-full border shadow-sm">
                <Keyboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">{t.home.features.custom}</h3>
              <p className="text-sm text-muted-foreground">{t.home.features.customDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t.home.newArrivals}</h2>
              <p className="text-muted-foreground">{t.home.newArrivalsDesc}</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="hidden sm:flex">
                {t.home.viewAll} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
              <Keyboard className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-medium text-muted-foreground">{t.home.noProducts}</h3>
              <p className="text-muted-foreground mb-6">{t.home.noProductsDesc}</p>
              <Link href="/login">
                <Button variant="outline">{t.home.loginAdmin}</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* User Guide Section */}
      <UserGuideSection />
    </div>
  )
}
