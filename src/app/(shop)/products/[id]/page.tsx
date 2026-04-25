import { getProductById } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { AddToCartSection } from '@/components/shop/AddToCartSection'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, ChevronRight, Home, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import Image from 'next/image'
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

        <div className="bg-background rounded-2xl shadow-sm border p-6 md:p-10 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Product Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border">
                {product.images_url?.[0] ? (
                  <Image 
                    src={product.images_url[0]} 
                    alt={product.name} 
                    fill 
                    className="object-cover object-center"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Không có hình ảnh
                  </div>
                )}
              </div>
              {/* Optional: Add thumbnails here if you have multiple images */}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {product.brand}
                </span>
                {product.categories && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                    {product.categories.name}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-foreground">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 px-2 py-1 rounded-md">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-sm">{product.average_rating}</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <span className="text-sm text-muted-foreground hover:underline cursor-pointer">
                  (128 đánh giá)
                </span>
              </div>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-muted-foreground mb-1">Layout</p>
                  <p className="font-semibold">{product.layout || 'Không áp dụng'}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <p className="text-muted-foreground mb-1">Kết nối</p>
                  <p className="font-semibold">{product.connectivity || 'Không áp dụng'}</p>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Add to Cart Section (Client Component) */}
              <AddToCartSection product={product} />

              {/* Trust Badges */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-8">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 bg-green-100 text-green-700 rounded-full">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Bảo hành 24 tháng</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                    <Truck className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Giao hàng toàn quốc</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 bg-orange-100 text-orange-700 rounded-full">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Đổi trả 7 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
