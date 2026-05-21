'use client'

import { useOptimistic, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleLikePost } from '@/actions/forum'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface LikeButtonProps {
  postId: string
  initialLikes: number
  initialIsLiked: boolean
  userId?: string
}

export function LikeButton({ postId, initialLikes, initialIsLiked, userId }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticLike, addOptimisticLike] = useOptimistic(
    { likes: initialLikes, isLiked: initialIsLiked },
    (state, action: 'added' | 'removed') => {
      if (action === 'added') {
        return { likes: state.likes + 1, isLiked: true }
      } else {
        return { likes: Math.max(0, state.likes - 1), isLiked: false }
      }
    }
  )

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      toast.error('Vui lòng đăng nhập để thả tim bài viết')
      return
    }

    startTransition(async () => {
      // Optimistic update
      const action = optimisticLike.isLiked ? 'removed' : 'added'
      addOptimisticLike(action)

      const result = await toggleLikePost(postId)
      
      if (result.error) {
        toast.error(result.error)
      } else if (result.success) {
        // success handled by server state syncing on next load
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "gap-2 rounded-xl font-bold transition-all",
        optimisticLike.isLiked ? "text-red-500 bg-red-500/5 hover:bg-red-500/10" : "text-muted-foreground"
      )}
      onClick={handleLike}
      disabled={isPending}
    >
      <Heart 
        size={16} 
        className={cn("transition-transform duration-300", optimisticLike.isLiked && "fill-current scale-110")} 
      />
      <span className="text-xs">{optimisticLike.likes}</span>
    </Button>
  )
}
