'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import { getFilteredProducts } from '@/actions/products'
import { ProductCard, ProductSkeleton } from './ProductCard'
import { Keyboard, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useRealtimeProducts } from '@/lib/supabase/realtime'

import { getSystemSettings } from '@/actions/admin_settings'

export function FilteredProductList({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams()
  const [baseProducts, setBaseProducts] = useState<Product[]>(initialProducts)
  const products = useRealtimeProducts(baseProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [isGlobalSaleActive, setIsGlobalSaleActive] = useState(false)

  useEffect(() => {
    const checkSale = async () => {
      const settings = await getSystemSettings()
      if (settings?.flash_sale_enabled && settings?.flash_sale_end_time) {
        setIsGlobalSaleActive(new Date(settings.flash_sale_end_time) > new Date())
      }
    }
    checkSale()
  }, [])

  useEffect(() => {
    const fetchFiltered = async () => {
      setIsLoading(true)
      const filters = {
        category: searchParams.get('category') || undefined,
        brand: searchParams.get('brand') || undefined,
        minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
        maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
        layout: searchParams.get('layout') || undefined,
        connectivity: searchParams.get('connectivity') || undefined,
        sort: searchParams.get('sort') || undefined,
      }
      
      const results = await getFilteredProducts(filters)
      setBaseProducts(results)
      setIsLoading(false)
    }

    // Only fetch if there are actual search params, otherwise use initial
    if (searchParams.toString()) {
      fetchFiltered()
    } else {
      setBaseProducts(initialProducts)
    }
  }, [searchParams, initialProducts])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isGlobalSaleActive={isGlobalSaleActive}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-[2.5rem] bg-muted/10">
          <Keyboard className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
          <h3 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác nhé!
          </p>
        </div>
      )}
    </>
  )
}
