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
}

export function ProductFilters({ categories, brands, layouts, connectivities }: ProductFiltersProps) {
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
    if (category !== 'all') params.set('category', category)
    if (brand !== 'all') params.set('brand', brand)
    if (layout !== 'all') params.set('layout', layout)
    if (connectivity !== 'all') params.set('connectivity', connectivity)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (sort) params.set('sort', sort)

    router.push(`/products?${params.toString()}`)
  }

  const resetFilters = () => {
    setCategory('all')
    setBrand('all')
    setLayout('all')
    setConnectivity('all')
    setMinPrice('')
    setMaxPrice('')
    setSort('created_at-desc')
    router.push('/products')
  }

  return (
    <div className="space-y-6 bg-muted/20 p-6 rounded-3xl border border-white/5 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" /> Bộ lọc
        </h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
          <RotateCcw className="h-3 w-3 mr-1" /> Reset
        </Button>
      </div>

      <Separator className="bg-white/5" />

      {/* Sắp xếp */}
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sắp xếp theo</Label>
        <Select value={sort} onValueChange={(v) => v && setSort(v)}>
          <SelectTrigger className="bg-background border-white/10 rounded-xl h-10">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-desc">Mới nhất</SelectItem>
            <SelectItem value="price-asc">Giá: Thấp đến Cao</SelectItem>
            <SelectItem value="price-desc">Giá: Cao đến Thấp</SelectItem>
            <SelectItem value="average_rating-desc">Đánh giá cao nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Danh mục */}
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Danh mục</Label>
        <Select value={category} onValueChange={(v) => v && setCategory(v)}>
          <SelectTrigger className="bg-background border-white/10 rounded-xl h-10">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Thương hiệu */}
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Thương hiệu</Label>
        <Select value={brand} onValueChange={(v) => v && setBrand(v)}>
          <SelectTrigger className="bg-background border-white/10 rounded-xl h-10">
            <SelectValue placeholder="Tất cả thương hiệu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thương hiệu</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Layout */}
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Layout</Label>
        <Select value={layout} onValueChange={(v) => v && setLayout(v)}>
          <SelectTrigger className="bg-background border-white/10 rounded-xl h-10">
            <SelectValue placeholder="Tất cả layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả layout</SelectItem>
            {layouts.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Giá */}
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Khoảng giá (VNĐ)</Label>
        <div className="flex gap-2">
          <Input 
            type="number" 
            placeholder="Min" 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)}
            className="bg-background border-white/10 rounded-xl h-10 text-xs"
          />
          <Input 
            type="number" 
            placeholder="Max" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
            className="bg-background border-white/10 rounded-xl h-10 text-xs"
          />
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full h-12 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
        Áp dụng bộ lọc
      </Button>
    </div>
  )
}
