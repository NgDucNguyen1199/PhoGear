'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const result = await signup(formData)
    
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Link href="/">
          <Logo iconSize={40} textSize="text-4xl" />
        </Link>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
          <CardDescription>
            Tạo tài khoản mới để bắt đầu mua sắm tại Pho Gear
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input id="fullName" name="fullName" type="text" placeholder="Nguyễn Văn A" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng ký
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Đăng nhập ngay
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
