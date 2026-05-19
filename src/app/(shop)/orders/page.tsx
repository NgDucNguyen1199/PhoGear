import { getUserOrders } from '@/actions/orders'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Package, Calendar, MapPin, Phone, ShoppingBag, Search, Filter, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { OrderFilters } from '@/components/shop/OrderFilters'
import { Suspense } from 'react'

const statusMap: Record<string, { label: string, color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipped: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  delivered: { label: 'Đã giao hàng', color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200' },
}

async function OrderList({ searchParams }: { searchParams: any }) {
  const params = await searchParams
  const orders = await getUserOrders({
    query: params.q,
    status: params.status,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    sort: params.sort,
  })

  if (orders.length === 0) {
    return (
      <Card className="border-dashed py-20 rounded-[3rem] bg-muted/10">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Search className="h-10 w-10 text-muted-foreground opacity-20" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">Không tìm thấy đơn hàng</h3>
          <p className="text-muted-foreground mb-8 max-w-sm font-medium">Chúng tôi không tìm thấy kết quả nào khớp với yêu cầu của bạn. Hãy thử thay đổi bộ lọc nhé!</p>
          <Link href="/orders">
            <Button variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-xs h-12 px-8">Xóa tất cả bộ lọc</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden border-none shadow-xl rounded-[2.5rem] bg-background hover:shadow-2xl transition-all duration-500 group">
          <CardHeader className="bg-primary/[0.03] border-b border-primary/5 py-8 px-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Order</Badge>
                  <span className="text-xl font-mono font-bold tracking-tighter">#{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                  <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                </div>
              </div>
              <Badge className={`${statusMap[order.status]?.color || ''} px-6 py-2.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border shadow-sm`}>
                {statusMap[order.status]?.label || order.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              <div className="space-y-3 p-6 bg-muted/20 rounded-3xl border border-transparent group-hover:border-primary/5 transition-colors">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  <MapPin className="h-4 w-4" /> Vận chuyển đến
                </div>
                <p className="text-sm font-bold leading-relaxed">{order.shipping_address}</p>
              </div>
              <div className="space-y-3 p-6 bg-muted/20 rounded-3xl border border-transparent group-hover:border-primary/5 transition-colors">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  <Phone className="h-4 w-4" /> Liên hệ
                </div>
                <p className="text-sm font-bold">{order.phone_number}</p>
              </div>
              <div className="space-y-3 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col justify-center items-end text-right">
                <p className="text-xs font-black uppercase tracking-widest text-primary/60">Tổng thanh toán</p>
                <p className="text-4xl font-black text-primary tracking-tight">
                  {order.total_amount.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>

            <Separator className="mb-10 opacity-50" />

            <div className="space-y-6">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-muted/30 transition-colors border border-transparent hover:border-muted/50">
                  <div className="relative h-20 w-20 rounded-2xl bg-white overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                    {item.products?.images_url?.[0] ? (
                      <Image src={item.products.images_url[0]} alt={item.products.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted"><Package className="text-muted-foreground opacity-20" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link href={`/products/${item.product_id}`} className="font-bold text-base hover:text-primary transition-colors line-clamp-1">
                        {item.products?.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                        <span>{item.price_at_time.toLocaleString('vi-VN')}đ</span>
                        <span className="h-1 w-1 bg-muted-foreground rounded-full opacity-30"></span>
                        <span>Số lượng: {item.quantity}</span>
                    </div>
                    {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.selected_options).map(([key, value]) => (
                          <span key={key} className="text-[9px] font-bold text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-lg font-black text-foreground">{(item.price_at_time * item.quantity).toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 flex justify-end">
                <Button variant="ghost" className="rounded-xl font-black uppercase tracking-[0.2em] text-[10px] gap-2 group/btn">
                    Xem chi tiết <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function OrdersPage(props: { searchParams: Promise<any> }) {
  const profile = await getProfile()
  const ordersData = await getUserOrders() // For initial empty check

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Navbar user={profile} />
      
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                <ShoppingBag className="h-12 w-12 text-primary" /> Đơn hàng
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">Quản lý và theo dõi hành trình các sản phẩm của bạn.</p>
            </div>
            {ordersData.length > 0 && (
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-background px-5 py-2.5 rounded-full border shadow-sm">
                    {ordersData.length} giao dịch đã thực hiện
                </div>
            )}
          </div>

          {ordersData.length > 0 ? (
            <>
              <OrderFilters />
              <Suspense fallback={
                <div className="space-y-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-96 w-full bg-muted animate-pulse rounded-[3rem]" />
                  ))}
                </div>
              }>
                <OrderList searchParams={props.searchParams} />
              </Suspense>
            </>
          ) : (
            <Card className="border-dashed py-32 rounded-[3rem] bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="h-32 w-32 bg-background rounded-[2rem] flex items-center justify-center mb-8 shadow-sm">
                    <Package className="h-14 w-14 text-muted-foreground opacity-20" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tight">Hành trình chưa bắt đầu</h3>
                <p className="text-muted-foreground mb-10 max-w-sm font-medium">Bạn chưa thực hiện đơn hàng nào trên Pho Gear. Hãy khám phá những chiếc bàn phím cơ tuyệt vời ngay!</p>
                <Link href="/products">
                  <Button className="h-14 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Bắt đầu mua sắm ngay
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

