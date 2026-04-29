'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await signup(formData)
      
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.success) {
        toast.success(result.success)
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-muted/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="mb-10 flex flex-col items-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo width={180} height={60} />
          </Link>
        </div>

        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-background/80 backdrop-blur-xl">
          <CardHeader className="space-y-2 pt-8 pb-6 text-center bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-3xl font-black tracking-tight uppercase">Đăng ký</CardTitle>
            <CardDescription className="text-sm font-medium">
              Tham gia cộng đồng <span className="text-primary font-bold">Pho Gear</span> ngay hôm nay
            </CardDescription>
          </CardHeader>

          <form action={handleSubmit}>
            <CardContent className="grid gap-5 pt-8">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Họ và tên
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    type="text" 
                    placeholder="Nguyễn Văn A" 
                    required 
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-white/10 focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    required 
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-white/10 focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="pl-10 pr-10 h-12 rounded-xl bg-muted/50 border-white/10 focus:bg-background transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-6 pb-8 pt-4">
              <Button 
                className="w-full h-12 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Tạo tài khoản <UserPlus size={16} />
                  </>
                )}
              </Button>

              <div className="text-xs text-center font-bold text-muted-foreground uppercase tracking-widest">
                Đã có tài khoản?{' '}
                <Link href="/login" className="text-primary hover:opacity-70 transition-opacity">
                  Đăng nhập ngay
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-8 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} PHO GEAR - PREMIUM KEYBOARDS
        </p>
      </motion.div>
    </div>
  )
}
