'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Timer, ArrowRight, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shop/ProductCard'
import { Product } from '@/types'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function FlashSaleSection({ products, endTime }: { products: Product[], endTime?: string }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    if (!endTime) return

    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime()
      const now = new Date().getTime()
      const diff = end - now

      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 }
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return { hours, minutes, seconds }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [endTime])

  if (!products || products.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-background border-y border-primary/10 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-24 -left-24">
            <Flame size={400} className="text-primary rotate-12" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-2 bg-primary px-6 py-3 rounded-2xl shadow-lg shadow-primary/20 rotate-[-2deg]">
              <Zap className="text-primary-foreground fill-primary-foreground h-6 w-6 animate-pulse" />
              <h2 className="text-2xl font-black uppercase tracking-tighter italic text-primary-foreground">Flash Sale</h2>
            </div>
            
            <div className="flex items-center gap-4 bg-muted/50 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-2xl">
              <Timer className="h-5 w-5 text-muted-foreground" />
              <div className="flex gap-3">
                <TimeBox value={timeLeft.hours} label="H" />
                <span className="font-black text-primary animate-pulse">:</span>
                <TimeBox value={timeLeft.minutes} label="M" />
                <span className="font-black text-primary animate-pulse">:</span>
                <TimeBox value={timeLeft.seconds} label="S" />
              </div>
            </div>
          </div>

          <Link href="/products?sale=true">
            <Button variant="ghost" className="rounded-xl font-black uppercase tracking-widest text-xs gap-2 group">
              Xem tất cả ưu đãi <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, idx) => {
            const soldCount = product.flash_sale_sold || 0
            const totalStock = product.flash_sale_stock || 1
            const soldPercent = Math.min(Math.round((soldCount / totalStock) * 100), 100)
            const remaining = Math.max(totalStock - soldCount, 0)
            
            // Override product for card display
            const displayProduct = {
                ...product,
                is_sale: true,
                sale_price: product.flash_sale_price || product.price
            }

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                  <div className="absolute top-4 left-4 z-20 bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 animate-bounce">
                      HOT DEAL
                  </div>
                  <ProductCard product={displayProduct} />
                  <div className="mt-4 px-2 space-y-3">
                      <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Đã bán</span>
                            <span className="text-lg font-black text-primary leading-none">{soldPercent}%</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase block">Chỉ còn lại</span>
                            <span className="text-xs font-black uppercase text-foreground">{remaining} sản phẩm</span>
                          </div>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden border shadow-inner p-0.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${soldPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn(
                                "h-full rounded-full relative",
                                soldPercent > 80 ? "bg-red-500" : soldPercent > 50 ? "bg-orange-500" : "bg-primary"
                            )}
                          >
                              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                          </motion.div>
                      </div>
                      {soldPercent > 90 && (
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter text-center animate-pulse">🔥 Sắp cháy hàng - Mua ngay!</p>
                      )}
                  </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function TimeBox({ value, label }: { value: number, label: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-black tracking-tighter w-8 text-center">{value.toString().padStart(2, '0')}</span>
      <span className="text-[10px] font-black text-muted-foreground opacity-50">{label}</span>
    </div>
  )
}
