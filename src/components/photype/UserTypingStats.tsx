'use client'

import { useEffect, useState } from 'react'
import { getUserTypingHistory } from '@/actions/typing'
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Award, Target, History } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export function UserTypingStats() {
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getUserTypingHistory()
      setHistory(data)
      setIsLoading(false)
    }
    fetchHistory()
  }, [])

  if (isLoading || history.length === 0) return null

  const bestWpm = Math.max(...history.map(s => s.wpm))
  const avgWpm = Math.round(history.reduce((acc, s) => acc + s.wpm, 0) / history.length)
  const avgAcc = Math.round(history.reduce((acc, s) => acc + s.accuracy, 0) / history.length)

  return (
    <section className="py-24 border-t border-white/5 mt-20">
      <div className="flex flex-col items-center text-center mb-16">
        <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.3em] px-4 py-1 mb-4">Performance Insights</Badge>
        <h2 className="text-5xl font-black uppercase tracking-tighter italic mb-4">Tiến trình của bạn</h2>
        <p className="text-muted-foreground font-medium max-w-md">Theo dõi sự phát triển kỹ năng gõ phím của bạn qua từng bài tập.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatItem icon={<Award className="text-yellow-500" size={24} />} title="Tốc độ cao nhất" value={`${bestWpm} WPM`} color="text-yellow-500" />
        <StatItem icon={<TrendingUp className="text-primary" size={24} />} title="Tốc độ trung bình" value={`${avgWpm} WPM`} color="text-primary" />
        <StatItem icon={<Target className="text-green-500" size={24} />} title="Độ chính xác" value={`${avgAcc}%`} color="text-green-500" />
      </div>

      <Card className="border border-white/10 shadow-2xl rounded-[3rem] overflow-hidden bg-[#1a1b23]/60 backdrop-blur-3xl">
        <CardHeader className="p-10 pb-0">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-muted-foreground">
            <div className="p-2 bg-white/10 rounded-lg border border-white/5">
              <History size={16} className="text-primary" />
            </div>
            Biểu đồ tiến bộ kỹ năng
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[450px] w-full p-10 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <defs>
                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.05)" />
              <XAxis 
                dataKey="created_at" 
                hide 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fontWeight: 800, fill: 'hsl(var(--muted-foreground) / 0.5)' }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '24px', padding: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
                labelStyle={{ display: 'none' }}
              />
              <Line 
                type="monotone" 
                dataKey="wpm" 
                name="Tốc độ (WPM)"
                stroke="hsl(var(--primary))" 
                strokeWidth={5} 
                dot={{ r: 5, fill: 'hsl(var(--primary))', strokeWidth: 3, stroke: 'hsl(var(--background))' }}
                activeDot={{ r: 8, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
                animationDuration={2000}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                name="Chính xác (%)"
                stroke="hsl(var(--muted-foreground) / 0.3)" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  )
}

function StatItem({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string, color: string }) {
  return (
    <div className="group bg-muted/20 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex items-center gap-6 transition-all hover:scale-[1.03] hover:bg-muted/30">
      <div className="p-5 bg-background/50 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5">{title}</p>
        <p className={cn("text-3xl font-black italic tracking-tighter", color)}>{value}</p>
      </div>
    </div>
  )
}
