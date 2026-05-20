'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@/types'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { X, Filter, RotateCcw } from 'lucide-react'

interface ProductFiltersProps {
  categories: Category[]
  brands: string[]
  layouts: string[]
  connectivities: string[]
  onApply?: () => void
  isSearch?: boolean
}

export function ProductFilters({ categories, brands, layouts, connectivities, onApply, isSearch }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [brand, setBrand] = useState(searchParams.get('brand') || 'all')
  const [layout, setLayout] = useState(searchParams.get('layout') || 'all')
  const [connectivity, setConnectivity] = useState(searchParams.get('connectivity') || 'all')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'created_at-desc')

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    // Preserve search query if on search page
    const currentQ = searchParams.get('q')
    if (isSearch && currentQ) params.set('q', currentQ)

    if (category !== 'all') params.set('category', category)
    if (brand !== 'all') params.set('brand', brand)
    if (layout !== 'all') params.set('layout', layout)
    if (connectivity !== 'all') params.set('connectivity', connectivity)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sort) params.set('sort', sort)

    const basePath = isSearch ? '/search' : '/products'
    router.push(`${basePath}?${params.toString()}`)
    if (onApply) onApply()
  }

  const resetFilters = () => {
    setCategory('all')
    setBrand('all')
    setLayout('all')
    setConnectivity('all')
    setMinPrice('')
    setMaxPrice('')
    setSort('created_at-desc')
    
    if (isSearch) {
        const currentQ = searchParams.get('q')
        router.push(`/search?q=${currentQ || ''}`)
    } else {
        router.push('/products')
    }
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Cấu hình bộ lọc</p>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Làm mới
        </Button>
      </div>

      <div className="space-y-6 flex-1">
        {/* Sắp xếp */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sắp xếp theo</Label>
          <Select value={sort} onValueChange={(v) => v && setSort(v)}>
            <SelectTrigger className="bg-muted/30 border-white/5 rounded-2xl h-12 focus:ring-primary/20">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/10 shadow-2xl">
              <SelectItem value="created_at-desc">Mới nhất</SelectItem>
              <SelectItem value="price-asc">Giá: Thấp đến Cao</SelectItem>
              <SelectItem value="price-desc">Giá: Cao đến Thấp</SelectItem>
              <SelectItem value="average_rating-desc">Đánh giá cao nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Danh mục */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Danh mục sản phẩm</Label>
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger className="bg-muted/30 border-white/5 rounded-2xl h-12 focus:ring-primary/20">
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/10 shadow-2xl">
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Thương hiệu */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Thương hiệu</Label>
          <Select value={brand} onValueChange={(v) => v && setBrand(v)}>
            <SelectTrigger className="bg-muted/30 border-white/5 rounded-2xl h-12 focus:ring-primary/20">
              <SelectValue placeholder="Tất cả thương hiệu" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/10 shadow-2xl">
              <SelectItem value="all">Tất cả thương hiệu</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Layout */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kích thước (Layout)</Label>
          <Select value={layout} onValueChange={(v) => v && setLayout(v)}>
            <SelectTrigger className="bg-muted/30 border-white/5 rounded-2xl h-12 focus:ring-primary/20">
              <SelectValue placeholder="Tất cả layout" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/10 shadow-2xl">
              <SelectItem value="all">Tất cả layout</SelectItem>
              {layouts.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Giá */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Khoảng giá (VNĐ)</Label>
          <div className="flex items-center gap-3">
            <Input 
              type="number" 
              placeholder="Từ" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value)}
              className="bg-muted/30 border-white/5 rounded-xl h-11 text-xs focus:ring-primary/20"
            />
            <span className="text-muted-foreground opacity-30">—</span>
            <Input 
              type="number" 
              placeholder="Đến" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              className="bg-muted/30 border-white/5 rounded-xl h-11 text-xs focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 mt-auto">
        <Button onClick={applyFilters} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
          Xác nhận bộ lọc
        </Button>
      </div>
    </div>
  )
}
