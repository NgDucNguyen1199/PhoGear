import { getAdminStats, seedCategories, seedProducts } from '@/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, ShoppingBag, Package, Users, TrendingUp, Database, Keyboard } from 'lucide-react'

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  const formattedRevenue = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(stats.totalRevenue)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thống kê tổng quan</h1>
          <p className="text-muted-foreground">Chào mừng quay trở lại hệ thống quản trị Pho Gear.</p>
        </div>
        <div className="flex gap-2">
          <form action={async (formData: FormData) => {
            'use server'
            await seedCategories()
          }}>
            <Button variant="outline" className="gap-2">
              <Database size={16} /> Khởi tạo danh mục
            </Button>
          </form>
          <form action={async (formData: FormData) => {
            'use server'
            await seedProducts()
          }}>
            <Button className="gap-2">
              <Keyboard size={16} /> Khởi tạo sản phẩm mẫu
            </Button>
          </form>
        </div>
      </div>
...
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Tổng doanh thu" 
          value={formattedRevenue} 
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="+20% so với tháng trước"
        />
        <StatCard 
          title="Đơn hàng" 
          value={stats.orderCount.toString()} 
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
          description="Đơn hàng đã được tạo"
        />
        <StatCard 
          title="Sản phẩm" 
          value={stats.productCount.toString()} 
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          description="Sản phẩm hiện có trong kho"
        />
        <StatCard 
          title="Người dùng" 
          value={stats.userCount.toString()} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Khách hàng đã đăng ký"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Biểu đồ doanh thu</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-muted-foreground italic text-sm">Biểu đồ đang được phát triển...</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground italic">Chưa có đơn hàng mới nào được ghi nhận.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}
