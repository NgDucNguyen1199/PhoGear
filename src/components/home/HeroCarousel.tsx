'use client'

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingCart, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types"

export function HeroCarousel({ products }: { products: Product[] }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  // Plugin tự động chuyển slide sau mỗi 5 giây (5000ms)
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (!products || products.length === 0) return null

  return (
    <section className="relative w-full bg-background overflow-hidden border-b">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
          align: "start",
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-0">
          {products.map((product, index) => (
            <CarouselItem key={product.id} className="pl-0 basis-full">
              <div className="group relative h-[60vh] md:h-[80vh] w-full flex flex-col md:flex-row bg-muted/20">
                
                {/* Text Content (40%) */}
                <div className="w-full md:w-2/5 flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 z-20 order-2 md:order-1 bg-background/80 backdrop-blur-sm md:bg-transparent">
                  <AnimatePresence mode="wait">
                    {current === index && (
                      <motion.div
                        key={`text-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                      >
                        <div className="flex gap-2 items-center">
                          {index === 0 ? (
                            <Badge className="bg-[#ff4500] hover:bg-[#ff4500]/90 text-white font-bold border-none uppercase tracking-widest px-3 py-1">
                              HOT DEAL <Zap className="w-3 h-3 ml-1" />
                            </Badge>
                          ) : (
                            <Badge className="bg-[#00ff00] hover:bg-[#00ff00]/90 text-black font-bold border-none uppercase tracking-widest px-3 py-1">
                              MỚI VỀ
                            </Badge>
                          )}
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {product.brand}
                          </span>
                        </div>
                        
                        <Link href={`/products/${product.id}`} className="inline-block hover:text-primary transition-colors" aria-label={`Xem chi tiết sản phẩm ${product.name}`}>
                          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight text-foreground hover:underline">
                            {product.name}
                          </h1>
                        </Link>
                        
                        <p className="text-lg text-muted-foreground line-clamp-3">
                          {product.description || "Nâng tầm trải nghiệm gõ phím với thiết kế tinh tế và chất lượng hoàn thiện cao cấp nhất. Sở hữu ngay hôm nay."}
                        </p>
                        
                        <div className="text-3xl font-black text-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                          <Link href={`/products/${product.id}`} aria-label={`Mua ngay ${product.name}`}>
                            <Button size="lg" className="font-bold gap-2">
                              <ShoppingCart className="w-5 h-5" /> Mua Ngay
                            </Button>
                          </Link>
                          <Link href={`/products`} aria-label="Khám phá tất cả sản phẩm">
                            <Button size="lg" variant="outline" className="font-bold">
                              Khám Phá <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Image Content (60%) */}
                <Link 
                  href={`/products/${product.id}`}
                  aria-label={`Xem chi tiết sản phẩm ${product.name}`}
                  className="w-full md:w-3/5 h-64 md:h-full relative order-1 md:order-2 overflow-hidden cursor-pointer block z-10"
                >
                  <AnimatePresence mode="wait">
                    {current === index && (
                      <motion.div
                        key={`img-${index}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                        {product.images_url?.[0] ? (
                          <Image
                            src={product.images_url[0]}
                            alt={product.name}
                            fill
                            className="object-cover object-center transition-all duration-700 group-hover:scale-105 group-hover:brightness-90"
                            priority={index === 0}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-muted to-muted/50 flex items-center justify-center transition-all duration-700 group-hover:brightness-90">
                            <span className="text-muted-foreground font-bold text-2xl opacity-20">NO IMAGE</span>
                          </div>
                        )}
                        {/* Overlay gradient blend from text to image */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent w-1/3 hidden md:block pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent h-1/3 bottom-0 md:hidden pointer-events-none" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="absolute bottom-8 right-8 flex gap-2 z-20">
          <CarouselPrevious className="relative static translate-y-0 translate-x-0 left-0 right-0 h-12 w-12 border-2 bg-background/50 backdrop-blur-md hover:bg-background" />
          <CarouselNext className="relative static translate-y-0 translate-x-0 left-0 right-0 h-12 w-12 border-2 bg-background/50 backdrop-blur-md hover:bg-background" />
        </div>

        {/* Carousel Dots / Pagination */}
        <div className="absolute bottom-8 left-8 md:left-16 flex gap-2 z-20">
          {products.map((_, i) => (
            <button
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  )
}
