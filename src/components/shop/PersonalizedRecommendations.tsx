'use client'

import { useEffect, useState } from 'react'
import { getRecentlyViewedIds } from '@/lib/utils/history'
import { getProductById } from '@/actions/products'
import { Product } from '@/types'
import { ProductCard, ProductSkeleton } from './ProductCard'
import { History, Sparkles } from 'lucide-react'

export function PersonalizedRecommendations({ currentProductId }: { currentProductId?: string }) {
  const [recommended, setRecommended] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      const ids = getRecentlyViewedIds().filter(id => id !== currentProductId).slice(0, 4)
      if (ids.length === 0) {
        setIsLoading(false)
        return
      }

      try {
        const products = await Promise.all(ids.map(id => getProductById(id)))
        setRecommended(products.filter(Boolean) as Product[])
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [currentProductId])

  if (!isLoading && recommended.length === 0) return null

  return (
    <section className="py-12 border-t border-primary/5 mt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <History size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight italic">Xem lại gần đây</h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Dựa trên lịch sử xem của bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
        ) : (
          recommended.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </section>
  )
}
