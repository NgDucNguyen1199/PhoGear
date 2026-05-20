import { adminGetPendingPosts } from '@/actions/forum'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, MessageSquare, User, Calendar, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { ModerateButtons } from '@/components/admin/ModerateButtons'

export const metadata = {
  title: 'Duyệt bài viết Diễn đàn | Admin Pho Gear',
}

export default async function AdminForumPage() {
  const pendingPosts = await adminGetPendingPosts()

  return (
    <div className="space-y-6 sm:space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic text-primary">Duyệt bài viết cộng đồng</h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">Kiểm soát nội dung trước khi hiển thị lên diễn đàn Pho Gear.</p>
        </div>
        <div className="bg-primary/10 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-primary/20 w-fit">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary">Đang chờ duyệt: {pendingPosts.length}</span>
        </div>
      </div>

      <div className="space-y-6">
        {pendingPosts.length > 0 ? (
          pendingPosts.map((post) => (
            <Card key={post.id} className="rounded-[1.5rem] sm:rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-background group">
              <div className="flex flex-col lg:flex-row">
                {/* Image Preview */}
                <div className="relative w-full lg:w-80 h-48 sm:h-64 lg:h-auto overflow-hidden bg-muted">
                    {post.images_url?.[0] ? (
                        <Image src={post.images_url[0]} alt={post.title} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground opacity-20">
                            <ImageIcon size={32} className="sm:w-12 sm:h-12" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <CardContent className="p-6 sm:p-10 flex-1 flex flex-col justify-between space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4 text-left">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-1.5"><User size={12} className="text-primary" /> {String(post.profiles?.full_name || 'Anonymous')}</div>
                        <div className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black uppercase italic tracking-tight">{post.title}</h3>
                    <p className="text-xs sm:text-base text-muted-foreground font-medium line-clamp-3 sm:line-clamp-4 leading-relaxed">
                        {post.content}
                    </p>
                    
                    {post.images_url && post.images_url.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {post.images_url.slice(1).map((img: string, i: number) => (
                                <div key={i} className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg overflow-hidden border">
                                    <Image src={img} alt="More" width={48} height={48} className="object-cover" />
                                </div>
                            ))}
                            {post.images_url.length > 5 && (
                                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg bg-muted flex items-center justify-center text-[9px] sm:text-[10px] font-bold">+{post.images_url.length - 5}</div>
                            )}
                        </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <ModerateButtons postId={post.id} />
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-20 sm:py-40 text-center border-4 border-dashed rounded-[2rem] sm:rounded-[4rem] bg-muted/5 space-y-4 px-4">
             <Check className="h-10 w-10 sm:h-16 sm:w-16 text-green-500 mx-auto opacity-30" />
             <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight italic">Tất cả đã sạch sẽ!</h3>
             <p className="text-sm sm:text-base text-muted-foreground font-medium">Hiện tại không có bài viết nào đang chờ duyệt.</p>
          </div>
        )}
      </div>
    </div>
  )
}
