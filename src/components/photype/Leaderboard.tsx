'use client'

import { useState, useEffect } from 'react'
import { getLeaderboard } from '@/actions/typing'
import { TypingScore } from '@/types'
import { Trophy, Calendar, Globe2, Loader2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      case 0: return 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]'
      case 1: return 'bg-slate-300 text-slate-700'
      case 2: return 'bg-amber-600 text-white'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="bg-[#111111] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="p-6 border-b border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2 text-white">
            <Trophy className="h-5 w-5 text-yellow-500" /> Bảng xếp hạng
          </h2>
          <Globe2 className="h-4 w-4 text-muted-foreground animate-pulse" />
        </div>

        <div className="flex p-1 bg-white/5 rounded-2xl gap-1">
          {(['all-time', 'monthly', 'weekly'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                filter === f 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "text-muted-foreground hover:bg-white/5"
              )}
            >
              {f === 'all-time' ? 'Tất cả' : f === 'monthly' ? 'Tháng' : 'Tuần'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : scores.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 opacity-50">
            <Trophy className="h-12 w-12 text-muted-foreground/20" />
            <p className="text-xs font-bold uppercase tracking-widest">Chưa có dữ liệu</p>
          </div>
        ) : (
          <div className="space-y-2">
            {scores.map((score, index) => (
              <div 
                key={score.id}
                className={cn(
                  "group flex items-center gap-4 p-3 rounded-2xl transition-all hover:bg-white/5 border border-transparent hover:border-white/5",
                  index === 0 && "bg-white/[0.02]"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0",
                  getRankBadge(index)
                )}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <Avatar className="h-9 w-9 border-2 border-white/5">
                    <AvatarImage src={score.profiles?.avatar_url || ''} />
                    <AvatarFallback className="bg-white/5">
                      <User size={14} className="text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                      {score.profiles?.full_name || 'Vô danh'}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                      {score.mode.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-white leading-none tracking-tighter">
                    {Math.round(score.wpm)} <span className="text-[10px] font-bold text-primary">WPM</span>
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground">
                    ACC: {Math.round(score.accuracy)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-white/[0.02] border-t border-white/5">
        <p className="text-[9px] font-bold text-muted-foreground text-center uppercase tracking-widest">
          Cập nhật mỗi phút • PhoGear Engine v2.0
        </p>
      </div>
    </div>
  )
}
