import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Clock, User } from 'lucide-react'
import Link from 'next/link'

interface RecentOrdersProps {
  orders: any[]
}

const statusMap: Record<string, { label: string, color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipped: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  delivered: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200' },
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value)
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <ShoppingBag className="text-primary" /> Đơn hàng gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/10 transition-colors">
                <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight">#{order.id.slice(0, 8)}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    <User size={12} className="text-primary" /> {order.profiles?.full_name || 'Khách vãng lai'}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    <Clock size={12} /> {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-sm font-black text-primary">{formatVND(order.total_amount)}</p>
                  <Badge className={`${statusMap[order.status]?.color || ''} text-[8px] px-2 py-0.5 rounded-lg border shadow-none uppercase font-black tracking-widest`}>
                    {statusMap[order.status]?.label || order.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-4 opacity-50">
              <ShoppingBag size={48} className="text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground italic font-medium">Chưa có đơn hàng mới nào được ghi nhận.</p>
            </div>
          )}
        </div>
        {orders.length > 0 && (
          <div className="mt-6">
            <Link href="/admin/orders">
              <Button variant="ghost" className="w-full rounded-xl font-black uppercase tracking-widest text-[10px] h-10">
                Xem tất cả đơn hàng
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
