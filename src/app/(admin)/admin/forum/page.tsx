import { adminGetPendingPosts, adminModeratePost } from '@/actions/forum'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, MessageSquare, User, Calendar, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
  title: 'Duyệt bài viết Diễn đàn | Admin Pho Gear',
}

export default async function AdminForumPage() {
  const pendingPosts = await adminGetPendingPosts()

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-primary">Duyệt bài viết cộng đồng</h1>
          <p className="text-muted-foreground font-medium">Kiểm soát nội dung trước khi hiển thị lên diễn đàn Pho Gear.</p>
        </div>
        <div className="bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
            <span className="text-xs font-black uppercase tracking-widest text-primary">Đang chờ duyệt: {pendingPosts.length}</span>
        </div>
      </div>

      <div className="space-y-6">
        {pendingPosts.length > 0 ? (
          pendingPosts.map((post) => (
            <Card key={post.id} className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-background group">
              <div className="flex flex-col lg:flex-row">
                {/* Image Preview */}
                <div className="relative w-full lg:w-80 h-64 lg:h-auto overflow-hidden bg-muted">
                    {post.images_url?.[0] ? (
                        <Image src={post.images_url[0]} alt={post.title} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground opacity-20">
                            <ImageIcon size={48} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <CardContent className="p-10 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-1.5"><User size={12} className="text-primary" /> {String(post.profiles?.full_name || 'Anonymous')}</div>
                        <div className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tight">{post.title}</h3>
                    <p className="text-muted-foreground font-medium line-clamp-4 leading-relaxed">
                        {post.content}
                    </p>
                    
                    {post.images_url && post.images_url.length > 1 && (
                        <div className="flex gap-2">
                            {post.images_url.slice(1).map((img: string, i: number) => (
                                <div key={i} className="h-12 w-12 rounded-lg overflow-hidden border">
                                    <Image src={img} alt="More" width={48} height={48} className="object-cover" />
                                </div>
                            ))}
                            {post.images_url.length > 5 && (
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold">+{post.images_url.length - 5}</div>
                            )}
                        </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-6 border-t border-dashed">
                    <form action={async () => {
                        'use server'
                        await adminModeratePost(post.id, 'approved')
                    }}>
                        <Button className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 h-12 px-8 shadow-lg shadow-primary/20">
                            <Check size={16} /> Duyệt bài viết
                        </Button>
                    </form>
                    <form action={async () => {
                        'use server'
                        await adminModeratePost(post.id, 'rejected')
                    }}>
                        <Button variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 h-12 px-8 border-2 border-destructive/20 text-destructive hover:bg-destructive/5">
                            <X size={16} /> Từ chối
                        </Button>
                    </form>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-40 text-center border-4 border-dashed rounded-[4rem] bg-muted/5 space-y-4">
             <Check className="h-16 w-16 text-green-500 mx-auto opacity-30" />
             <h3 className="text-2xl font-black uppercase tracking-tight italic">Tất cả đã sạch sẽ!</h3>
             <p className="text-muted-foreground font-medium">Hiện tại không có bài viết nào đang chờ duyệt.</p>
          </div>
        )}
      </div>
    </div>
  )
}
