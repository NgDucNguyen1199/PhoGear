import { getProducts } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { ProductCard } from '@/components/shop/ProductCard'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { UserGuideSection } from '@/components/home/UserGuideSection'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Keyboard, Zap, ShieldCheck, Truck } from 'lucide-react'

// Kích hoạt ISR (Incremental Static Regeneration)
// Next.js sẽ tái tạo (re-render) lại trang này ở chế độ nền sau mỗi 60 giây
// Đảm bảo Carousel luôn cập nhật sản phẩm mới mà không làm chậm trải nghiệm của người dùng
export const revalidate = 60

export default async function HomePage() {
  const heroProducts = await getProducts(5) // Fetch 5 sản phẩm mới nhất cho Carousel
  const products = await getProducts(8) // Fetch 8 sản phẩm cho danh sách bên dưới
  const profile = await getProfile()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={profile} />
      
      {/* Hero Section Carousel */}
      <HeroCarousel products={heroProducts} />

      {/* Features Section */}
      <section className="py-12 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-background rounded-full border shadow-sm">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">Bảo hành 2 năm</h3>
              <p className="text-sm text-muted-foreground">Cam kết chất lượng</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-background rounded-full border shadow-sm">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">Giao hàng hỏa tốc</h3>
              <p className="text-sm text-muted-foreground">Trong vòng 2 giờ</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-background rounded-full border shadow-sm">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">Hỗ trợ 24/7</h3>
              <p className="text-sm text-muted-foreground">Tư vấn tận tình</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-background rounded-full border shadow-sm">
                <Keyboard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold">Build theo yêu cầu</h3>
              <p className="text-sm text-muted-foreground">Custom hóa tối đa</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Sản phẩm mới về</h2>
              <p className="text-muted-foreground">Những mẫu bàn phím cơ mới nhất thị trường</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="hidden sm:flex">
                Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
              <Keyboard className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-medium text-muted-foreground">Chưa có sản phẩm nào</h3>
              <p className="text-muted-foreground mb-6">Chúng tôi đang cập nhật sản phẩm, quay lại sau nhé!</p>
              <Link href="/login">
                <Button variant="outline">Đăng nhập Admin để thêm sản phẩm</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* User Guide Section */}
      <UserGuideSection />

      {/* Footer */}
      <footer className="mt-auto border-t bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-bold mb-4">PHO GEAR</h3>
              <p className="text-sm text-muted-foreground">
                Cửa hàng bàn phím cơ cao cấp tại Việt Nam. 
                Nâng tầm trải nghiệm gõ phím của người Việt.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products?category=keyboard">Bàn phím</Link></li>
                <li><Link href="/products?category=keycap">Keycap</Link></li>
                <li><Link href="/products?category=switch">Switch</Link></li>
                <li><Link href="/products?category=accessory">Phụ kiện</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/policy">Chính sách bảo hành</Link></li>
                <li><Link href="/shipping">Vận chuyển</Link></li>
                <li><Link href="/contact">Liên hệ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Đăng ký nhận tin</h4>
              <p className="text-xs text-muted-foreground mb-4">Nhận thông báo về sản phẩm mới và khuyến mãi.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email của bạn" className="bg-background border rounded px-3 py-1 text-sm w-full" />
                <Button size="sm">Gửi</Button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
            © 2026 Pho Gear. Tất cả quyền được bảo lưu. Thiết kế bởi Đồ án Tốt nghiệp.
          </div>
        </div>
      </footer>
    </div>
  )
}
