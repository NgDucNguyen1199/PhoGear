import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Keyboard, Heart, ShieldCheck, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Giới thiệu | Pho Gear',
  description: 'Tìm hiểu về Pho Gear - Cửa hàng chuyên cung cấp bàn phím cơ và phụ kiện cao cấp hàng đầu Việt Nam.',
}

export default async function AboutPage() {
  const profile = await getProfile()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={profile} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-muted/30 py-20 border-b">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">VỀ CHÚNG TÔI</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Đam mê từng nhịp gõ,<br />Kiến tạo không gian làm việc.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Pho Gear ra đời với sứ mệnh mang đến trải nghiệm gõ phím hoàn hảo nhất cho cộng đồng người dùng máy tính tại Việt Nam. Chúng tôi tin rằng một chiếc bàn phím cơ tốt không chỉ là công cụ, mà là nguồn cảm hứng mỗi ngày.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border bg-muted shadow-lg">
                {/* Fallback image if unsplash is not configured perfectly, but we allowed it */}
                <Image 
                  src="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80" 
                  alt="Không gian làm việc với bàn phím cơ" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Câu chuyện của Pho Gear</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Bắt đầu từ một nhóm nhỏ những người đam mê Custom Keyboard (Bàn phím cơ tự ráp), chúng tôi nhận ra việc tìm kiếm và sở hữu những linh kiện chất lượng cao tại Việt Nam gặp rất nhiều khó khăn. 
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Pho Gear được thành lập để giải quyết vấn đề đó. Chúng tôi tuyển chọn kỹ lưỡng từng kit bàn phím, từng bộ keycap, cho đến từng chiếc switch nhỏ nhất để đảm bảo mỗi sản phẩm đến tay khách hàng đều đạt tiêu chuẩn cao nhất.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg font-medium text-foreground">
                  "Không chỉ bán sản phẩm, chúng tôi bán trải nghiệm gõ phím tuyệt vời."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-muted/10 py-20 border-t">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Giá trị cốt lõi</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Những nguyên tắc định hình mọi hoạt động và quyết định của Pho Gear.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-background border-none shadow-sm">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-primary/10 rounded-full text-primary">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Chất lượng hàng đầu</h3>
                  <p className="text-muted-foreground">Chỉ cung cấp các sản phẩm chính hãng, được kiểm định nghiêm ngặt trước khi đến tay người dùng.</p>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-sm">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-red-500/10 rounded-full text-red-500">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Tận tâm phục vụ</h3>
                  <p className="text-muted-foreground">Luôn lắng nghe, tư vấn nhiệt tình và hỗ trợ kỹ thuật trọn đời cho mọi khách hàng của Pho Gear.</p>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-sm">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-amber-500/10 rounded-full text-amber-500">
                    <Zap className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">Cập nhật xu hướng</h3>
                  <p className="text-muted-foreground">Liên tục nắm bắt và mang về những sản phẩm mới nhất, hot nhất trong thế giới bàn phím cơ.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 text-center container mx-auto px-4">
          <Keyboard className="h-16 w-16 mx-auto mb-6 text-primary opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Sẵn sàng để tùy biến góc làm việc của bạn?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gia nhập cộng đồng Pho Gear ngay hôm nay và tìm cho mình chiếc bàn phím ưng ý nhất.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8">Bắt đầu mua sắm</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 px-8">Đăng ký thành viên</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

// Inline component since we only use it here and didn't import
function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  )
}
