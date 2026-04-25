import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/auth'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  ChevronLeft,
  Store,
  Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-background hidden md:block">
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/admin" className="text-xl font-bold tracking-tighter">
            PHO GEAR <span className="text-primary">ADMIN</span>
          </Link>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground px-2 py-2 uppercase tracking-wider">Tổng quan</p>
          <SidebarItem href="/admin" icon={<LayoutDashboard size={18} />} label="Thống kê" />
          
          <p className="text-xs font-semibold text-muted-foreground px-2 py-4 uppercase tracking-wider">Quản lý</p>
          <SidebarItem href="/admin/products" icon={<Package size={18} />} label="Sản phẩm" />
          <SidebarItem href="/admin/categories" icon={<Layers size={18} />} label="Danh mục" />
          <SidebarItem href="/admin/orders" icon={<ShoppingBag size={18} />} label="Đơn hàng" />
          <SidebarItem href="/admin/users" icon={<Users size={18} />} label="Người dùng" />

          
          <Separator className="my-4" />
          <SidebarItem href="/" icon={<Store size={18} />} label="Về cửa hàng" />
          <SidebarItem href="/admin/settings" icon={<Settings size={18} />} label="Cài đặt" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-background flex items-center justify-between px-8">
          <h2 className="font-semibold text-lg">Hệ thống quản trị</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Xin chào, <strong>{profile.full_name}</strong></span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="w-full justify-start gap-3 px-2 py-6 font-medium transition-all hover:bg-muted">
        {icon}
        {label}
      </Button>
    </Link>
  )
}
