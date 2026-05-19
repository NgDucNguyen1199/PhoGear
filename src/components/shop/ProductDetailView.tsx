'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { Product, ProductVariant } from '@/types'
import { AddToCartSection } from '@/components/shop/AddToCartSection'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { motion } from 'framer-motion'
import { ReviewSection } from '@/components/shop/ReviewSection'

export function ProductDetailView({ product, userId }: { product: Product, userId?: string }) {
  const variants = useMemo(() => product.product_variants || [], [product.product_variants])
  
  // Combine all unique images from product and variants
  const allImages = useMemo(() => Array.from(new Set([
    ...(product.images_url || []),
    ...variants.map(v => v.image_url).filter(Boolean) as string[]
  ])), [product.images_url, variants])

  // Quản lý trạng thái
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // Cập nhật current index khi carousel scroll
  useEffect(() => {
    if (!api) return
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  // Khởi tạo mặc định và đồng bộ khi đổi sản phẩm
  useEffect(() => {
    const defaultVariant = variants.length > 0 ? variants[0] : null
    setSelectedVariant(defaultVariant)
    
    if (defaultVariant?.image_url) {
      const index = allImages.indexOf(defaultVariant.image_url)
      if (index !== -1 && api) api.scrollTo(index)
    } else if (api) {
      api.scrollTo(0)
    }
  }, [product.id, allImages, variants, api])

  // Hàm xử lý click chọn biến thể
  const handleVariantClick = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant)
    if (variant.image_url) {
      const index = allImages.indexOf(variant.image_url)
      if (index !== -1 && api) api.scrollTo(index)
    }
  }, [allImages, api])

  // Hàm xử lý click thumbnail
  const handleThumbnailClick = (index: number) => {
    if (api) api.scrollTo(index)
  }

  return (
    <div className="space-y-12">
      <div className="bg-background rounded-[2.5rem] shadow-xl border border-white/5 p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT: Product Image Gallery */}
          <div className="space-y-8">
            <Carousel setApi={setApi} className="w-full group">
              <CarouselContent className="ml-0">
                {allImages.length > 0 ? (
                  allImages.map((img, i) => (
                    <CarouselItem key={i} className="pl-0 relative aspect-square rounded-[2rem] overflow-hidden bg-muted border shadow-sm">
                      <Image 
                        src={img} 
                        alt={`${product.name} ${i + 1}`} 
                        fill 
                        className="object-cover object-center transition-all duration-700 hover:scale-110"
                        priority={i === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem className="pl-0 relative aspect-square rounded-[2rem] overflow-hidden bg-muted border shadow-sm flex items-center justify-center text-muted-foreground">
                    Không có hình ảnh
                  </CarouselItem>
                )}
              </CarouselContent>
              {allImages.length > 1 && (
                <>
                  <CarouselPrevious className="left-4 bg-background/80 hover:bg-background border-none shadow-md hidden group-hover:flex transition-all" />
                  <CarouselNext className="right-4 bg-background/80 hover:bg-background border-none shadow-md hidden group-hover:flex transition-all" />
                </>
              )}
            </Carousel>
            
            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {allImages.map((img, i) => (
                  <button 
                    key={i} 
                    type="button"
                    onClick={() => handleThumbnailClick(i)}
                    className={cn(
                      "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:ring-2 hover:ring-primary/20",
                      current === i ? "border-primary shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt={`${product.name} thumbnail ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1 rounded-lg">
                {product.brand}
              </span>
              {product.categories && (
                <Badge variant="secondary" className="bg-muted text-muted-foreground border-none font-bold uppercase tracking-widest text-[9px]">
                  {product.categories.name}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-foreground leading-[1.1] uppercase italic">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-10">
              <div className="flex items-center gap-2 bg-yellow-400/10 text-yellow-600 px-3 py-1.5 rounded-xl border border-yellow-400/20">
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                <span className="font-black text-lg leading-none">{product.average_rating}</span>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground leading-none">Phản hồi</span>
                <span className="text-sm font-bold text-foreground">({product.review_count || 0} đánh giá khách hàng)</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-10 leading-relaxed font-medium text-lg">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10 text-sm text-left">
              <div className="p-6 bg-muted/20 rounded-3xl border border-white/5 shadow-inner">
                <p className="text-[10px] uppercase font-black text-muted-foreground mb-2 tracking-widest opacity-50">
                    {product.categories?.name === 'Keycap' ? 'Profile' : 'Layout Phím'}
                </p>
                <p className="font-black text-lg italic">{product.layout || (product.categories?.name === 'Keycap' ? 'Cherry' : 'Mặc định')}</p>
              </div>
              <div className="p-6 bg-muted/20 rounded-3xl border border-white/5 shadow-inner">
                <p className="text-[10px] uppercase font-black text-muted-foreground mb-2 tracking-widest opacity-50">
                    {product.categories?.name === 'Keycap' ? 'Chất liệu' : 'Phương thức Kết nối'}
                </p>
                <p className="font-black text-lg italic">
                    {product.connectivity || (product.categories?.name === 'Keycap' ? 'Nhựa PBT' : 'Có dây')}
                </p>
              </div>
            </div>

            <AddToCartSection 
              product={product} 
              selectedVariant={selectedVariant}
              onVariantClick={handleVariantClick}
            />

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-10 border-t border-dashed border-primary/10">
              <BadgeItem icon={<ShieldCheck size={20} />} label="Bảo hành 24 tháng" />
              <BadgeItem icon={<Truck size={20} />} label="Giao hàng hỏa tốc" />
              <BadgeItem icon={<RotateCcw size={20} />} label="Đổi trả 7 ngày" />
            </div>
          </div>
        </div>
      </div>

      {/* FULL WIDTH: Dedicated Gallery for Reference */}
      {allImages.length > 1 && (
        <section className="space-y-12 py-12">
            <div className="flex flex-col items-center text-center space-y-4">
                <Badge className="bg-primary text-primary-foreground border-none font-black uppercase tracking-[0.3em] px-4 py-1">Góc nhìn chi tiết</Badge>
                <h2 className="text-5xl font-black uppercase tracking-tighter italic text-primary">Hình ảnh thực tế</h2>
                <p className="text-muted-foreground font-medium max-w-2xl text-lg">
                    Cận cảnh sản phẩm giúp bạn có cái nhìn khách quan nhất về màu sắc và chất liệu thực tế.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {allImages.map((img, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-background"
                    >
                        <Image 
                            src={img} 
                            alt={`${product.name} detail ${i + 1}`} 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                ))}
            </div>
        </section>
      )}

      {/* REVIEWS SECTION */}
      <div className="pt-12">
        <ReviewSection product={product} userId={userId} />
      </div>
    </div>
  )
}

function BadgeItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 group">
      <div className="p-3 bg-primary/5 text-primary rounded-2xl border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 scale-110">
        {icon}
      </div>
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">{label}</span>
    </div>
  )
}
