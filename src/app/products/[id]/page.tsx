import { getProductById } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { ProductDetailView } from '@/components/shop/ProductDetailView'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// Tối ưu SEO cho từng sản phẩm cụ thể
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)
  
  if (!product) return { title: 'Sản phẩm không tồn tại' }

  return {
    title: `${product.name} | Pho Gear`,
    description: product.description || `Mua ${product.name} chính hãng tại Pho Gear.`,
    openGraph: {
      images: product.images_url?.[0] ? [product.images_url[0]] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  const profile = await getProfile()

  if (!product) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Navbar user={profile} />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors flex items-center">
            <Home className="h-4 w-4 mr-1" /> Trang chủ
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/products" className="hover:text-primary transition-colors">
            Sản phẩm
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Cấu trúc hiển thị chi tiết sản phẩm (Client Component) */}
        <ProductDetailView product={product} />
      </main>
    </div>
  )
}
