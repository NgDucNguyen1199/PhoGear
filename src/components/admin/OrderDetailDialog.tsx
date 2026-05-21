'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye, Package, MapPin, Phone, User, Calendar, CreditCard, Ticket, ShoppingBag } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

export function OrderDetailDialog({ order }: { order: any }) {
  const [open, setOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const subtotal = order.order_items.reduce((acc: number, item: any) => acc + (item.price_at_time * item.quantity), 0)
  const shippingFee = order.total_amount >= 800000 ? 0 : 30000

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-primary hover:bg-primary/10"
        onClick={() => setOpen(true)}
      >
        <Eye size={16} />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" /> Chi tiết đơn hàng #{order.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-2xl space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <User size={12} /> Thông tin khách hàng
                </p>
                <p className="text-sm font-bold">{order.profiles?.full_name || 'Khách vãng lai'}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Phone size={12} /> {order.phone_number}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 leading-relaxed">
                  <MapPin size={12} className="shrink-0" /> {order.shipping_address}
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-2xl space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <Calendar size={12} /> Thông tin đơn hàng
                </p>
                <p className="text-sm font-bold">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                <p className="text-xs text-muted-foreground">Phương thức: {order.payment_method === 'online' ? 'Thanh toán trực tuyến' : 'Thanh toán khi nhận hàng (COD)'}</p>
                <div className="pt-1">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                      {order.status}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Sản phẩm đã đặt ({order.order_items.length})</p>
              <div className="space-y-3">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-muted/20 rounded-2xl items-center">
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-white border shrink-0">
                      {item.products?.images_url?.[0] ? (
                        <Image src={item.products.images_url[0]} alt={item.products.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Package className="h-6 w-6 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold line-clamp-1">{item.products?.name}</p>
                      <div className="flex gap-2 text-[10px] font-medium text-muted-foreground">
                        <span>{formatPrice(item.price_at_time)}</span>
                        <span>x</span>
                        <span>{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black">{formatPrice(item.price_at_time * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  <span>Phí vận chuyển</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-xs text-green-600 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Ticket size={12} /> Giảm giá</span>
                    <span>-{formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black uppercase tracking-[0.2em] italic">Tổng cộng</span>
                  <span className="text-2xl font-black text-primary tracking-tighter">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
