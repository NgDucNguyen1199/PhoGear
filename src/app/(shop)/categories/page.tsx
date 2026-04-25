import { getCategories } from '@/actions/products'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Layers, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Danh mục sản phẩm | Pho Gear',
  description: 'Khám phá các danh mục bàn phím cơ, keycap, switch và phụ kiện tại Pho Gear.',
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  const profile = await getProfile()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Danh mục sản phẩm</h1>
          <p className="text-lg text-muted-foreground">
            Dễ dàng tìm kiếm các sản phẩm bạn cần theo từng phân loại cụ thể tại Pho Gear.
          </p>
        </div>

        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/search?q=${encodeURIComponent(category.name)}`}>
                <Card className="h-full hover:border-primary hover:shadow-md transition-all cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-xl">{category.name}</span>
                      <div className="p-2 bg-muted rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Layers className="h-5 w-5" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      {category.description || `Xem tất cả các sản phẩm thuộc danh mục ${category.name}.`}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary group-hover:underline">
                      Xem danh mục <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/10">
            <Layers className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
            <h3 className="text-2xl font-medium text-foreground mb-2">Chưa có danh mục nào</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Hệ thống đang cập nhật các danh mục sản phẩm.
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
