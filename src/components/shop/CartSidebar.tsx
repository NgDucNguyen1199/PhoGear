'use client'

import { useCartStore } from '@/store/cartStore'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function CartSidebar({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)

  // Fix hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const totalPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(getTotalPrice())

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="flex flex-row items-center gap-2 space-y-0">
          <ShoppingCart className="h-5 w-5" />
          <SheetTitle>Giỏ hàng của bạn</SheetTitle>
        </SheetHeader>
        
        <Separator className="my-4" />

        <div className="flex-1 overflow-hidden">
          {items.length > 0 ? (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted border">
                      {item.images_url?.[0] ? (
                        <Image src={item.images_url[0]} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">No img</div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-muted-foreground uppercase">{item.brand}</p>
                      <p className="text-sm font-bold text-primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <ShoppingCart className="h-10 w-10 text-muted-foreground opacity-20" />
              </div>
              <p className="text-muted-foreground">Giỏ hàng đang trống</p>
              <Button variant="outline" onClick={() => setOpen(false)}>Tiếp tục mua sắm</Button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span className="text-primary">{totalPrice}</span>
            </div>
            <SheetFooter>
              <Link href="/checkout" className="w-full" onClick={() => setOpen(false)}>
                <Button className="w-full py-6 text-lg font-bold">THANH TOÁN NGAY</Button>
              </Link>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
