'use client'

import { useEffect, useState } from 'react'
import { getUserTypingHistory } from '@/actions/typing'
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Award, Target, History } from 'lucide-react'

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
    <section className="py-20 border-t border-white/5 mt-20">
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Tiến trình của bạn</h2>
        <p className="text-muted-foreground font-medium max-w-md">Theo dõi sự phát triển kỹ năng gõ phím của bạn qua từng bài tập.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatItem icon={<Award className="text-yellow-500" />} title="Tốc độ cao nhất" value={`${bestWpm} WPM`} />
        <StatItem icon={<TrendingUp className="text-primary" />} title="Tốc độ trung bình" value={`${avgWpm} WPM`} />
        <StatItem icon={<Target className="text-green-500" />} title="Độ chính xác trung bình" value={`${avgAcc}%`} />
      </div>

      <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-background/50 backdrop-blur-xl">
        <CardHeader className="p-8 pb-0">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
            <History size={16} /> Biểu đồ tiến bộ
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] w-full p-8 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
              <XAxis 
                dataKey="created_at" 
                hide 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '16px' }}
                labelStyle={{ display: 'none' }}
              />
              <Line 
                type="monotone" 
                dataKey="wpm" 
                name="Tốc độ (WPM)"
                stroke="hsl(var(--primary))" 
                strokeWidth={4} 
                dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'white' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                name="Độ chính xác (%)"
                stroke="hsl(var(--muted-foreground) / 0.5)" 
                strokeWidth={2} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  )
}

function StatItem({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="bg-background/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 shadow-xl flex items-center gap-5">
      <div className="p-4 bg-muted rounded-2xl">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-black italic">{value}</p>
      </div>
    </div>
  )
}
