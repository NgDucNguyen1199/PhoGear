import { getApprovedPosts } from '@/actions/forum'
import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, MessageSquare, Calendar, User, ArrowRight, Search, Lock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Diễn đàn Cộng đồng Pho Gear | Chia sẻ kinh nghiệm build phím cơ',
}

export default async function ForumPage() {
  const posts = await getApprovedPosts()
  const profile = await getProfile()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={profile} />
      
      <main className="flex-1 pb-20">
        {/* Banner Section */}
        <section className="bg-primary/5 border-b py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none">
                <MessageSquare size={600} className="text-primary rotate-12" />
            </div>
            <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
                <Badge className="bg-primary text-primary-foreground border-none font-black uppercase tracking-[0.3em] px-4 py-1 mb-2">Community Hub</Badge>
                <h1 className="text-6xl font-black uppercase tracking-tighter italic text-foreground">Diễn Đàn Pho Gear</h1>
                <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg">
                    Nơi hội tụ những người yêu phím cơ, cùng nhau chia sẻ, học hỏi và truyền cảm hứng về nghệ thuật build bàn phím.
                </p>
                <div className="pt-4">
                    {profile ? (
                        <Link href="/forum/create">
                            <Button className="rounded-2xl font-black uppercase tracking-widest text-xs h-16 px-10 gap-3 shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                                <PlusCircle size={20} /> Viết bài chia sẻ mới
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                             <Button variant="outline" className="rounded-2xl font-black uppercase tracking-widest text-xs h-16 px-10 gap-3 border-2 opacity-70 hover:opacity-100">
                                <Lock size={20} /> Đăng nhập để viết bài
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </section>

        <div className="container mx-auto px-4 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* LISTING POSTS */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-black uppercase tracking-tight italic flex items-center gap-2">
                             Mới nhất <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                        </h2>
                    </div>

                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Link key={post.id} href={`/forum/${post.id}`} className="block group">
                                <Card className="rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-background">
                                    <div className="flex flex-col md:flex-row h-full">
                                        <div className="relative w-full md:w-64 h-64 md:h-auto overflow-hidden bg-muted">
                                            {post.images_url?.[0] ? (
                                                <Image 
                                                    src={post.images_url[0]} 
                                                    alt={post.title} 
                                                    fill 
                                                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary/10">
                                                    <MessageSquare size={64} />
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-10 flex-1 flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                    <div className="flex items-center gap-1.5">
                                                        <User size={12} className="text-primary" /> {String((post as any).author?.full_name || 'Anonymous')}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-primary" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <MessageSquare size={12} className="text-primary" /> 
                                                        {Array.isArray((post as any).comments) && (post as any).comments.length > 0
                                                            ? (post as any).comments[0].count 
                                                            : 0} bình luận
                                                    </div>
                                                </div>
                                                <h3 className="text-3xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors uppercase italic">
                                                    {post.title}
                                                </h3>
                                                <p className="text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                                                    {post.content}
                                                </p>
                                            </div>
                                            <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-3 transition-all">
                                                Đọc chi tiết bài viết <ArrowRight size={14} />
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <div className="py-40 text-center border-4 border-dashed rounded-[4rem] bg-muted/5">
                            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                            <p className="text-xl font-bold text-muted-foreground italic">Cộng đồng đang trong giai đoạn ủ mầm. Hãy là người gieo hạt đầu tiên!</p>
                        </div>
                    )}
                </div>

                {/* SIDEBAR */}
                <div className="space-y-10">
                    <Card className="rounded-[2.5rem] border-none shadow-xl p-10 bg-primary text-primary-foreground overflow-hidden relative group">
                         <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                         <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-4 relative z-10">Chào mừng bạn!</h3>
                         <p className="text-primary-foreground/80 font-medium leading-relaxed mb-8 relative z-10">
                            Pho Gear Forum là không gian mở dành cho tất cả mọi người. Hãy tôn trọng lẫn nhau và cùng xây dựng một cộng đồng phím cơ văn minh.
                         </p>
                         <ul className="space-y-4 text-xs font-bold uppercase tracking-widest relative z-10">
                            <li className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 bg-white rounded-full" /> Chia sẻ kinh nghiệm thật
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 bg-white rounded-full" /> Giúp đỡ người mới
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="h-1.5 w-1.5 bg-white rounded-full" /> Không spam quảng cáo
                            </li>
                         </ul>
                    </Card>

                    <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase tracking-tight italic px-2">Chủ đề nổi bật</h3>
                        <div className="flex flex-wrap gap-2 px-2">
                            {['Build phím', 'Mod switch', 'Keycap', 'Review', 'Tin tức', 'Workshop'].map(tag => (
                                <Badge key={tag} variant="secondary" className="rounded-xl px-4 py-2 font-black uppercase tracking-widest text-[9px] hover:bg-primary hover:text-white transition-colors cursor-pointer">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </main>
    </div>
  )
}
