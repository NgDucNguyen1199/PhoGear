'use client'

import { getProducts, getCategories, getFlashSaleProducts } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { getSystemSettings } from '@/actions/admin_settings'
import { Navbar } from '@/components/layout/Navbar'
import { ProductCard } from '@/components/shop/ProductCard'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { UserGuideSection } from '@/components/home/UserGuideSection'
import { KeyboardFinder } from '@/components/shop/KeyboardFinder'
import { FlashSaleSection } from '@/components/home/FlashSaleSection'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { BlogFeed } from '@/components/home/BlogFeed'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Keyboard, Zap, ShieldCheck, Truck, Search, Star, Award } from 'lucide-react'
import { useI18n } from '@/components/providers/I18nProvider'
import { useState, useEffect, ReactNode } from 'react'
import { Product, Category } from '@/types'
import { motion } from 'framer-motion'

export default function HomePage() {
  const { t } = useI18n()
  const [heroProducts, setHeroProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [heroData, allProducts, flashData, categoriesData, profileData, settingsData] = await Promise.all([
        getProducts(5),
        getProducts(16),
        getFlashSaleProducts(),
        getCategories(),
        getProfile(),
        getSystemSettings()
      ])
      
      setHeroProducts(heroData || [])
      setNewProducts(allProducts?.slice(0, 8) || [])
      setFlashSaleProducts(flashData || [])
      setBestSellers(allProducts?.slice(8, 12) || [])
      setCategories(categoriesData || [])
      setProfile(profileData)
      setSettings(settingsData)
    }
    fetchData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={profile} />
      
      {/* Hero Section Carousel */}
      <HeroCarousel products={heroProducts} />

      {/* Features Section */}
      <section className="py-10 border-b bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <FeatureItem icon={<ShieldCheck size={24} />} title={t.home.features.warranty} desc={t.home.features.warrantyDesc} />
            <FeatureItem icon={<Truck size={24} />} title={t.home.features.shipping} desc={t.home.features.shippingDesc} />
            <FeatureItem icon={<Zap size={24} />} title={t.home.features.support} desc={t.home.features.supportDesc} />
            <FeatureItem icon={<Keyboard size={24} />} title={t.home.features.custom} desc={t.home.features.customDesc} />
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      {settings?.flash_sale_enabled && flashSaleProducts.length > 0 && (
        <FlashSaleSection 
          products={flashSaleProducts} 
          endTime={settings.flash_sale_end_time}
        />
      )}

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* New Arrivals Section */}
      <section className="py-24 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div className="text-center md:text-left">
              <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.3em] px-4 py-1 mb-4">Mới cập nhật</Badge>
              <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">{t.home.newArrivals}</h2>
              <p className="text-muted-foreground font-medium mt-4 max-w-xl">{t.home.newArrivalsDesc}</p>
            </div>
            <Link href="/products">
              <Button size="lg" className="rounded-2xl font-black uppercase tracking-widest text-xs gap-3 px-8 shadow-xl shadow-primary/10 hover:scale-105 transition-all">
                {t.home.viewAll} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {newProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border-4 border-dashed rounded-[3rem] bg-muted/5">
              <Keyboard className="h-16 w-16 text-muted-foreground mb-6 opacity-10" />
              <h3 className="text-2xl font-black uppercase tracking-tight italic">{t.home.noProducts}</h3>
              <p className="text-muted-foreground mb-8 font-medium">{t.home.noProductsDesc}</p>
              <Link href="/login">
                <Button variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px]">{t.home.loginAdmin}</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-24 bg-background overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
                <div className="inline-flex p-3 rounded-2xl bg-yellow-500/10 text-yellow-600 mb-2">
                    <Award size={32} />
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter italic">Sản phẩm Bán chạy</h2>
                <p className="text-muted-foreground font-medium max-w-lg">Những mẫu bàn phím được cộng đồng săn đón và tin dùng nhiều nhất tại Pho Gear.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {bestSellers.map((product, idx) => (
                  <div key={product.id} className="relative">
                    <div className="absolute -top-4 -right-4 z-20 bg-yellow-500 text-white p-2 rounded-full shadow-xl shadow-yellow-500/20 rotate-12">
                      <Star size={16} fill="white" />
                    </div>
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
        </div>
      </section>

      {/* Keyboard Finder Section */}
      <section className="py-32 bg-primary/[0.04] border-y border-primary/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none">
            <Search size={600} className="text-primary rotate-12" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.3em] px-4 py-1 mb-4">Gợi ý thông minh</Badge>
                <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Cá nhân hóa lựa chọn</h2>
            </div>
            <KeyboardFinder categories={categories} />
        </div>
      </section>

      {/* Knowledge Hub (Blog Feed) */}
      <BlogFeed />

      {/* User Guide Section (Manuals) */}
      <UserGuideSection />
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
