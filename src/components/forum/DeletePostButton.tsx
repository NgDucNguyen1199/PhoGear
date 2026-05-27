'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deletePost } from '@/actions/forum'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeletePostButtonProps {
  postId: string
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deletePost(postId)
      if (result.success) {
        toast.success(result.success)
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button 
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-1.5 hover:text-destructive transition-colors"
        >
          <Trash2 size={12} className="text-destructive/70" /> 
          <span className="text-destructive/70 group-hover:text-destructive">Xóa</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2rem]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black uppercase tracking-tight italic">Xác nhận xóa bài viết?</AlertDialogTitle>
          <AlertDialogDescription className="font-medium text-muted-foreground">
            Hành động này không thể hoàn tác. Bài viết của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Xác nhận xóa'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
