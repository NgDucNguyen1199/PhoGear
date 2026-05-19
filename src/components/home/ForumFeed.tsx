'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight, MessageSquare, PlusCircle, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getApprovedPosts } from '@/actions/forum'
import { Post } from '@/types'

export function ForumFeed({ userId }: { userId?: string }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getApprovedPosts()
      setPosts(data as any)
      setIsLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <section className="py-24 bg-muted/20 border-t overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <div className="text-center md:text-left space-y-2">
                <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.3em] px-4 py-1 mb-2">Cộng đồng Pho Gear</Badge>
                <h2 className="text-5xl font-black uppercase tracking-tighter italic">Góc Chia Sẻ Kinh Nghiệm</h2>
                <p className="text-muted-foreground font-medium max-w-xl">Nơi các tay chơi phím cơ chia sẻ những bản build độc đáo và kiến thức hữu ích.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
                <Link href="/forum">
                    <Button variant="outline" className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 border-2 h-12 px-6">
                        Xem tất cả thảo luận <ArrowRight size={14} />
                    </Button>
                </Link>
                
                {userId ? (
                    <Link href="/forum/create">
                        <Button className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 h-12 px-6 shadow-xl shadow-primary/20">
                            <PlusCircle size={16} /> Đăng bài viết mới
                        </Button>
                    </Link>
                ) : (
                    <Link href="/login">
                        <Button className="rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 h-12 px-6 opacity-60">
                            <Lock size={14} /> Đăng nhập để chia sẻ
                        </Button>
                    </Link>
                )}
            </div>
        </div>

        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-96 rounded-[2rem] bg-muted animate-pulse" />
                ))}
            </div>
        ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post, idx) => (
                <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                >
                <Link href={`/forum/${post.id}`}>
                    <Card className="group overflow-hidden rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all h-full flex flex-col bg-background">
                        <div className="relative h-56 overflow-hidden">
                        {post.images_url?.[0] ? (
                            <Image
                                src={post.images_url[0]}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                                <MessageSquare size={48} className="text-primary/20" />
                            </div>
                        )}
                        <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                            Kinh nghiệm
                        </div>
                        </div>
                        <CardContent className="p-10 flex-1 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={12} className="text-primary" /> {new Date(post.created_at).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <User size={12} className="text-primary" /> {post.profiles?.full_name || 'Người dùng PhoGear'}
                            </div>
                            </div>
                            <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors uppercase italic">
                            {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-3 font-medium leading-relaxed">
                            {post.content}
                            </p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-dashed border-primary/10 flex items-center justify-between">
                            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group-hover:gap-3 transition-all">
                                Xem chi tiết <ArrowRight size={14} />
                            </span>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <MessageSquare size={14} />
                                <span className="text-xs font-bold">{(post as any).comments?.[0]?.count || 0}</span>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                </Link>
                </motion.div>
            ))}
            </div>
        ) : (
            <div className="text-center py-20 border-4 border-dashed rounded-[4rem] bg-background/50">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                <h3 className="text-2xl font-black uppercase tracking-tight italic">Chưa có bài viết nào</h3>
                <p className="text-muted-foreground font-medium">Hãy là người đầu tiên chia sẻ kinh nghiệm build phím của bạn!</p>
            </div>
        )}
      </div>
    </section>
  )
}
