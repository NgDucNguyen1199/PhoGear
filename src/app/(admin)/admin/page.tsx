import { getAdminStats } from '@/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { BestSellersChart } from '@/components/admin/BestSellersChart'
import { CategoryDistributionChart } from '@/components/admin/CategoryDistributionChart'
import { RecentOrders } from '@/components/admin/RecentOrders'
import { cn } from '@/lib/utils'

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  const formattedRevenue = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(stats.totalRevenue)

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-primary">Hệ thống quản trị</h1>
          <p className="text-muted-foreground font-medium">Theo dõi hoạt động kinh doanh và quản lý dữ liệu Pho Gear.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Tổng doanh thu" 
          value={formattedRevenue} 
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          description="Dựa trên đơn hàng đã giao"
          trend="+12.5%"
          trendUp={true}
        />
        <StatCard 
          title="Đơn hàng" 
          value={stats.orderCount.toLocaleString('vi-VN')} 
          icon={<ShoppingBag className="h-5 w-5 text-primary" />}
          description="Tổng số đơn hệ thống"
          trend="+8.2%"
          trendUp={true}
        />
        <StatCard 
          title="Sản phẩm" 
          value={stats.productCount.toLocaleString('vi-VN')} 
          icon={<Package className="h-5 w-5 text-primary" />}
          description="Mẫu mã đang kinh doanh"
          trend="+2"
          trendUp={true}
        />
        <StatCard 
          title="Người dùng" 
          value={stats.userCount.toLocaleString('vi-VN')} 
          icon={<Users className="h-5 w-5 text-primary" />}
          description="Khách hàng đã đăng ký"
          trend="+4.1%"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <RevenueChart data={stats.monthlyRevenue} />
        <div className="lg:col-span-3">
            <RecentOrders orders={stats.recentOrders} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-6">
        <BestSellersChart data={stats.topProducts} />
        <CategoryDistributionChart data={stats.categoryDistribution} />
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  trendUp 
}: { 
  title: string, 
  value: string, 
  icon: React.ReactNode, 
  description: string,
  trend?: string,
  trendUp?: boolean
}) {
  return (
    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-background group hover:bg-primary/[0.02] transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tracking-tight mb-1">{value}</div>
        <div className="flex items-center gap-2">
            {trend && (
                <span className={cn(
                    "flex items-center text-[10px] font-black px-2 py-0.5 rounded-full",
                    trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                    {trendUp ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
                    {trend}
                </span>
            )}
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
