import { getProducts, getCategories } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { ProductCard } from '@/components/shop/ProductCard'
import { Keyboard } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Tất cả sản phẩm | Pho Gear',
  description: 'Khám phá tất cả các sản phẩm bàn phím cơ, keycap, switch và phụ kiện chính hãng tại Pho Gear.',
}

export default async function ProductsPage() {
  // Lấy một số lượng lớn sản phẩm (ví dụ: 100) để hiển thị tất cả
  const products = await getProducts(100) || []
  const profile = await getProfile()
  const categories = await getCategories() || []

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground mt-2">
            Khám phá bộ sưu tập bàn phím cơ và phụ kiện cao cấp của chúng tôi.
          </p>
        </div>

        {/* Filters (đơn giản, có thể phát triển thêm sau) */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/products">
            <Button variant="default" size="sm" className="rounded-full">
              Tất cả
            </Button>
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/search?q=${category.name}`}>
              <Button variant="outline" size="sm" className="rounded-full">
                {category.name}
              </Button>
            </Link>
          ))}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/10">
            <Keyboard className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
            <h3 className="text-2xl font-medium text-foreground mb-2">Chưa có sản phẩm nào</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Cửa hàng hiện đang cập nhật sản phẩm. Vui lòng quay lại sau!
            </p>
            <Link href="/">
              <Button size="lg">Về trang chủ</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
