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
      case 0: return 'bg-yellow-500 text-white ring-4 ring-yellow-500/20'
      case 1: return 'bg-slate-300 text-slate-700 ring-4 ring-slate-300/20'
      case 2: return 'bg-orange-600 text-white ring-4 ring-orange-600/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="w-full bg-background border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      {/* Header with Filters */}
      <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-foreground">
              Bảng xếp hạng thần tốc
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
              <Globe2 size={12} className="animate-pulse" /> Cập nhật thời gian thực
            </p>
          </div>
        </div>

        <div className="flex p-1.5 bg-muted rounded-2xl gap-1 min-w-[300px]">
          {(['all-time', 'monthly', 'weekly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all",
                filter === f 
                  ? "bg-background text-primary shadow-xl scale-[1.02]" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f === 'all-time' ? 'Tất cả' : f === 'monthly' ? 'Tháng này' : 'Tuần này'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-8">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-12 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        ) : scores.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <Trophy className="h-16 w-16" />
            <p className="text-sm font-bold uppercase tracking-widest italic">Hệ thống đang chờ đợi kỷ lục đầu tiên</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {scores.slice(0, 20).map((score, index) => (
              <div 
                key={score.id}
                className={cn(
                  "group relative p-5 rounded-[2rem] transition-all hover:bg-muted border border-white/5 hover:border-primary/20 hover:scale-[1.02] flex flex-col gap-4",
                  index < 3 && "bg-primary/5 border-primary/10"
                )}
              >
                {/* Rank Float */}
                <div className={cn(
                  "absolute -top-2 -left-2 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-lg z-10",
                  getRankBadge(index)
                )}>
                  {index + 1}
                </div>

                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white/10 ring-2 ring-background">
                    <AvatarImage src={score.profiles?.avatar_url || ''} />
                    <AvatarFallback className="bg-muted">
                      <User size={18} className="text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">
                      {score.profiles?.full_name || 'Vô danh'}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                      {score.mode.split('_').join(' ')}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-dashed border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-muted-foreground uppercase">Tốc độ</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-foreground tracking-tighter">{Math.round(score.wpm)}</span>
                      <span className="text-[10px] font-black text-primary">WPM</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-muted-foreground uppercase">Chính xác</span>
                    <div className="text-sm font-black text-foreground">{Math.round(score.accuracy)}%</div>
                  </div>
                </div>

                {index < 3 && (
                   <Zap className="absolute top-4 right-4 h-3 w-3 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-8 py-4 bg-muted/30 border-t border-white/5 flex justify-between items-center">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          PhoGear Engine v2.0 • Top {scores.length} Racers
        </p>
        <div className="flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black text-muted-foreground uppercase">Server Online</span>
        </div>
      </div>
    </div>
  )
}
