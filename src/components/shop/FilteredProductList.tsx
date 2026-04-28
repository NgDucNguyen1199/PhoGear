'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import { getFilteredProducts } from '@/actions/products'
import { ProductCard } from './ProductCard'
import { Keyboard, Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export function FilteredProductList({ initialProducts }: { initialProducts: Product[] }) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)

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
      setProducts(results)
      setIsLoading(false)
    }

    // Only fetch if there are actual search params, otherwise use initial
    if (searchParams.toString()) {
      fetchFiltered()
    } else {
      setProducts(initialProducts)
    }
  }, [searchParams, initialProducts])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Đang lọc sản phẩm...</p>
      </div>
    )
  }

  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
