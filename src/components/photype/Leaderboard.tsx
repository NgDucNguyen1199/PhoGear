'use client'

import { useState, useEffect } from 'react'
import { getLeaderboard } from '@/actions/typing'
import { TypingScore } from '@/types'
import { Trophy, Globe2, Loader2, User, Zap } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type Filter = 'all-time' | 'weekly' | 'monthly'

export function Leaderboard() {
  const [filter, setFilter] = useState<Filter>('all-time')
  const [scores, setScores] = useState<TypingScore[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadLeaderboard() {
      setIsLoading(true)
      const data = await getLeaderboard(filter)
      setScores(data)
      setIsLoading(false)
    }
    loadLeaderboard()
  }, [filter])

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0: return 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
      case 1: return 'bg-slate-300 text-slate-700 ring-4 ring-slate-300/20'
      case 2: return 'bg-orange-600 text-white ring-4 ring-orange-600/20'
      default: return 'bg-muted/50 text-muted-foreground'
    }
  }

  return (
    <div className="w-full bg-card/60 backdrop-blur-3xl border border-border rounded-[3rem] overflow-hidden shadow-2xl transition-colors">
      {/* Header with Filters */}
      <div className="p-10 border-b border-border flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-foreground">
              Bảng xếp hạng thần tốc
            </h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
              <Globe2 size={12} className="text-primary animate-pulse" /> Cập nhật thời gian thực
            </p>
          </div>
        </div>

        <div className="flex p-2 bg-muted rounded-[1.5rem] gap-1 border border-border min-w-[320px]">
          {(['all-time', 'monthly', 'weekly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                filter === f 
                  ? "bg-background text-primary shadow-2xl scale-[1.05]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5"
              )}
            >
              {f === 'all-time' ? 'Tất cả' : f === 'monthly' ? 'Tháng này' : 'Tuần này'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-10">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Đang đồng bộ dữ liệu...</p>
          </div>
        ) : scores.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
            <Trophy className="h-20 w-20 text-muted-foreground" />
            <p className="text-sm font-bold uppercase tracking-widest italic">Hệ thống đang chờ đợi kỷ lục đầu tiên</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {scores.slice(0, 20).map((score, index) => (
              <div 
                key={score.id}
                className={cn(
                  "group relative p-6 rounded-[2.5rem] transition-all duration-500 hover:bg-muted/50 border border-border hover:border-primary/30 hover:scale-[1.03] hover:shadow-2xl flex flex-col gap-5 bg-muted/20",
                  index < 3 && "border-primary/20 bg-primary/[0.03]"
                )}
              >
                {/* Rank Float */}
                <div className={cn(
                  "absolute -top-3 -left-3 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shadow-2xl z-10 transition-transform group-hover:rotate-12",
                  getRankBadge(index)
                )}>
                  {index + 1}
                </div>

                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-border ring-4 ring-primary/5 transition-transform group-hover:scale-110">
                    <AvatarImage src={score.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors tracking-tight">
                      {score.profiles?.full_name || 'Vô danh'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter opacity-60">
                      {score.mode.split('_').join(' • ')}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-5 border-t border-dashed border-border flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Tốc độ</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">{Math.round(score.wpm)}</span>
                      <span className="text-[11px] font-black text-primary">WPM</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Chính xác</span>
                    <div className="text-base font-black text-foreground group-hover:text-green-500 transition-colors">{Math.round(score.accuracy)}%</div>
                  </div>
                </div>

                {index < 3 && (
                   <Zap className="absolute top-5 right-5 h-4 w-4 text-primary opacity-10 group-hover:opacity-100 transition-all group-hover:scale-125" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-10 py-5 bg-muted border-t border-border flex justify-between items-center">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
          PhoGear Engine v2.0 • Top {scores.length} Racers
        </p>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Server Online</span>
        </div>
      </div>
    </div>
  )
}
