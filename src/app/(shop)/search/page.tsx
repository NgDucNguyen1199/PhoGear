import { searchProducts, getCategories, getProducts } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { ProductCard } from '@/components/shop/ProductCard'
import { SearchX, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductFilters } from '@/components/shop/ProductFilters'
import { FilterDrawer } from '@/components/shop/FilterDrawer'

export const metadata = {
  title: 'Kết quả tìm kiếm | Pho Gear',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    q: string, 
    category?: string, 
    brand?: string, 
    minPrice?: string, 
    maxPrice?: string,
    sort?: string 
  }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const profile = await getProfile()
  
  const filters = {
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    sort: params.sort,
  }

  const [products, categories, allProducts] = await Promise.all([
    searchProducts(query, filters),
    getCategories(),
    getProducts(200) // For getting filter options
  ])

  // Extract unique filter options
  const brands = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean))) as string[]
  const layouts = Array.from(new Set(allProducts.map(p => p.layout).filter(Boolean))) as string[]
  const connectivities = Array.from(new Set(allProducts.map(p => p.connectivity).filter(Boolean))) as string[]

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-10">
            <div>
                <h1 className="text-5xl font-black uppercase tracking-tighter italic">Tìm kiếm</h1>
                <p className="text-muted-foreground mt-2 font-medium">
                    Tìm thấy <span className="text-primary font-black">{products.length}</span> kết quả cho <span className="italic text-foreground">"{query}"</span>
                </p>
            </div>

            <div className="md:hidden w-full">
                <FilterDrawer 
                    categories={categories}
                    brands={brands}
                    layouts={layouts}
                    connectivities={connectivities}
                    isSearch
                />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Desktop Side Filters */}
            <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-8 bg-background p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest">Bộ lọc nâng cao</span>
                </div>
                <ProductFilters 
                    categories={categories}
                    brands={brands}
                    layouts={layouts}
                    connectivities={connectivities}
                    isSearch
                />
            </aside>

            {/* Results Grid */}
            <div className="lg:col-span-9">
                {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center border-4 border-dashed rounded-[3rem] bg-muted/5">
                    <div className="p-8 rounded-full bg-muted/20 mb-6">
                        <SearchX className="h-16 w-16 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight italic mb-4">Không tìm thấy sản phẩm nào</h3>
                    <p className="text-muted-foreground mb-10 max-w-md font-medium leading-relaxed">
                        Rất tiếc, chúng tôi không tìm thấy kết quả nào phù hợp với từ khóa <strong className="text-foreground">"{query}"</strong> và các bộ lọc hiện tại.
                    </p>
                    <Link href="/products">
                        <Button size="lg" className="rounded-2xl font-black uppercase tracking-widest text-xs px-10 h-14 shadow-xl shadow-primary/10 hover:scale-105 transition-all">
                            Xem tất cả sản phẩm
                        </Button>
                    </Link>
                </div>
                )}
            </div>
        </div>
      </main>
    </div>
  )
}
