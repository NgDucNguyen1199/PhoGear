'use client'

import { useState } from 'react'
import { updateCategory } from '@/actions/admin_categories'
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
import { Pencil, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Category } from '@/types'

export function EditCategoryDialog({ category }: { category: Category | any }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const result = await updateCategory(category.id, formData)
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
      <DialogTrigger className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
        <Pencil size={16} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2 text-left">
            <Label htmlFor="name">Tên danh mục</Label>
            <Input id="name" name="name" defaultValue={category.name} required />
          </div>
          
          <div className="grid gap-2 text-left">
            <Label htmlFor="slug">Slug (Đường dẫn)</Label>
            <Input id="slug" name="slug" defaultValue={category.slug} required />
          </div>

          <div className="grid gap-2 text-left">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" name="description" defaultValue={category.description} rows={3} />
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
