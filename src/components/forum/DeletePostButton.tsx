'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deletePost } from '@/actions/forum'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface DeletePostButtonProps {
  postId: string
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deletePost(postId)
      if (result.success) {
        toast.success(result.success)
        setOpen(false)
      } else if (result.error) {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi xóa bài viết.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button 
            className="flex items-center gap-1.5 hover:text-destructive transition-colors"
          >
            <Trash2 size={12} className="text-destructive/70" /> 
            <span className="text-destructive/70 group-hover:text-destructive text-[10px] font-black uppercase tracking-widest">Xóa</span>
          </button>
        }
      />
      <DialogContent className="rounded-[2rem] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-black uppercase tracking-tight italic text-xl">Xác nhận xóa bài viết?</DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground text-sm">
            Hành động này không thể hoàn tác. Bài viết của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống cộng đồng Pho Gear.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-4">
          <DialogClose 
            render={<Button variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px]" />}
          >
            Hủy bỏ
          </DialogClose>
          <Button 
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
            className="rounded-xl font-bold uppercase tracking-widest text-[10px] min-w-[100px]"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xác nhận xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
