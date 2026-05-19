'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, User, Clock, MessageSquare, Lock } from 'lucide-react'
import { addComment } from '@/actions/forum'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'

export function CommentSection({ postId, comments, userId }: { postId: string, comments: any[], userId?: string }) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    startTransition(async () => {
      const result = await addComment(postId, content)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result?.success)
        setContent('')
      }
    })
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-black uppercase tracking-tight italic">Thảo luận cộng đồng</h2>
        <span className="bg-primary/10 text-primary text-sm font-black px-3 py-1 rounded-lg">{comments.length}</span>
      </div>

      {/* Write Comment */}
      {userId ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] rounded-3xl p-6 text-base font-medium border-2 focus-visible:ring-primary bg-muted/20"
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !content.trim()} className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primary/20">
              {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={16} />}
              Gửi bình luận
            </Button>
          </div>
        </form>
      ) : (
        <Card className="rounded-[2.5rem] border-dashed border-2 p-12 bg-muted/5 text-center space-y-6">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
            <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight italic">Đăng nhập để tham gia thảo luận</h3>
                <p className="text-muted-foreground font-medium">Chỉ thành viên Pho Gear mới có quyền gửi bình luận vào các bài viết.</p>
            </div>
            <Link href="/login" className="inline-block">
                <Button className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8">Đến trang đăng nhập</Button>
            </Link>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-8 pt-6">
        <AnimatePresence mode="popLayout">
          {comments.length > 0 ? (
            comments.map((comment, idx) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-6 p-8 rounded-[2.5rem] bg-muted/10 border border-white/5 relative group"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl flex-shrink-0 overflow-hidden border-2 border-primary/20">
                    {comment.profiles?.avatar_url ? (
                        <Image src={comment.profiles.avatar_url} alt="User" width={48} height={48} className="object-cover" />
                    ) : (
                        comment.profiles?.full_name?.charAt(0) || 'U'
                    )}
                </div>
                <div className="flex-1 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-primary uppercase tracking-wider">{String(comment.profiles?.full_name || 'Người dùng PhoGear')}</h4>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Clock size={10} /> {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 opacity-50 space-y-4">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="font-medium italic">Chưa có bình luận nào. Hãy là người đầu tiên khơi mào thảo luận!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
