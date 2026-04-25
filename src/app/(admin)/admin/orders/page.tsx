import { getAllOrders } from '@/actions/admin_orders'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusSelector } from '@/components/admin/StatusSelector'
import { Search, ShoppingBag, User, Calendar, CreditCard } from 'lucide-react'

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Đơn hàng</h1>
        <p className="text-muted-foreground">Theo dõi và cập nhật trạng thái đơn hàng của khách hàng.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách tất cả đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-background rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Địa chỉ giao hàng</TableHead>
                  <TableHead className="min-w-[200px]">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-xs">#{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold flex items-center gap-1">
                            <User className="h-3 w-3" /> {order.profiles?.full_name || 'Khách vãng lai'}
                          </span>
                          <span className="text-xs text-muted-foreground">{order.phone_number}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] text-sm truncate" title={order.shipping_address}>
                        {order.shipping_address}
                      </TableCell>
                      <TableCell>
                        <StatusSelector orderId={order.id} currentStatus={order.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">
                      Hệ thống chưa có đơn hàng nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
