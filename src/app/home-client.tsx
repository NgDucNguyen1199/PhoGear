'use client'

import { Navbar } from '@/components/layout/Navbar'
import { ProductCard, ProductSkeleton } from '@/components/shop/ProductCard'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { KeyboardFinder } from '@/components/shop/KeyboardFinder'
import { FlashSaleSection } from '@/components/home/FlashSaleSection'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { ForumFeed } from '@/components/home/ForumFeed'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Keyboard, Zap, ShieldCheck, Truck, Search, Star, Award } from 'lucide-react'
import { useI18n } from '@/components/providers/I18nProvider'
import { useState, useEffect, ReactNode } from 'react'
import { Product, Category } from '@/types'

interface HomePageClientProps {
  initialHeroProducts: Product[]
  initialNewProducts: Product[]
  initialFlashSaleProducts: Product[]
  initialBestSellers: Product[]
  initialCategories: Category[]
  initialProfile: any
  initialSettings: any
}

export default function HomePageClient({
  initialHeroProducts,
  initialNewProducts,
  initialFlashSaleProducts,
  initialBestSellers,
  initialCategories,
  initialProfile,
  initialSettings
}: HomePageClientProps) {
  const { t } = useI18n()
  const [heroProducts] = useState<Product[]>(initialHeroProducts)
  const [newProducts] = useState<Product[]>(initialNewProducts)
  const [flashSaleProducts] = useState<Product[]>(initialFlashSaleProducts)
  const [bestSellers] = useState<Product[]>(initialBestSellers)
  const [categories] = useState<Category[]>(initialCategories)
  const [profile] = useState<any>(initialProfile)
  const [settings] = useState<any>(initialSettings)
  const [isGlobalSaleActive, setIsGlobalSaleActive] = useState(false)
  const [isLoading] = useState(false)

  // Update sale status in real-time
  useEffect(() => {
    if (!settings?.flash_sale_end_time) return

    const checkSaleActive = () => {
        const active = new Date(settings.flash_sale_end_time) > new Date() && settings.flash_sale_enabled
        setIsGlobalSaleActive(active)
    }
    
    checkSaleActive()
    const interval = setInterval(checkSaleActive, 1000)

    return () => clearInterval(interval)
  }, [settings])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={profile} />
      
      {/* Hero Section Carousel */}
      <HeroCarousel products={heroProducts} />

      {/* Features Section */}
      <section className="py-6 sm:py-10 border-b bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <FeatureItem icon={<ShieldCheck size={20} className="sm:w-6 sm:h-6" />} title={t.home.features.warranty} desc={t.home.features.warrantyDesc} />
            <FeatureItem icon={<Truck size={20} className="sm:w-6 sm:h-6" />} title={t.home.features.shipping} desc={t.home.features.shippingDesc} />
            <FeatureItem icon={<Zap size={20} className="sm:w-6 sm:h-6" />} title={t.home.features.support} desc={t.home.features.supportDesc} />
            <FeatureItem icon={<Keyboard size={20} className="sm:w-6 sm:h-6" />} title={t.home.features.custom} desc={t.home.features.customDesc} />
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      {isGlobalSaleActive && flashSaleProducts.length > 0 && (
        <FlashSaleSection 
          products={flashSaleProducts} 
          endTime={settings.flash_sale_end_time}
        />
      )}

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* New Arrivals Section */}
      <section className="py-12 sm:py-24 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 sm:mb-16 gap-6">
            <div className="text-center md:text-left">
              <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-3 sm:px-4 py-1 mb-4 text-[10px] sm:text-xs">Mới cập nhật</Badge>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic leading-tight sm:leading-none">{t.home.newArrivals}</h2>
              <p className="text-sm sm:text-base text-muted-foreground font-medium mt-3 sm:mt-4 max-w-xl">{t.home.newArrivalsDesc}</p>
            </div>
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs gap-3 px-8 shadow-xl shadow-primary/10 hover:scale-105 transition-all h-12 sm:h-14">
                {t.home.viewAll} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : newProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
              {newProducts.map((product) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    isGlobalSaleActive={isGlobalSaleActive}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center border-4 border-dashed rounded-[2rem] sm:rounded-[3rem] bg-muted/5 px-4">
              <Keyboard className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-6 opacity-10" />
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight italic">{t.home.noProducts}</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 font-medium">{t.home.noProductsDesc}</p>
              <Link href="/login">
                <Button variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px]">{t.home.loginAdmin}</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-12 sm:py-24 bg-background overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center mb-10 sm:mb-16 space-y-3 sm:space-y-4">
                <div className="inline-flex p-2.5 sm:p-3 rounded-2xl bg-yellow-500/10 text-yellow-600 mb-2">
                    <Award size={24} className="sm:w-8 sm:h-8" />
                </div>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic">Sản phẩm Bán chạy</h2>
                <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-lg">Những mẫu bàn phím được cộng đồng săn đón và tin dùng nhiều nhất tại Pho Gear.</p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
                {[...Array(4)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
                  {bestSellers.map((product, idx) => (
                    <div key={product.id} className="relative">
                      <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 z-20 bg-yellow-500 text-white p-1.5 sm:p-2 rounded-full shadow-xl shadow-yellow-500/20 rotate-12 scale-75 sm:scale-100">
                        <Star size={12} className="sm:w-4 sm:h-4" fill="white" />
                      </div>
                      <ProductCard 
                          product={product} 
                          isGlobalSaleActive={isGlobalSaleActive}
                      />
                    </div>
                  ))}
              </div>
            )}
        </div>
      </section>

      {/* Keyboard Finder Section */}
      <section className="py-16 sm:py-32 bg-primary/[0.04] border-y border-primary/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 sm:p-24 opacity-[0.03] pointer-events-none">
            <Search size={300} className="sm:w-[600px] sm:h-[600px] text-primary rotate-12" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-10 sm:mb-16">
                <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] px-3 sm:px-4 py-1 mb-4 text-[10px] sm:text-xs">Gợi ý thông minh</Badge>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic leading-tight sm:leading-none">Cá nhân hóa lựa chọn</h2>
            </div>
            <KeyboardFinder categories={categories} />
        </div>
      </section>

      {/* Knowledge Hub (Forum Feed) */}
      <ForumFeed userId={profile?.id} />
    </div>
  )
}

function FeatureItem({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="p-4 bg-background rounded-2xl border-2 border-primary/5 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-500">
        {icon}
      </div>
      <div>
        <h3 className="font-black uppercase tracking-tight text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
