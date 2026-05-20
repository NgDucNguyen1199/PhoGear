'use client'

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BestSellersChartProps {
  data: { name: string, value: number }[]
}

export function BestSellersChart({ data }: BestSellersChartProps) {
  return (
    <Card className="col-span-4 lg:col-span-3 border-none shadow-xl rounded-[2rem] overflow-hidden bg-background">
      <CardHeader>
        <CardTitle className="text-xl font-black uppercase tracking-tight">Top bán chạy</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700 }}
              width={100}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border-2 border-primary/20 p-3 rounded-2xl shadow-xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{payload[0].payload.name}</p>
                      <p className="text-sm font-black text-primary">{payload[0].value} đã bán</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 10, 10, 0]}
              barSize={20}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`hsl(var(--primary) / ${1 - index * 0.15})`} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
