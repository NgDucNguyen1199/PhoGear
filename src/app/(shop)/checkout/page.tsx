'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { createOrder, OrderItemInput } from '@/actions/orders'
import { getUser } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Loader2, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="bg-green-100 p-6 rounded-full mb-6">
          <CheckCircle2 className="h-20 w-20 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Đặt hàng thành công!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Cảm ơn bạn đã tin tưởng Pho Gear. Đơn hàng của bạn đang được xử lý.
        </p>
        <div className="flex gap-4">
          <Link href="/">
            <Button size="lg">Về trang chủ</Button>
          </Link>
          <Link href="/orders">
            <Button size="lg" variant="outline">Xem đơn hàng</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
        <Link href="/">
          <Button>Quay lại mua sắm</Button>
        </Link>
      </div>
    )
  }

  const handleCheckout = async (formData: FormData) => {
    setIsLoading(true)
    
    const orderItems: OrderItemInput[] = items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: item.price
    }))

    const result = await createOrder(formData, orderItems)

    if (result.error) {
      toast.error(result.error)
      setIsLoading(false)
    } else {
      toast.success(result.success)
      clearCart()
      setIsSuccess(true)
    }
  }

  const formattedTotal = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(getTotalPrice())

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại giỏ hàng
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form thông tin */}
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-bold mb-6">Thông tin giao hàng</h2>
          <form action={handleCheckout} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Họ và tên người nhận</Label>
                <Input key={user?.id || 'guest'} id="fullName" name="fullName" defaultValue={user?.user_metadata?.full_name || ''} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" name="phone" placeholder="Ví dụ: 0987654321" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Địa chỉ nhận hàng</Label>
                <Input id="address" name="address" placeholder="Số nhà, tên đường, phường/xã..." required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note">Ghi chú (Tùy chọn)</Label>
                <Input id="note" name="note" placeholder="Ví dụ: Giao giờ hành chính" />
              </div>
            </div>

            <Card className="bg-muted/30 border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Thanh toán khi nhận hàng (COD)
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Hiện tại chúng tôi chỉ hỗ trợ thanh toán COD. Cảm ơn sự thông cảm của bạn.
                </p>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full py-6 text-lg font-bold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              XÁC NHẬN ĐẶT HÀNG
            </Button>
          </form>
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="lg:col-span-5">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Tóm tắt đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 rounded border bg-muted flex-shrink-0">
                      {item.images_url?.[0] && (
                        <Image src={item.images_url[0]} alt={item.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng tiền</span>
                  <span className="text-primary">{formattedTotal}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
