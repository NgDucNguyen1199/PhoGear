import { redirect } from 'next/navigation'
import { getProfile } from '@/actions/auth'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  Store,
  Layers,
  MessageSquare,
  Menu,
  Ticket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/ui/Logo'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  const AdminNavItems = () => (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground px-2 py-2 uppercase tracking-wider">Tổng quan</p>
      <SidebarItem href="/admin" icon={<LayoutDashboard size={18} />} label="Thống kê" />
      
      <p className="text-xs font-semibold text-muted-foreground px-2 py-4 uppercase tracking-wider">Quản lý</p>
      <SidebarItem href="/admin/products" icon={<Package size={18} />} label="Sản phẩm" />
      <SidebarItem href="/admin/categories" icon={<Layers size={18} />} label="Danh mục" />
      <SidebarItem href="/admin/orders" icon={<ShoppingBag size={18} />} label="Đơn hàng" />
      <SidebarItem href="/admin/coupons" icon={<Ticket size={18} />} label="Mã giảm giá" />
      <SidebarItem href="/admin/users" icon={<Users size={18} />} label="Người dùng" />
      <SidebarItem href="/admin/forum" icon={<MessageSquare size={18} />} label="Diễn đàn" />
      
      <Separator className="my-4" />
      <SidebarItem href="/" icon={<Store size={18} />} label="Về cửa hàng" />
      <SidebarItem href="/admin/settings" icon={<Settings size={18} />} label="Cài đặt" />
    </div>
  )

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r bg-background hidden lg:block">
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/admin">
            <Logo width={24} height={24} />
          </Link>
          <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-black bg-primary/10 text-primary uppercase">Admin</span>
        </div>
        <div className="p-4">
          <AdminNavItems />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                }
              />
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="p-6 border-b text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Logo width={24} height={24} />
                    <span className="font-black italic text-xl">ADMIN PANEL</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                  <AdminNavItems />
                </div>
              </SheetContent>
            </Sheet>
            <h2 className="font-semibold text-base sm:text-lg truncate">Hệ thống quản trị</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Xin chào, <strong>{String(profile.full_name || 'Admin')}</strong></span>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                {String(profile.full_name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <Button variant="ghost" className="w-full justify-start gap-3 px-2 py-6 font-medium transition-all hover:bg-muted active:scale-[0.98]">
        {icon}
        {label}
      </Button>
    </Link>
  )
}
