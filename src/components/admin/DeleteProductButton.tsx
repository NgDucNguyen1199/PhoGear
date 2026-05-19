'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteProduct } from '@/actions/admin_products'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteProduct(productId)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.success || 'Đã xóa sản phẩm thành công')
        setOpen(false)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa sản phẩm.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-destructive h-8 w-8 hover:bg-destructive/10"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight italic text-destructive">Xác nhận xóa</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium pt-2">
              Bạn có chắc chắn muốn xóa sản phẩm <strong className="text-foreground">{productName}</strong>? 
              Hành động này không thể hoàn tác và toàn bộ biến thể liên quan cũng sẽ bị xóa.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-6">
            <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl font-bold uppercase tracking-widest text-[10px]">
              Hủy bỏ
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isLoading}
              className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 px-6"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
