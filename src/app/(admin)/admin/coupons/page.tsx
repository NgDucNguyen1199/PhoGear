import { getCoupons } from '@/actions/admin_coupons'
import { AddCouponDialog } from '@/components/admin/AddCouponDialog'
import { EditCouponDialog } from '@/components/admin/EditCouponDialog'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Ticket, Calendar, Users } from 'lucide-react'
import { Coupon } from '@/types'

export default async function AdminCouponsPage() {
  const coupons = await getCoupons()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date()
    if (!coupon.is_active) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Đã tắt</Badge>
    if (coupon.end_date && new Date(coupon.end_date) < now) return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Hết hạn</Badge>
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Hết lượt</Badge>
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đang hoạt động</Badge>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
            <Ticket className="h-8 w-8 text-primary" /> Mã giảm giá
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý các chương trình khuyến mãi và mã giảm giá.</p>
        </div>
        <AddCouponDialog />
      </div>

      <div className="bg-background border rounded-3xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Mã code</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Loại</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Giá trị</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Sử dụng</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Thời hạn</TableHead>
              <TableHead className="font-bold uppercase text-[10px] tracking-widest">Trạng thái</TableHead>
              <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20 text-muted-foreground italic">
                  Chưa có mã giảm giá nào được tạo.
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-bold text-primary">{coupon.code}</TableCell>
                  <TableCell>
                    <span className="text-xs font-medium">
                      {coupon.type === 'percentage' ? 'Phần trăm (%)' : 
                       coupon.type === 'fixed_amount' ? 'Số tiền cố định' : 'Freeship'}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : 
                     coupon.type === 'fixed_amount' ? formatPrice(coupon.value) : 'Miễn phí'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="font-bold">{coupon.usage_count}</span>
                      {coupon.usage_limit && <span className="text-muted-foreground">/ {coupon.usage_limit}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-[10px]">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Từ: {new Date(coupon.start_date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      {coupon.end_date && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Đến: {new Date(coupon.end_date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon)}</TableCell>
                  <TableCell className="text-right">
                    <EditCouponDialog coupon={coupon} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
