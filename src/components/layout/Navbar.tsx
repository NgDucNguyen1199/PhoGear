'use client'

import { useState, useEffect, FormEvent, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, Search, Menu, LogOut, Heart, Loader2, X, ArrowRight, Sun, Moon } from 'lucide-react'
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
import { Logo } from '@/components/ui/Logo'
import { RegionSwitcher } from '@/components/layout/RegionSwitcher'
import { useI18n } from '@/components/providers/I18nProvider'
import { useTheme } from 'next-themes'
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetHeader
} from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'

function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <Button variant="ghost" size="icon" className="h-9 w-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 transition-all hover:scale-110 active:scale-95"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export function Navbar({ user }: { user: any }) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const wishlistItems = useWishlistStore((state) => state.items)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        const results = await searchProducts(searchQuery)
        setSuggestions(results.slice(0, 5))
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
      setIsMobileSearchOpen(false)
    }
  }

  const NavLinks = () => (
    <>
      <Link href="/products" className="transition-all hover:text-primary hover:scale-105 active:scale-95">{t.nav.products}</Link>
      <Link href="/categories" className="transition-all hover:text-primary hover:scale-105 active:scale-95">{t.nav.categories}</Link>
      <Link href="/forum" className="transition-all hover:text-primary hover:scale-105 active:scale-95">Cộng đồng</Link>
      <Link href="/photype" className="transition-all hover:text-orange-600 font-bold text-orange-500 hover:scale-105 active:scale-95">{t.nav.photype}</Link>
      <Link href="/about" className="transition-all hover:text-primary hover:scale-105 active:scale-95">{t.nav.about}</Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-4 lg:gap-8">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden transition-all active:scale-90">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle className="flex items-center gap-2">
                  <Logo width={40} height={40} />
                  <span className="font-black italic text-xl tracking-tighter">PHO GEAR</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full py-6">
                <nav className="flex flex-col gap-4 px-6 text-lg font-black uppercase tracking-tighter italic">
                  <Link 
                    href="/products" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 border-b border-muted group"
                  >
                    {t.nav.products} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                  <Link 
                    href="/categories" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 border-b border-muted group"
                  >
                    {t.nav.categories} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                  <Link 
                    href="/forum" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 border-b border-muted group"
                  >
                    Cộng đồng <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                  <Link 
                    href="/photype" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 border-b border-muted group text-orange-500"
                  >
                    {t.nav.photype} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                  <Link 
                    href="/about" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 border-b border-muted group"
                  >
                    {t.nav.about} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </nav>
                
                <div className="mt-auto p-6 space-y-4 mb-12">
                  <RegionSwitcher />
                  {!user ? (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs">
                        {t.nav.login}
                      </Button>
                    </Link>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" onClick={() => { router.push('/profile'); setIsMobileMenuOpen(false); }} className="rounded-xl font-bold text-[10px] uppercase">Hồ sơ</Button>
                        <Button variant="destructive" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="rounded-xl font-bold text-[10px] uppercase">Đăng xuất</Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/">
            <Logo width={40} height={40} />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-4">
          <div ref={searchRef} className="relative hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder={t.nav.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                className="w-64 rounded-md border border-input bg-background pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {isSearching && (
                <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-background border rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 border-b bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t.nav.suggestedProducts}
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
                          {new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', { 
                            style: 'currency', 
                            currency: locale === 'vi' ? 'VND' : 'USD' 
                          }).format(locale === 'vi' ? product.price : product.price / 25000)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div 
                  onClick={handleSearch}
                  className="p-3 text-center text-xs font-medium text-primary hover:bg-primary/5 cursor-pointer border-t"
                >
                  {t.nav.viewAllResults} "{searchQuery}"
                </div>
              </div>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden transition-all active:scale-90"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative transition-all hover:scale-110 active:scale-95 hover:text-primary"
            onClick={() => router.push('/wishlist')}
          >
            <Heart className="h-5 w-5" />
            {mounted && wishlistItems.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {wishlistItems.length}
              </span>
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative transition-all hover:scale-110 active:scale-95 hover:text-primary"
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

          <div className="hidden sm:block border-l h-6 mx-1 opacity-20" />
          
          <div className="hidden sm:block">
            <RegionSwitcher />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', size: 'icon', className: "transition-all hover:scale-110 active:scale-95 hover:text-primary" })}>
                <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  {t.nav.myProfile}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/orders')}>
                  {t.nav.orders}
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    {t.nav.admin}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logout()} className="text-destructive font-bold">
                  <LogOut className="mr-2 h-4 w-4" /> {t.nav.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button size="sm" className="rounded-lg font-bold uppercase text-[10px] tracking-widest">{t.nav.login}</Button>
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t bg-background overflow-hidden"
          >
            <div className="p-4 flex gap-2">
              <form onSubmit={handleSearch} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  autoFocus
                  placeholder={t.nav.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-input bg-muted/30 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </form>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileSearchOpen(false)} className="active:scale-90">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
