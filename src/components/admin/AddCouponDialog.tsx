'use client'

import { useState, useMemo } from 'react'
import { createCoupon } from '@/actions/admin_coupons'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function AddCouponDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState('percentage')

  const initialStartDate = useMemo(() => {
    return new Date().toISOString().slice(0, 16)
  }, [open])

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
    }
    
    const result = await createCoupon(data)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ className: 'gap-2' })}>
        <Plus size={18} /> Thêm mã giảm giá
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm mã giảm giá mới</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Mã code</Label>
              <Input id="code" name="code" placeholder="Ví dụ: SUMMER2026" required className="uppercase" />
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
                placeholder={type === 'percentage' ? 'Ví dụ: 10' : 'Ví dụ: 50000'} 
                required={type !== 'free_shipping'}
                disabled={type === 'free_shipping'}
                defaultValue={type === 'free_shipping' ? '0' : ''}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="min_order_amount">Đơn tối thiểu (VND)</Label>
              <Input id="min_order_amount" name="min_order_amount" type="number" placeholder="Ví dụ: 200000" defaultValue="0" />
            </div>
          </div>

          {type === 'percentage' && (
            <div className="grid gap-2">
              <Label htmlFor="max_discount_amount">Giảm tối đa (VND - Tùy chọn)</Label>
              <Input id="max_discount_amount" name="max_discount_amount" type="number" placeholder="Ví dụ: 100000" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_date">Ngày bắt đầu</Label>
              <Input 
                key={`start_date-${open}`}
                id="start_date" 
                name="start_date" 
                type="datetime-local" 
                defaultValue={initialStartDate} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">Ngày kết thúc (Tùy chọn)</Label>
              <Input 
                key={`end_date-${open}`}
                id="end_date" 
                name="end_date" 
                type="datetime-local" 
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="usage_limit">Giới hạn số lần dùng (Tùy chọn)</Label>
            <Input 
              key={`usage_limit-${open}`}
              id="usage_limit" 
              name="usage_limit" 
              type="number" 
              placeholder="Ví dụ: 100" 
            />
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu mã giảm giá
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
