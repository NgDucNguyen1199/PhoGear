'use client'

import { useState } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import { ProductFilters } from './ProductFilters'
import { Category } from '@/types'

interface FilterDrawerProps {
  categories: Category[]
  brands: string[]
  layouts: string[]
  connectivities: string[]
  isSearch?: boolean
}

export function FilterDrawer({ categories, brands, layouts, connectivities, isSearch }: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-12 w-full md:w-auto md:px-6 rounded-2xl border-primary/20 hover:border-primary hover:bg-primary/5 transition-all shadow-lg shadow-primary/5 group">
          <Filter className="h-5 w-5 md:mr-2 group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-black uppercase tracking-widest text-xs">Bộ lọc nâng cao</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[350px] sm:max-w-md p-0 border-l border-primary/10">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-8 border-b bg-primary/5">
            <SheetTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Filter className="text-primary" /> Tùy chọn bộ lọc
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-8">
            <ProductFilters 
              categories={categories} 
              brands={brands} 
              layouts={layouts} 
              connectivities={connectivities} 
              onApply={() => setIsOpen(false)}
              isSearch={isSearch}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
