'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, RotateCcw, Calendar as CalendarIcon, DollarSign } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

export function OrderFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [sort, setSort] = useState(searchParams.get('sort') || 'created_at-desc')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (status !== 'all') params.set('status', status)
    if (sort) params.set('sort', sort)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    router.push(`/orders?${params.toString()}`)
  }

  const resetFilters = () => {
    setQuery('')
    setStatus('all')
    setSort('created_at-desc')
    setMinPrice('')
    setMaxPrice('')
    router.push('/orders')
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Tìm theo sản phẩm, mã đơn, địa chỉ, SĐT..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 rounded-2xl border-muted-foreground/20 focus:ring-primary/20 text-base shadow-sm"
          />
          <Button 
            type="submit" 
            className="absolute right-2 top-2 h-10 rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            Tìm kiếm
          </Button>
        </form>

        {/* Action Buttons */}
        <div className="flex gap-2">
            <Popover>
                <PopoverTrigger render={
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-muted-foreground/20 gap-2 font-bold uppercase tracking-widest text-xs">
                        <Filter size={18} /> Lọc & Sắp xếp
                    </Button>
                } />
                <PopoverContent className="w-80 p-6 rounded-3xl shadow-2xl" align="end">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="font-black uppercase tracking-tight">Tùy chọn hiển thị</h4>
                            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-[10px] font-bold uppercase text-muted-foreground">
                                <RotateCcw size={12} className="mr-1" /> Reset
                            </Button>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Status */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trạng thái đơn hàng</Label>
                            <Select value={status} onValueChange={(v) => v && setStatus(v)}>
                                <SelectTrigger className="rounded-xl h-10 bg-muted/30 border-none">
                                    <SelectValue placeholder="Tất cả trạng thái" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                                    <SelectItem value="processing">Đang xử lý</SelectItem>
                                    <SelectItem value="shipped">Đang giao hàng</SelectItem>
                                    <SelectItem value="delivered">Đã giao hàng</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sorting */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sắp xếp theo</Label>
                            <Select value={sort} onValueChange={(v) => v && setSort(v)}>
                                <SelectTrigger className="rounded-xl h-10 bg-muted/30 border-none">
                                    <SelectValue placeholder="Mới nhất" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="created_at-desc">Thời gian: Mới nhất</SelectItem>
                                    <SelectItem value="created_at-asc">Thời gian: Cũ nhất</SelectItem>
                                    <SelectItem value="price-desc">Giá trị: Cao nhất</SelectItem>
                                    <SelectItem value="price-asc">Giá trị: Thấp nhất</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Khoảng giá (VNĐ)</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    type="number" 
                                    placeholder="Từ" 
                                    value={minPrice} 
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="h-10 rounded-xl bg-muted/30 border-none text-xs"
                                />
                                <span className="text-muted-foreground">—</span>
                                <Input 
                                    type="number" 
                                    placeholder="Đến" 
                                    value={maxPrice} 
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="h-10 rounded-xl bg-muted/30 border-none text-xs"
                                />
                            </div>
                        </div>

                        <Button onClick={applyFilters} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px]">
                            Áp dụng ngay
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
      </div>
    </div>
  )
}
