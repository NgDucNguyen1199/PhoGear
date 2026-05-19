'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, Loader2 } from 'lucide-react'
import { adminModeratePost } from '@/actions/forum'
import { toast } from 'sonner'

export function ModerateButtons({ postId }: { postId: string }) {
  const [isLoading, setIsLoading] = useState<'approving' | 'rejecting' | null>(null)

  const handleModerate = async (status: 'approved' | 'rejected') => {
    setIsLoading(status === 'approved' ? 'approving' : 'rejecting')
    
    try {
      const result = await adminModeratePost(postId, status)
      
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.success) {
        toast.success(result.success)
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi xử lý bài viết.')
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-4 pt-6 border-t border-dashed">
      <Button 
        onClick={() => handleModerate('approved')}
        disabled={isLoading !== null}
        className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 h-12 px-8 shadow-lg shadow-primary/20"
      >
        {isLoading === 'approving' ? (
            <Loader2 className="animate-spin h-4 w-4" />
        ) : (
            <Check size={16} />
        )}
        Duyệt bài viết
      </Button>

      <Button 
        variant="outline" 
        onClick={() => handleModerate('rejected')}
        disabled={isLoading !== null}
        className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 h-12 px-8 border-2 border-destructive/20 text-destructive hover:bg-destructive/5"
      >
        {isLoading === 'rejecting' ? (
            <Loader2 className="animate-spin h-4 w-4" />
        ) : (
            <X size={16} />
        )}
        Từ chối
      </Button>
    </div>
  )
}
