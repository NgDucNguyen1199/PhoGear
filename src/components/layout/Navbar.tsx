'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, Search, Menu, LogOut } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { logout } from '@/actions/auth'
import { useCartStore } from '@/store/cartStore'
import { CartSidebar } from '@/components/shop/CartSidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar({ user }: { user: any }) {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const [mounted, setMounted] = useState(false)

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
            PHO GEAR
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/products" className="transition-colors hover:text-primary">Sản phẩm</Link>
            <Link href="/categories" className="transition-colors hover:text-primary">Danh mục</Link>
            <Link href="/about" className="transition-colors hover:text-primary">Giới thiệu</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Tìm kiếm bàn phím..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 rounded-md border border-input bg-background pl-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </form>

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && getTotalItems() > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {getTotalItems()}
              </span>
            )}
          </Button>

          <CartSidebar open={isCartOpen} setOpen={setIsCartOpen} />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
                <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Hồ sơ của tôi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/orders')}>
                  Đơn hàng
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    Quản trị viên
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm">Đăng nhập</Button>
            </Link>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
