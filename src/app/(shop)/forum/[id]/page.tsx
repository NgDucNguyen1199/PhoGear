import { getPostById, addComment } from '@/actions/forum'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  User, 
  MessageSquare, 
  ArrowLeft, 
  Send,
  Loader2,
  Clock,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { CommentSection } from './CommentSection'

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const post = await getPostById(id)
  const profile = await getProfile()

  if (!post) {
    redirect('/forum')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={profile} />
      
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/forum" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-12 font-black uppercase tracking-widest text-[10px] transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Quay lại diễn đàn
          </Link>

          <article className="space-y-12">
             {/* Header */}
             <header className="space-y-8">
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
                    <Badge className="rounded-xl px-4 py-1.5 bg-primary/10 text-primary border-none">Community Experience</Badge>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground"><Clock size={12} /> {new Date(post.created_at).toLocaleTimeString('vi-VN')}</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none text-foreground">
                    {post.title}
                </h1>
                
                <div className="flex items-center gap-4 p-6 bg-muted/20 rounded-[2rem] border border-white/5 w-fit">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl overflow-hidden border-2 border-primary/20">
                        {post.profiles?.avatar_url ? (
                            <Image src={post.profiles.avatar_url} alt="Author" width={48} height={48} className="object-cover" />
                        ) : (
                            post.profiles?.full_name?.charAt(0) || 'U'
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tác giả</p>
                        <p className="font-black text-lg text-primary">{post.profiles?.full_name || 'Người dùng PhoGear'}</p>
                    </div>
                </div>
             </header>

             {/* Content */}
             <div className="space-y-12">
                <div className="prose prose-invert prose-xl max-w-none">
                    <p className="text-xl leading-relaxed text-muted-foreground font-medium whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>

                {/* Images Gallery */}
                {post.images_url && post.images_url.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {post.images_url.map((img: string, i: number) => (
                            <div key={i} className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-muted">
                                <Image src={img} alt={`${post.title} image ${i+1}`} fill className="object-cover hover:scale-105 transition-transform duration-1000" />
                            </div>
                        ))}
                    </div>
                )}
             </div>

             <Separator className="my-16 opacity-30" />

             {/* Actions */}
             <div className="flex items-center gap-6">
                <Button variant="outline" className="rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-xs gap-3 border-2">
                    <Heart size={18} /> Tương tác hữu ích
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground font-black uppercase tracking-widest text-xs">
                    <MessageSquare size={18} className="text-primary" /> {post.comments?.length || 0} Bình luận
                </div>
             </div>

             {/* Comments Section */}
             <CommentSection postId={post.id} comments={post.comments || []} userId={profile?.id} />

          </article>
        </div>
      </main>
    </div>
  )
}
