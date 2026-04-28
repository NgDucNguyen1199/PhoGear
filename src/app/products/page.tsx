import { getProducts, getCategories } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { ProductFilters } from '@/components/shop/ProductFilters'
import { FilteredProductList } from '@/components/shop/FilteredProductList'
import { Suspense } from 'react'

export const metadata = {
  title: 'Tất cả sản phẩm | Pho Gear',
  description: 'Khám phá tất cả các sản phẩm bàn phím cơ, keycap, switch và phụ kiện chính hãng tại Pho Gear.',
}

export default async function ProductsPage() {
  const products = await getProducts(100) || []
  const profile = await getProfile()
  const categories = await getCategories() || []

  // Extract unique filter options from existing products
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[]
  const layouts = Array.from(new Set(products.map(p => p.layout).filter(Boolean))) as string[]
  const connectivities = Array.from(new Set(products.map(p => p.connectivity).filter(Boolean))) as string[]

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">Tất cả sản phẩm</h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Khám phá bộ sưu tập bàn phím cơ và phụ kiện cao cấp của chúng tôi.
            </p>
          </div>
          <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground bg-background px-4 py-2 rounded-full border shadow-sm">
            {products.length} sản phẩm có sẵn
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filter */}
          <aside className="lg:col-span-3">
            <ProductFilters 
              categories={categories} 
              brands={brands} 
              layouts={layouts} 
              connectivities={connectivities} 
            />
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[400px] bg-muted animate-pulse rounded-[2.5rem]" />
                ))}
              </div>
            }>
              <FilteredProductList initialProducts={products} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
