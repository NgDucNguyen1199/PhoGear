'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore, getCartItemId } from '@/store/cartStore'
import { createOrder, OrderItemInput } from '@/actions/orders'
import { getUser } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Loader2, 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User as UserIcon,
  MessageSquare,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const checkUser = async () => {
      const currentUser = await getUser()
      if (!currentUser) {
        toast.error('Vui lòng đăng nhập để tiếp tục thanh toán')
        router.push('/login?returnUrl=/checkout')
      } else {
        setUser(currentUser)
      }
    }
    checkUser()
  }, [router])

  if (!mounted) return null

  if (!user) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
        <div className="relative">
            <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <ShoppingBag className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Đang chuẩn bị thanh toán...</p>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
            <div className="relative bg-green-500 text-white p-6 rounded-full shadow-2xl shadow-green-500/20 scale-110">
              <CheckCircle2 className="h-16 w-16" />
            </div>
          </div>
          
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">Đặt hàng thành công!</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Cảm ơn bạn đã tin tưởng <span className="text-primary font-bold">Pho Gear</span>. 
            Mã đơn hàng của bạn là <span className="font-mono font-bold text-foreground bg-muted px-2 py-1 rounded">#{orderId?.slice(0, 8).toUpperCase()}</span>
          </p>
          <p className="text-muted-foreground mb-12 max-w-md mx-auto">
            Chúng tôi đã nhận được thông tin và sẽ sớm liên hệ với bạn để xác nhận đơn hàng trước khi giao.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/" className="w-full">
              <Button size="lg" variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest">
                Tiếp tục mua sắm
              </Button>
            </Link>
            <Link href="/orders" className="w-full">
              <Button size="lg" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                Theo dõi đơn hàng
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Giỏ hàng của bạn đang trống</h1>
        <p className="text-muted-foreground mb-8">Hãy chọn cho mình những chiếc bàn phím ưng ý trước khi thanh toán nhé!</p>
        <Link href="/products">
          <Button className="h-12 px-8 rounded-xl font-bold uppercase tracking-wider">Quay lại mua sắm</Button>
        </Link>
      </div>
    )
  }

  const handleCheckout = async (formData: FormData) => {
    const orderItems: OrderItemInput[] = items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: item.price,
      selected_options: item.selectedOptions
    }))

    startTransition(async () => {
        const result = await createOrder(formData, orderItems)
        if (result.error) {
            toast.error(result.error)
        } else {
            setOrderId(result.orderId || null)
            toast.success(result.success)
            clearCart()
            setIsSuccess(true)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    })
  }

  const subtotal = getTotalPrice()
  const shippingFee = 0 // Miễn phí vận chuyển
  const total = subtotal + shippingFee

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  return (
    <div className="bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <Link href="/" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-2">
                        <ArrowLeft className="mr-2 h-3 w-3" /> Quay lại cửa hàng
                    </Link>
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">Thanh toán</h1>
                </div>
                
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-background px-4 py-2 rounded-full border shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Thanh toán bảo mật 100%
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form thông tin */}
                <div className="lg:col-span-7 space-y-6">
                    <form action={handleCheckout}>
                        <div className="space-y-6">
                            {/* Section: Thông tin cá nhân */}
                            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="bg-muted/50 border-b pb-4">
                                    <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-primary" /> Thông tin giao hàng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest opacity-70">Họ và tên người nhận</Label>
                                            <Input 
                                                id="fullName" 
                                                name="fullName" 
                                                defaultValue={user?.full_name || ''} 
                                                required 
                                                className="h-12 bg-muted/20 border-white/10 rounded-xl focus:ring-primary"
                                                placeholder="Nhập tên người nhận"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest opacity-70">Số điện thoại</Label>
                                            <Input 
                                                id="phone" 
                                                name="phone" 
                                                placeholder="Ví dụ: 0987654321" 
                                                required 
                                                className="h-12 bg-muted/20 border-white/10 rounded-xl focus:ring-primary"
                                                type="tel"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest opacity-70">Địa chỉ nhận hàng</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50" />
                                            <Input 
                                                id="address" 
                                                name="address" 
                                                placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố..." 
                                                required 
                                                className="h-12 pl-10 bg-muted/20 border-white/10 rounded-xl focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="note" className="text-[10px] font-black uppercase tracking-widest opacity-70">Ghi chú đơn hàng (Tùy chọn)</Label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50" />
                                            <Input 
                                                id="note" 
                                                name="note" 
                                                placeholder="Ví dụ: Giao sau 18h hoặc gọi trước khi giao..." 
                                                className="h-12 pl-10 bg-muted/20 border-white/10 rounded-xl focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Section: Phương thức thanh toán */}
                            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="bg-muted/50 border-b pb-4">
                                    <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" /> Phương thức thanh toán
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="relative border-2 border-primary bg-primary/5 rounded-2xl p-6 flex items-start gap-4 cursor-default">
                                        <div className="bg-primary text-white p-2 rounded-full">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-sm">Thanh toán khi nhận hàng (COD)</h4>
                                                <div className="h-5 w-5 rounded-full border-4 border-primary bg-white shadow-inner" />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                Bạn sẽ chỉ thanh toán sau khi nhận được hàng và kiểm tra sản phẩm.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-[10px] font-bold uppercase tracking-wider text-yellow-700 text-center">
                                        Dịch vụ thanh toán chuyển khoản đang được nâng cấp
                                    </div>
                                </CardContent>
                            </Card>

                            <Button 
                                type="submit" 
                                className="w-full h-16 text-lg font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                        Đang xử lý đơn hàng...
                                    </>
                                ) : (
                                    <>
                                        Xác nhận đặt hàng <ChevronRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="lg:col-span-5">
                    <Card className="sticky top-24 border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-background">
                        <CardHeader className="bg-slate-900 text-white pb-6 pt-8">
                            <CardTitle className="flex items-center justify-between font-black uppercase tracking-tight">
                                <span className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" /> Đơn hàng</span>
                                <span className="text-xs font-bold text-slate-400">{items.length} sản phẩm</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="max-h-[350px] overflow-y-auto pr-2 -mx-2 px-2 space-y-4 custom-scrollbar">
                                {items.map((item) => {
                                    const cartId = getCartItemId(item.id, item.selectedOptions)
                                    return (
                                        <div key={cartId} className="flex gap-4 group">
                                            <div className="relative h-16 w-16 rounded-2xl border bg-muted flex-shrink-0 overflow-hidden group-hover:border-primary transition-colors">
                                                {item.images_url?.[0] && (
                                                    <Image src={item.images_url[0]} alt={item.name} fill className="object-cover transition-transform group-hover:scale-110" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.name}</p>
                                                {item.selectedOptions && (
                                                    <div className="flex flex-wrap gap-x-2 text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">
                                                        {Object.entries(item.selectedOptions).map(([k, v]) => (
                                                            <span key={k} className="bg-muted px-1.5 py-0.5 rounded-sm">{v}</span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-[10px] font-black text-muted-foreground">SL: {item.quantity}</span>
                                                    <span className="text-sm font-black">{formatPrice(item.price)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            <Separator className="bg-muted/50" />
                            
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Tạm tính</span>
                                    <span className="font-bold">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Vận chuyển</span>
                                    <span className="text-green-600 font-black uppercase text-[10px]">Miễn phí</span>
                                </div>
                                <div className="bg-primary/5 p-4 rounded-2xl mt-4 border border-primary/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black uppercase tracking-[0.2em] italic">Tổng cộng</span>
                                        <span className="text-2xl font-black text-primary drop-shadow-sm tracking-tighter">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-2xl border border-dashed">
                                    <Truck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-muted-foreground leading-relaxed uppercase font-bold">
                                        Thời gian giao hàng dự kiến từ <span className="text-foreground">2-4 ngày làm việc</span> tùy vào vị trí địa lý của bạn.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  )
}
