import { searchProducts } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { ProductCard } from '@/components/shop/ProductCard'
import { Keyboard, SearchX } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Kết quả tìm kiếm | Pho Gear',
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>
}) {
  const { q } = await searchParams
  const query = q || ''
  const products = query ? await searchProducts(query) : []
  const profile = await getProfile()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Kết quả tìm kiếm</h1>
          <p className="text-muted-foreground mt-2">
            Tìm thấy <strong>{products.length}</strong> kết quả cho từ khóa "{query}"
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/10">
            <SearchX className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
            <h3 className="text-2xl font-medium text-foreground mb-2">Không tìm thấy sản phẩm nào</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Rất tiếc, chúng tôi không tìm thấy kết quả nào phù hợp với từ khóa <strong>"{query}"</strong>. 
              Vui lòng thử lại bằng từ khóa khác (ví dụ: Keychron, Mạch xuôi, Keycap PBT...).
            </p>
            <Link href="/products">
              <Button size="lg">Xem tất cả sản phẩm</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
