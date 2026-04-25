'use client'

import { useState } from 'react'
import { createCategory } from '@/actions/admin_categories'
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
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const result = await createCategory(formData)
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
        <Plus size={18} /> Thêm danh mục
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2 text-left">
            <Label htmlFor="name">Tên danh mục</Label>
            <Input id="name" name="name" placeholder="Ví dụ: Bàn phím cơ" required />
          </div>
          
          <div className="grid gap-2 text-left">
            <Label htmlFor="slug">Slug (Đường dẫn)</Label>
            <Input id="slug" name="slug" placeholder="Ví dụ: ban-phim-co" required />
          </div>

          <div className="grid gap-2 text-left">
            <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
            <Textarea id="description" name="description" placeholder="Nhập mô tả ngắn cho danh mục..." rows={3} />
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu danh mục
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
