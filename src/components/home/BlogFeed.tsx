'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const posts = [
  {
    title: 'Cách sử dụng phím tắt trên Yunzii B75 Pro Max',
    excerpt: 'Hướng dẫn chi tiết cách kết nối 3 chế độ, chỉnh LED và sử dụng màn hình LCD...',
    date: '15/05/2026',
    author: 'Pho Gear Team',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
    category: 'Hướng dẫn'
  },
  {
    title: 'Phân biệt âm thanh bàn phím: Creamy, Thocky và Clacky',
    excerpt: 'Bạn thuộc "hệ" âm thanh nào? Cùng khám phá sự khác biệt giữa các profile âm thanh phổ biến...',
    date: '12/05/2026',
    author: 'Admin',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    category: 'Kiến thức'
  },
  {
    title: 'Top 5 bàn phím cơ tốt nhất cho dân lập trình 2026',
    excerpt: 'Lựa chọn bàn phím giúp tăng năng suất gõ code và bảo vệ sức khỏe cổ tay của bạn...',
    date: '10/05/2026',
    author: 'Reviewer',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
    category: 'Top sản phẩm'
  }
]

export function BlogFeed() {
  return (
    <section className="py-24 bg-muted/20 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-16">
            <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">Góc Kiến Thức</h2>
                <p className="text-muted-foreground font-medium mt-2">Cập nhật tin tức, hướng dẫn và mẹo vặt về bàn phím cơ.</p>
            </div>
            <Link href="/blog" className="text-sm font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                Xem tất cả bài viết <ArrowRight size={14} />
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="group overflow-hidden rounded-[2rem] border-none shadow-xl hover:shadow-2xl transition-all h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {post.category}
                  </div>
                </div>
                <CardContent className="p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-primary" /> {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={12} className="text-primary" /> {post.author}
                      </div>
                    </div>
                    <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <Link href="#" className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary group-hover:gap-3 transition-all">
                    Đọc tiếp <ArrowRight size={14} />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
