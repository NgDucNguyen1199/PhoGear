import { Navbar } from '@/components/layout/Navbar'
import { getProfile } from '@/actions/auth'
import { KeyboardFinder } from '@/components/shop/KeyboardFinder'
import { getCategories } from '@/actions/products'

export const metadata = {
  title: 'Keyboard Finder | Pho Gear',
  description: 'Tìm kiếm chiếc bàn phím hoàn hảo dành riêng cho bạn thông qua bộ công cụ lọc thông minh của Pho Gear.',
}

export default async function KeyboardFinderPage() {
  const user = await getProfile()
  const categories = await getCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1 bg-muted/20 pb-20">
        <div className="container mx-auto px-4 pt-12">
          <KeyboardFinder categories={categories} />
        </div>
      </main>
    </div>
  )
}
