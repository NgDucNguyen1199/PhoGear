import { getUserOrders } from '@/actions/orders'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Package, Calendar, MapPin, Phone, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const statusMap: Record<string, { label: string, color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipped: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  delivered: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200' },
}

export default async function OrdersPage() {
  const orders = await getUserOrders()
  const profile = await getProfile()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary" /> Lịch sử đơn hàng
          </h1>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Mã đơn hàng:</span>
                          <span className="text-sm font-bold">#{order.id.slice(0, 8)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.created_at).toLocaleDateString('vi-VN', { 
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <Badge className={`${statusMap[order.status]?.color || ''} px-3 py-1 font-semibold border`}>
                        {statusMap[order.status]?.label || order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" /> Địa chỉ nhận hàng
                        </div>
                        <p className="text-sm font-medium">{order.shipping_address}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" /> Số điện thoại
                        </div>
                        <p className="text-sm font-medium">{order.phone_number}</p>
                      </div>
                      <div className="space-y-2 text-right">
                        <p className="text-sm text-muted-foreground">Tổng cộng</p>
                        <p className="text-xl font-bold text-primary">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded bg-muted overflow-hidden border flex-shrink-0">
                            {item.products?.images_url?.[0] && (
                              <Image src={item.products.images_url[0]} alt={item.products.name} fill className="object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold line-clamp-1">{item.products?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price_at_time)} x {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price_at_time * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed py-20">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <Package className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-medium text-muted-foreground">Bạn chưa có đơn hàng nào</h3>
                <p className="text-muted-foreground mb-6">Hãy khám phá các sản phẩm tuyệt vời của Pho Gear nhé!</p>
                <Link href="/">
                  <Button>Bắt đầu mua sắm</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
