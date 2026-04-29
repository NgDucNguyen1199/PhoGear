import { getProfile, logout } from '@/actions/auth'
import { getUserOrders } from '@/actions/orders'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { 
  User, Mail, Calendar, Award, Package, LogOut, 
  Clock, Zap, ShieldCheck, Activity, MapPin, Phone, Keyboard
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

export default async function ProfilePage() {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  const supabase = await createClient()
  const { data: scores } = await supabase
    .from('typing_scores')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const orders = await getUserOrders()

  // Calculate stats
  const totalRaces = scores?.length || 0
  const bestWpm = scores?.reduce((max, s) => Math.max(max, s.wpm), 0) || 0
  const avgAccuracy = scores?.length 
    ? Math.round(scores.reduce((acc, s) => acc + s.accuracy, 0) / scores.length) 
    : 0

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar user={profile} />
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header Profile */}
          <div className="relative rounded-3xl overflow-hidden bg-background border shadow-sm">
            <div className="h-32 md:h-48 bg-gradient-to-r from-primary/20 via-primary/5 to-background"></div>
            <div className="px-6 md:px-10 pb-8 flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 md:-mt-16 relative">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center text-primary text-5xl font-black shadow-lg">
                {profile.full_name?.charAt(0) || <User size={48} />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight">{profile.full_name}</h1>
                  {profile.role === 'admin' && (
                    <Badge variant="default" className="uppercase font-bold tracking-widest text-[10px]">Admin</Badge>
                  )}
                </div>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Mail size={14} /> {profile.id}
                </p>
              </div>
              <div className="w-full md:w-auto flex gap-3 pt-4 md:pt-0">
                <form action={logout}>
                  <Button variant="outline" className="w-full md:w-auto font-bold uppercase tracking-widest text-xs gap-2">
                    <LogOut size={14} /> Đăng xuất
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <div className="overflow-x-auto pb-2 scrollbar-hide mb-8">
              <TabsList className="grid w-[600px] grid-cols-3 bg-background border shadow-sm rounded-2xl p-1">
                <TabsTrigger value="general" className="rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary group-data-[variant=default]/tabs-list:data-active:shadow-none">Thông tin chung</TabsTrigger>
                <TabsTrigger value="orders" className="rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary group-data-[variant=default]/tabs-list:data-active:shadow-none">Đơn hàng</TabsTrigger>
                <TabsTrigger value="photype" className="rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary group-data-[variant=default]/tabs-list:data-active:shadow-none">Pho Type</TabsTrigger>
              </TabsList>
            </div>

            {/* TAB: THÔNG TIN CHUNG */}
            <TabsContent value="general" className="space-y-6 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-background/60 backdrop-blur-xl">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <ShieldCheck className="text-primary" size={20} /> Bảo mật & Tài khoản
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-xl"><User className="h-5 w-5 text-muted-foreground" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Họ và tên</p>
                          <p className="font-semibold">{profile.full_name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-xl"><Calendar className="h-5 w-5 text-muted-foreground" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Ngày tham gia</p>
                          <p className="font-semibold">{new Date(profile.created_at).toLocaleDateString('vi-VN')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-xl"><Award className="h-5 w-5 text-muted-foreground" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Hạng thành viên</p>
                          <p className="font-semibold text-primary">Pho Member</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-background/60 backdrop-blur-xl flex flex-col justify-center items-center text-center p-8">
                  <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Package className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">{orders?.length || 0}</h3>
                  <p className="text-muted-foreground font-medium mb-6">Đơn hàng đã đặt</p>
                  <Link href="/products" className={buttonVariants({ variant: "outline", className: "rounded-xl font-bold uppercase tracking-widest text-xs" })}>
                    Tiếp tục mua sắm
                  </Link>
                </Card>
              </div>
            </TabsContent>

            {/* TAB: ĐƠN HÀNG */}
            <TabsContent value="orders" className="focus-visible:outline-none">
              <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-background">
                <CardHeader className="bg-muted/30 border-b pb-6">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Package className="text-primary" /> Lịch sử đơn hàng
                  </CardTitle>
                  <CardDescription>Theo dõi và quản lý các đơn hàng bạn đã đặt mua.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {orders && orders.length > 0 ? (
                    <div className="divide-y">
                      {orders.map((order: any) => (
                        <div key={order.id} className="p-6 hover:bg-muted/20 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                              <p className="font-bold text-lg">Mã đơn: <span className="font-mono text-primary">#{order.id.split('-')[0]}</span></p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock size={14} /> {new Date(order.created_at).toLocaleString('vi-VN')}
                              </p>
                            </div>
                            <div className="flex flex-col md:items-end gap-2">
                              <Badge variant={order.status === 'completed' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="w-fit uppercase font-bold tracking-widest text-[10px] px-3 py-1">
                                {order.status === 'pending' ? 'Đang xử lý' : order.status === 'processing' ? 'Đang giao' : order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                              </Badge>
                              <p className="text-xl font-black text-primary">{order.total_amount.toLocaleString('vi-VN')}đ</p>
                            </div>
                          </div>
                          
                          <div className="bg-muted/30 rounded-2xl p-4 space-y-4">
                            {order.order_items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-background rounded-xl overflow-hidden flex-shrink-0 border relative">
                                  {item.products?.images?.[0] ? (
                                    <Image src={item.products.images[0]} alt={item.products.name} fill className="object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Package className="text-muted-foreground opacity-20" /></div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Link href={`/products/${item.product_id}`} className="font-bold text-sm md:text-base hover:text-primary transition-colors line-clamp-1">
                                    {item.products?.name || 'Sản phẩm không tồn tại'}
                                  </Link>
                                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                    <span>SL: {item.quantity}</span>
                                    <span>Đơn giá: {item.price_at_time.toLocaleString('vi-VN')}đ</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 flex flex-col md:flex-row gap-4 md:items-center text-sm text-muted-foreground bg-primary/5 rounded-xl p-4 border border-primary/10">
                            <div className="flex items-start gap-2">
                              <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                              <span><strong className="text-foreground">Giao đến:</strong> {order.shipping_address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="flex-shrink-0 text-primary" />
                              <span><strong className="text-foreground">SĐT:</strong> {order.phone_number}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                      <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Package className="h-10 w-10 text-muted-foreground opacity-50" />
                      </div>
                      <p className="text-lg font-bold mb-2">Chưa có đơn hàng nào</p>
                      <p className="text-muted-foreground mb-6 max-w-sm">Bạn chưa thực hiện giao dịch nào trên PhoGear. Khám phá các sản phẩm tuyệt vời ngay hôm nay!</p>
                      <Link href="/products" className={buttonVariants({ className: "rounded-xl font-bold uppercase tracking-widest text-xs h-12 px-8" })}>
                        Mua sắm ngay
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: PHO TYPE */}
            <TabsContent value="photype" className="space-y-6 focus-visible:outline-none">
              {/* Thống kê tổng quan */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm rounded-2xl bg-background">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                      <Activity size={24} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Tổng lượt gõ</p>
                    <p className="text-2xl font-black">{totalRaces}</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-2xl bg-background">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mb-3">
                      <Zap size={24} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">WPM Cao nhất</p>
                    <p className="text-2xl font-black">{bestWpm}</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-2xl bg-background">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-3">
                      <ShieldCheck size={24} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Độ chính xác TB</p>
                    <p className="text-2xl font-black">{avgAccuracy}%</p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm rounded-2xl bg-background">
                  <CardContent className="p-6 text-center flex flex-col justify-center h-full">
                    <Link href="/photype" className={buttonVariants({ variant: "default", className: "w-full h-full min-h-[80px] rounded-xl font-bold uppercase tracking-widest text-xs flex flex-col gap-2" })}>
                      <Keyboard size={24} />
                      Luyện tập ngay
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Lịch sử */}
              <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-background">
                <CardHeader className="border-b pb-6">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Award className="text-primary" /> Lịch sử gõ phím gần đây
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {scores && scores.length > 0 ? (
                    <div className="divide-y">
                      {scores.map((score) => (
                        <div key={score.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-muted/20 transition-colors">
                          <div className="flex items-center gap-4 md:gap-8">
                            <div className="text-center w-16">
                              <p className="text-2xl md:text-3xl font-black text-primary leading-none">{score.wpm}</p>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1 tracking-widest">WPM</p>
                            </div>
                            <div className="text-center w-16 border-l pl-4 md:pl-8">
                              <p className="text-xl md:text-2xl font-bold leading-none">{score.accuracy}%</p>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1 tracking-widest">Chính xác</p>
                            </div>
                            <div className="hidden md:block pl-8 border-l">
                              <Badge variant="outline" className="font-mono text-[10px]">{score.mode || 'time_vi'}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm md:text-base text-primary uppercase tracking-wider">{score.rank_name}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-1">
                              <Clock size={12} /> {new Date(score.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                      <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Keyboard className="h-10 w-10 text-muted-foreground opacity-50" />
                      </div>
                      <p className="text-lg font-bold mb-2">Chưa có dữ liệu</p>
                      <p className="text-muted-foreground mb-6">Tham gia Pho Type để kiểm tra tốc độ gõ phím của bạn và leo rank!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
          </Tabs>

        </div>
      </main>
    </div>
  )
}
