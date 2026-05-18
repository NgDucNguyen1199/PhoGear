'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAdminStats() {
  const supabase = await createClient()

  // 1. Thống kê doanh thu (tổng total_amount của đơn hàng 'delivered')
  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .eq('status', 'delivered')
  
  const totalRevenue = revenueData?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0

  // 2. Tổng số đơn hàng
  const { count: orderCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  // 3. Tổng số sản phẩm
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // 4. Tổng số người dùng
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // 5. Dữ liệu cho biểu đồ doanh thu (6 tháng gần nhất)
  const monthlyRevenue: { month: string, revenue: number }[] = []
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
  
  // Khởi tạo 6 tháng gần nhất
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    monthlyRevenue.push({
      month: `${months[d.getMonth()]}/${d.getFullYear().toString().slice(-2)}`,
      revenue: 0
    })
  }

  // Phân bổ doanh thu vào các tháng
  revenueData?.forEach(order => {
    const orderDate = new Date(order.created_at)
    const monthYear = `${months[orderDate.getMonth()]}/${orderDate.getFullYear().toString().slice(-2)}`
    const monthData = monthlyRevenue.find(m => m.month === monthYear)
    if (monthData) {
      monthData.revenue += order.total_amount
    }
  })

  // 6. Đơn hàng gần đây
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      status,
      created_at,
      profiles (full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    totalRevenue,
    orderCount: orderCount || 0,
    productCount: productCount || 0,
    userCount: userCount || 0,
    monthlyRevenue,
    recentOrders: recentOrders || []
  }
}
