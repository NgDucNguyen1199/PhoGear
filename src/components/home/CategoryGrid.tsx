'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Category } from '@/types'

const categoryHighlights = [
  {
    name: 'Bàn phím cơ',
    desc: 'Trải nghiệm gõ đỉnh cao',
    color: 'from-blue-500 to-blue-700',
    slug: 'ban-phim-co',
    grid: 'md:col-span-2 md:row-span-2'
  },
  {
    name: 'Keycap',
    desc: 'Cá nhân hóa góc làm việc',
    color: 'from-orange-500 to-orange-700',
    slug: 'keycap',
    grid: 'md:col-span-1 md:row-span-1'
  },
  {
    name: 'Switch',
    desc: 'Âm thanh & Cảm giác',
    color: 'from-emerald-500 to-emerald-700',
    slug: 'switch',
    grid: 'md:col-span-1 md:row-span-1'
  },
  {
    name: 'Phụ kiện',
    desc: 'Build & Mod chuyên nghiệp',
    color: 'from-purple-500 to-purple-700',
    slug: 'phu-kien',
    grid: 'md:col-span-2 md:row-span-1'
  }
]

export function CategoryGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-12">
            <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">Khám phá Danh mục</h2>
                <p className="text-muted-foreground font-medium mt-2">Tìm kiếm mọi thứ bạn cần để nâng cấp trải nghiệm gõ phím.</p>
            </div>
            <Link href="/categories" className="text-sm font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                Xem tất cả danh mục <ArrowRight size={14} />
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-[800px] md:h-[600px]">
          {categoryHighlights.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={cat.grid}
            >
              <Link 
                href={`/search?q=${encodeURIComponent(cat.name)}`}
                className="group relative block w-full h-full overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-all duration-500`} />
                
                {/* Abstract Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-64 h-64 border-[32px] border-white rounded-full transition-transform duration-1000 group-hover:scale-125" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 border-[48px] border-white rounded-full transition-transform duration-1000 group-hover:scale-110" />
                </div>

                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic">{cat.name}</h3>
                        <p className="text-white/80 font-bold uppercase tracking-widest text-xs">{cat.desc}</p>
                        <div className="pt-4 flex items-center gap-2 text-white font-black uppercase tracking-[0.2em] text-[10px] opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-500">
                            Khám phá ngay <ArrowRight size={12} />
                        </div>
                    </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

