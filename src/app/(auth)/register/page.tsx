'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Mail, Lock, User, UserPlus, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { handleActionResponse } from '@/lib/error-handler'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: RegisterValues) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('fullName', values.fullName)
      formData.append('email', values.email)
      formData.append('password', values.password)

      const result = await signup(formData)
      
      handleActionResponse(result, {
        onSuccess: () => form.reset(),
        onError: () => setIsLoading(false)
      })
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="grid gap-5 pt-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            {...field}
                            type="text" 
                            placeholder="Nguyễn Văn A" 
                            className="pl-10 h-12 rounded-xl bg-muted/50 border-white/10 focus:bg-background transition-all"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            {...field}
                            type="email" 
                            placeholder="name@example.com" 
                            className="pl-10 h-12 rounded-xl bg-muted/50 border-white/10 focus:bg-background transition-all"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Mật khẩu
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            {...field}
                            type={showPassword ? "text" : "password"} 
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
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Xác nhận mật khẩu
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            {...field}
                            type={showConfirmPassword ? "text" : "password"} 
                            className="pl-10 pr-10 h-12 rounded-xl bg-muted/50 border-white/10 focus:bg-background transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
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
          </Form>
        </Card>

        <p className="mt-8 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} PHO GEAR - PREMIUM KEYBOARDS
        </p>
      </motion.div>
    </div>
  )
}
