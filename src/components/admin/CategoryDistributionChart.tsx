'use client'

import { 
  PieChart, 
  Pie, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CategoryDistributionChartProps {
  data: { name: string, value: number }[]
}

const COLORS = [
  'hsl(var(--primary))', 
  'hsl(var(--primary) / 0.7)', 
  'hsl(var(--primary) / 0.5)', 
  'hsl(var(--primary) / 0.3)',
  'hsl(var(--primary) / 0.1)'
]

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  return (
    <Card className="col-span-4 lg:col-span-3 border-none shadow-xl rounded-[2rem] overflow-hidden bg-background">
      <CardHeader>
        <CardTitle className="text-xl font-black uppercase tracking-tight">Phân bổ danh mục</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border-2 border-primary/20 p-3 rounded-2xl shadow-xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{payload[0].name}</p>
                      <p className="text-sm font-black text-primary">{payload[0].value} sản phẩm</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                formatter={(value) => <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
