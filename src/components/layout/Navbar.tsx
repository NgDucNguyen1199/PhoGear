'use client'

import { useState, useEffect, FormEvent, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, Search, Menu, LogOut, Heart, Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { logout } from '@/actions/auth'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { CartSidebar } from '@/components/shop/CartSidebar'
import { searchProducts } from '@/actions/products'
import { Product } from '@/types'
import Image from 'next/image'
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
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const wishlistItems = useWishlistStore((state) => state.items)
  const [mounted, setMounted] = useState(false)

  // Xử lý click ra ngoài để đóng gợi ý
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Logic tìm kiếm gợi ý (Debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        const results = await searchProducts(searchQuery)
        setSuggestions(results.slice(0, 5)) // Lấy tối đa 5 gợi ý
        setShowSuggestions(true)
        setIsSearching(false)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSuggestions(false)
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
            <Link href="/photype" className="transition-colors hover:text-primary font-bold text-orange-500">Pho Type</Link>
            <Link href="/about" className="transition-colors hover:text-primary">Giới thiệu</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div ref={searchRef} className="relative hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Tìm kiếm bàn phím..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                className="w-64 rounded-md border border-input bg-background pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {isSearching && (
                <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-background border rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 border-b bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Sản phẩm gợi ý
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        router.push(`/products/${product.id}`)
                        setShowSuggestions(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer transition-colors border-b last:border-0"
                    >
                      <div className="relative h-12 w-12 rounded border bg-white overflow-hidden flex-shrink-0">
                        {product.images_url?.[0] ? (
                          <Image src={product.images_url[0]} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-muted text-[10px]">No Img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">{product.brand}</p>
                        <p className="text-sm font-bold text-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div 
                  onClick={handleSearch}
                  className="p-3 text-center text-xs font-medium text-primary hover:bg-primary/5 cursor-pointer border-t"
                >
                  Xem tất cả kết quả cho "{searchQuery}"
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => router.push('/wishlist')}
          >
            <Heart className="h-5 w-5" />
            {mounted && wishlistItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {wishlistItems.length}
              </span>
            )}
          </Button>

          {/* Cart Icon */}
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
