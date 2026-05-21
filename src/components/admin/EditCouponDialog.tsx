'use client'

import { useState } from 'react'
import { updateCoupon, deleteCoupon } from '@/actions/admin_coupons'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

export function EditCouponDialog({ coupon }: { coupon: any }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [type, setType] = useState(coupon.type)
  const [isActive, setIsActive] = useState(coupon.is_active)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const data = {
      code: formData.get('code'),
      type: type,
      value: formData.get('value'),
      min_order_amount: formData.get('min_order_amount'),
      max_discount_amount: formData.get('max_discount_amount'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      usage_limit: formData.get('usage_limit'),
      is_active: isActive
    }
    
    const result = await updateCoupon(coupon.id, data)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
      setOpen(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return
    
    setIsDeleting(true)
    const result = await deleteCoupon(coupon.id)
    setIsDeleting(false)

    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
      setOpen(false)
    }
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-blue-600"
        onClick={() => setOpen(true)}
      >
        <Edit size={16} />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-0.5">
                <Label>Trạng thái hoạt động</Label>
                <p className="text-xs text-muted-foreground">Bật hoặc tắt mã giảm giá này</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Mã code</Label>
                <Input id="code" name="code" defaultValue={coupon.code} required className="uppercase" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Loại giảm giá</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                    <SelectItem value="fixed_amount">Số tiền cố định (VND)</SelectItem>
                    <SelectItem value="free_shipping">Miễn phí vận chuyển</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="value">Giá trị giảm</Label>
                <Input 
                  key={`value-${type}`}
                  id="value" 
                  name="value" 
                  type="number" 
                  defaultValue={coupon.value}
                  required={type !== 'free_shipping'}
                  disabled={type === 'free_shipping'}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="min_order_amount">Đơn tối thiểu (VND)</Label>
                <Input 
                  key={`min_order_amount-${coupon.id}`}
                  id="min_order_amount" 
                  name="min_order_amount" 
                  type="number" 
                  defaultValue={coupon.min_order_amount} 
                />
              </div>
            </div>

            {type === 'percentage' && (
              <div className="grid gap-2">
                <Label htmlFor="max_discount_amount">Giảm tối đa (VND - Tùy chọn)</Label>
                <Input 
                  key={`max_discount_amount-${coupon.id}`}
                  id="max_discount_amount" 
                  name="max_discount_amount" 
                  type="number" 
                  defaultValue={coupon.max_discount_amount || ''} 
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Ngày bắt đầu</Label>
                <Input 
                  key={`start_date-${coupon.id}`}
                  id="start_date" 
                  name="start_date" 
                  type="datetime-local" 
                  defaultValue={formatDateTime(coupon.start_date)} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">Ngày kết thúc (Tùy chọn)</Label>
                <Input 
                  key={`end_date-${coupon.id}`}
                  id="end_date" 
                  name="end_date" 
                  type="datetime-local" 
                  defaultValue={formatDateTime(coupon.end_date)} 
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="usage_limit">Giới hạn số lần dùng (Tùy chọn)</Label>
              <Input 
                key={`usage_limit-${coupon.id}`}
                id="usage_limit" 
                name="usage_limit" 
                type="number" 
                defaultValue={coupon.usage_limit || ''} 
              />
            </div>

            <DialogFooter className="pt-4 flex justify-between sm:justify-between items-center">
              <Button 
                  variant="destructive" 
                  type="button" 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  className="gap-2"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={16} />}
                Xóa
              </Button>
              <div className="flex gap-2">
                  <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>
                  <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                  </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
