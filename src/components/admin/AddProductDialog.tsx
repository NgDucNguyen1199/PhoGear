'use client'

import { useState } from 'react'
import { createProduct } from '@/actions/admin_products'
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
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function AddProductDialog({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const result = await createProduct(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ className: 'gap-2' })}>
        <Plus size={18} /> Thêm sản phẩm
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 text-left">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input id="name" name="name" placeholder="Ví dụ: Keychron Q1" required />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="brand">Thương hiệu</Label>
              <Input id="brand" name="brand" placeholder="Ví dụ: Keychron" required />
            </div>
          </div>

          <div className="grid gap-2 text-left">
            <Label htmlFor="category_id">Danh mục</Label>
            <Select name="category_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="grid gap-2">
              <Label htmlFor="price">Giá bán (VNĐ)</Label>
              <Input id="price" name="price" type="number" placeholder="3000000" required />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="stock_quantity">Số lượng tồn kho</Label>
              <Input id="stock_quantity" name="stock_quantity" type="number" placeholder="10" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="grid gap-2">
              <Label htmlFor="layout">Layout</Label>
              <Input id="layout" name="layout" placeholder="Ví dụ: 75%, TKL..." />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="connectivity">Kết nối</Label>
              <Input id="connectivity" name="connectivity" placeholder="Ví dụ: Wired, Bluetooth..." />
            </div>
          </div>

          <div className="grid gap-2 text-left">
            <Label htmlFor="description">Mô tả sản phẩm</Label>
            <Textarea id="description" name="description" placeholder="Nhập mô tả chi tiết sản phẩm..." rows={4} />
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu sản phẩm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
