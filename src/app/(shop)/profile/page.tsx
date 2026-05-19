import { getProfile, logout } from '@/actions/auth'
import { getUserOrders } from '@/actions/orders'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { 
  User, Mail, Calendar, Award, Package, LogOut, 
  Clock, Zap, ShieldCheck, Activity, MapPin, Phone, Keyboard,
  Heart, Settings, ShoppingBag, Fingerprint
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

import { MfaSetup } from '@/components/shop/MfaSetup'
import { EditProfileDialog } from '@/components/shop/EditProfileDialog'
import { ChangePasswordDialog } from '@/components/shop/ChangePasswordDialog'
import { WishlistTab } from '@/components/shop/WishlistTab'

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
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Profile */}
          <div className="relative rounded-[2.5rem] overflow-hidden bg-background border shadow-xl">
            <div className="h-40 md:h-64 bg-gradient-to-br from-primary via-primary/80 to-primary/40 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
            </div>
            <div className="px-6 md:px-12 pb-10 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 md:-mt-24 relative z-10 text-center md:text-left">
              <div className="h-32 w-32 md:h-44 md:w-44 rounded-full border-[6px] border-background bg-muted flex items-center justify-center text-primary text-6xl font-black shadow-2xl overflow-hidden relative group">
                {profile.avatar_url && (profile.avatar_url.includes('supabase.co') || profile.avatar_url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) ? (
                    <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" unoptimized={!profile.avatar_url.includes('supabase.co')} />
                ) : (
                    <span className="relative z-10">{profile.full_name?.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 space-y-2 mb-2">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground drop-shadow-sm">{profile.full_name}</h1>
                  {profile.role === 'admin' && (
                    <Badge variant="default" className="w-fit mx-auto md:mx-0 uppercase font-black tracking-[0.2em] text-[10px] bg-primary text-primary-foreground px-3 py-1 rounded-full">Admin</Badge>
                  )}
                </div>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 text-base font-medium">
                  <Mail size={16} className="text-primary" /> {profile.email || 'Email chưa cập nhật'}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 md:pt-0">
                <EditProfileDialog profile={profile} />
                <form action={logout}>
                  <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut size={20} />
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-hide">
              <TabsList className="flex h-auto gap-2 md:gap-4 bg-transparent p-0 w-full md:w-auto justify-between md:justify-center">
                {[
                    { value: 'general', label: 'Hồ sơ', icon: User },
                    { value: 'orders', label: 'Đơn hàng', icon: ShoppingBag },
                    { value: 'wishlist', label: 'Yêu thích', icon: Heart },
                    { value: 'photype', label: 'Pho Type', icon: Keyboard },
                    { value: 'security', label: 'Bảo mật', icon: ShieldCheck },
                ].map((tab) => (
                    <TabsTrigger 
                        key={tab.value}
                        value={tab.value} 
                        className="rounded-2xl font-bold uppercase tracking-widest text-[9px] md:text-[10px] w-[65px] md:w-[100px] h-[65px] md:h-[80px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-background border shadow-sm transition-all hover:bg-muted active:scale-95 flex flex-col items-center justify-center gap-1.5 shrink-0"
                    >
                        <tab.icon size={20} className="md:w-6 md:h-6" /> 
                        <span className="text-center leading-tight">{tab.label}</span>
                    </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* TAB: THÔNG TIN CHUNG */}
            <TabsContent value="general" className="space-y-8 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-xl rounded-[2rem] overflow-hidden bg-background">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 py-8 px-10">
                    <CardTitle className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
                      <Fingerprint className="text-primary" size={28} /> Thông tin cá nhân
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Họ và tên</p>
                          <p className="text-xl font-bold border-b pb-2">{profile.full_name}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Email liên kết</p>
                          <p className="text-xl font-bold border-b pb-2">{profile.email}</p>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Ngày gia nhập</p>
                          <p className="text-xl font-bold border-b pb-2">{new Date(profile.created_at).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Hạng thành viên</p>
                          <div className="flex items-center gap-2 text-xl font-bold text-primary">
                             <Award size={24} /> Pho Platinum
                          </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 relative">
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="h-20 w-20 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
                            <ShoppingBag className="h-10 w-10" />
                        </div>
                        <h3 className="text-4xl font-black mb-2">{orders?.length || 0}</h3>
                        <p className="text-primary-foreground/80 font-bold uppercase tracking-widest text-xs mb-8">Đơn hàng đã đặt</p>
                        <Link href="/products" className="w-full bg-white text-primary h-14 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-primary-foreground transition-colors shadow-lg shadow-black/10">
                            Tiếp tục mua sắm
                        </Link>
                      </div>
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShoppingBag size={120} />
                      </div>
                    </Card>

                    <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-background p-8 flex flex-col items-center text-center group hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/10">
                        <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Activity className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-1">Cấp độ</p>
                        <p className="text-2xl font-black italic">LEVEL 42</p>
                    </Card>
                </div>
              </div>
            </TabsContent>

            {/* TAB: BẢO MẬT */}
            <TabsContent value="security" className="space-y-8 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-background">
                <CardHeader className="bg-muted/30 border-b py-8 px-10">
                  <CardTitle className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
                    <ShieldCheck className="text-primary" size={28} /> Bảo vệ tài khoản
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="p-8 border-2 border-primary/10 rounded-[2rem] bg-primary/5 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <h4 className="font-black text-xl flex items-center gap-3">
                            <Zap className="text-orange-500" size={24} /> Xác thực 2FA
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-8 relative z-10 font-medium">
                          Tăng cường bảo mật bằng mã xác thực 6 chữ số từ ứng dụng điện thoại mỗi khi đăng nhập.
                        </p>
                        <div className="relative z-10">
                           <MfaSetup />
                        </div>
                        <ShieldCheck className="absolute -bottom-6 -right-6 text-primary/5 h-32 w-32 group-hover:scale-110 transition-transform" />
                      </div>

                      <div className="p-8 border-2 border-muted rounded-[2rem] hover:border-primary/20 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-black text-xl">Mật khẩu</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-8 font-medium">
                          Thay đổi mật khẩu định kỳ để giữ cho tài khoản của bạn luôn an toàn trước các rủi ro.
                        </p>
                        <ChangePasswordDialog />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <Card className="bg-muted/20 border-none rounded-[2rem] p-8">
                        <CardContent className="p-0 space-y-6">
                          <h5 className="font-black text-lg uppercase tracking-tight mb-4 flex items-center gap-2">
                             Lợi ích bảo mật
                          </h5>
                          <div className="space-y-6">
                            {[
                                { title: 'Chống xâm nhập', desc: 'Ngăn chặn 99.9% các cuộc tấn công chiếm quyền.', icon: ShieldCheck },
                                { title: 'An toàn giao dịch', desc: 'Bảo vệ thông tin thanh toán và địa chỉ giao hàng.', icon: ShoppingBag },
                                { title: 'Quyền riêng tư', desc: 'Đảm bảo dữ liệu cá nhân chỉ mình bạn truy cập.', icon: User },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-10 w-10 bg-background rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                        <item.icon className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm uppercase tracking-wider">{item.title}</p>
                                        <p className="text-xs text-muted-foreground font-medium mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: YÊU THÍCH */}
            <TabsContent value="wishlist" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
                        <Heart className="text-primary fill-primary" /> Sản phẩm yêu thích
                    </h2>
               </div>
               <WishlistTab />
            </TabsContent>

            {/* TAB: ĐƠN HÀNG */}
            <TabsContent value="orders" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-background">
                <CardHeader className="bg-muted/30 border-b py-8 px-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
                            <ShoppingBag className="text-primary" /> Lịch sử mua sắm
                        </CardTitle>
                        <CardDescription className="text-base font-medium mt-1">Tổng cộng {orders?.length || 0} giao dịch đã thực hiện.</CardDescription>
                    </div>
                    <Link href="/products" className={buttonVariants({ variant: "outline", className: "rounded-2xl font-black uppercase tracking-widest text-[10px] h-12" })}>
                        Mua sắm thêm
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {orders && orders.length > 0 ? (
                    <div className="divide-y divide-muted/50">
                      {orders.map((order: any) => (
                        <div key={order.id} className="p-8 md:p-12 hover:bg-primary/[0.02] transition-colors">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Đơn hàng</Badge>
                                <p className="font-mono text-xl font-bold tracking-tighter">#{order.id.split('-')[0].toUpperCase()}</p>
                              </div>
                              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-medium">
                                <p className="flex items-center gap-2"><Clock size={16} className="text-primary" /> {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                                <p className="flex items-center gap-2"><MapPin size={16} className="text-primary" /> {order.shipping_address}</p>
                              </div>
                            </div>
                            <div className="flex flex-col md:items-end gap-3">
                              <Badge variant={order.status === 'completed' ? 'default' : order.status === 'cancelled' ? 'destructive' : 'secondary'} className="w-fit uppercase font-black tracking-[0.2em] text-[10px] px-4 py-2 rounded-xl shadow-sm">
                                {order.status === 'pending' ? 'Đang xử lý' : order.status === 'processing' ? 'Đang giao' : order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                              </Badge>
                              <p className="text-3xl font-black text-primary tracking-tight">{order.total_amount.toLocaleString('vi-VN')}đ</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {order.order_items.map((item: any) => (
                              <div key={item.id} className="flex items-center gap-5 p-4 bg-muted/30 rounded-3xl border border-transparent hover:border-primary/10 transition-colors">
                                <div className="h-20 w-20 bg-background rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm relative">
                                {item.products?.images_url?.[0] ? (
                                    <Image src={item.products.images_url[0]} alt={item.products.name} fill className="object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Package className="text-muted-foreground opacity-20" /></div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Link href={`/products/${item.product_id}`} className="font-bold text-sm hover:text-primary transition-colors line-clamp-2 leading-tight">
                                    {item.products?.name}
                                  </Link>
                                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2 flex flex-wrap items-center gap-3">
                                    <span>SL: {item.quantity}</span>
                                    <span className="h-1 w-1 bg-muted-foreground rounded-full"></span>
                                    <span className="text-primary">{item.price_at_time.toLocaleString('vi-VN')}đ</span>
                                    {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                                      <>
                                        <span className="h-1 w-1 bg-muted-foreground rounded-full"></span>
                                        <div className="flex flex-wrap gap-1">
                                          {Object.entries(item.selected_options).map(([key, value]) => (
                                            <span key={key} className="text-[8px] font-bold text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded-full border border-primary/10">
                                              {key}: {String(value)}
                                            </span>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center flex flex-col items-center">
                      <div className="h-32 w-32 bg-muted rounded-[2rem] flex items-center justify-center mb-6">
                        <ShoppingBag className="h-14 w-14 text-muted-foreground opacity-30" />
                      </div>
                      <p className="text-2xl font-black mb-2 uppercase tracking-tight">Trống trải quá!</p>
                      <p className="text-muted-foreground mb-8 max-w-sm font-medium px-6">Bạn chưa thực hiện giao dịch nào. Hãy bắt đầu hành trình mua sắm bàn phím cơ ngay bây giờ.</p>
                      <Link href="/products" className={buttonVariants({ className: "rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] h-14 px-10 shadow-xl shadow-primary/20" })}>
                        Mua sắm ngay
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: PHO TYPE */}
            <TabsContent value="photype" className="space-y-8 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Thống kê tổng quan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Tổng lượt gõ', value: totalRaces, icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'WPM Cao nhất', value: bestWpm, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { label: 'Độ chính xác TB', value: `${avgAccuracy}%`, icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl rounded-3xl bg-background overflow-hidden relative group">
                        <CardContent className="p-8 text-center relative z-10">
                            <div className={`mx-auto h-16 w-16 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                <stat.icon size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
                            <p className="text-4xl font-black tracking-tight">{stat.value}</p>
                        </CardContent>
                        <div className={`absolute top-0 right-0 p-2 opacity-5 ${stat.color}`}>
                            <stat.icon size={80} />
                        </div>
                    </Card>
                ))}
                <Card className="border-none shadow-xl rounded-3xl bg-primary text-primary-foreground overflow-hidden group">
                  <CardContent className="p-0 h-full">
                    <Link href="/photype" className="w-full h-full flex flex-col items-center justify-center p-8 gap-3 group-hover:bg-primary/90 transition-colors">
                      <Keyboard size={40} className="group-hover:animate-bounce" />
                      <p className="font-black uppercase tracking-[0.2em] text-xs">Luyện tập ngay</p>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Lịch sử */}
              <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-background">
                <CardHeader className="border-b py-8 px-10">
                  <CardTitle className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
                    <Award className="text-primary" /> Bảng vàng thành tích
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {scores && scores.length > 0 ? (
                    <div className="divide-y divide-muted/50">
                      {scores.map((score) => (
                        <div key={score.id} className="p-6 md:p-8 flex items-center justify-between hover:bg-primary/[0.02] transition-colors">
                          <div className="flex items-center gap-6 md:gap-12">
                            <div className="text-center min-w-[80px]">
                              <p className="text-4xl md:text-5xl font-black text-primary leading-none tracking-tighter">{score.wpm}</p>
                              <p className="text-[10px] uppercase font-black text-muted-foreground mt-2 tracking-[0.2em]">WPM</p>
                            </div>
                            <div className="text-center min-w-[80px] border-l-2 border-muted pl-6 md:pl-12">
                              <p className="text-2xl md:text-3xl font-black leading-none tracking-tight">{score.accuracy}%</p>
                              <p className="text-[10px] uppercase font-black text-muted-foreground mt-2 tracking-[0.2em]">Chính xác</p>
                            </div>
                            <div className="hidden lg:block pl-12 border-l-2 border-muted">
                              <Badge variant="outline" className="font-mono text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-xl bg-muted/50 border-none">{score.mode?.replace('_', ' ') || 'TIME VI'}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-lg md:text-xl text-primary uppercase tracking-tighter italic">{score.rank_name || 'NOVICE'}</p>
                            <p className="text-[10px] text-muted-foreground mt-2 font-black uppercase tracking-widest flex items-center justify-end gap-2">
                              <Clock size={12} className="text-primary" /> {new Date(score.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center flex flex-col items-center">
                      <div className="h-32 w-32 bg-muted rounded-[2rem] flex items-center justify-center mb-6">
                        <Keyboard className="h-14 w-14 text-muted-foreground opacity-30" />
                      </div>
                      <p className="text-2xl font-black mb-2 uppercase tracking-tight">Chưa có kỷ lục!</p>
                      <p className="text-muted-foreground mb-8 max-w-sm font-medium px-6">Hãy tham gia Pho Type để khẳng định tốc độ ngón tay của bạn và leo lên bảng xếp hạng.</p>
                      <Link href="/photype" className={buttonVariants({ className: "rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] h-14 px-10 shadow-xl shadow-primary/20" })}>
                         Bắt đầu ngay
                      </Link>
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

