'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyMfaChallenge } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { motion } from 'framer-motion'
import Link from 'next/link'

function MfaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const factorId = searchParams.get('factorId')
  
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!factorId) {
      router.push('/login')
    }
  }, [factorId, router])

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) {
      toast.error('Mã xác thực phải có 6 chữ số.')
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyMfaChallenge(factorId!, code)
      if (result.error) {
        toast.error(result.error)
        setIsLoading(false)
      } else {
        toast.success('Xác thực thành công!')
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.')
      setIsLoading(false)
    }
  }

  return (
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
          <CardTitle className="text-2xl font-black tracking-tight uppercase flex items-center justify-center gap-2">
            <ShieldCheck className="text-primary" /> Xác thực 2 lớp
          </CardTitle>
          <CardDescription className="text-sm font-medium">
            Vui lòng nhập mã xác thực từ ứng dụng của bạn
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleVerify}>
          <CardContent className="grid gap-6 pt-8">
            <div className="grid gap-4">
              <Label htmlFor="code" className="text-xs font-black uppercase tracking-widest text-muted-foreground text-center">
                Mã xác nhận (6 chữ số)
              </Label>
              <Input 
                id="code" 
                type="text" 
                placeholder="000000" 
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                required 
                autoFocus
                className="text-center text-3xl h-16 font-black tracking-[0.5em] rounded-2xl border-2 focus:border-primary bg-muted/30"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button 
              className="w-full h-12 rounded-xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2" 
              type="submit" 
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Xác nhận <ArrowRight size={16} />
                </>
              )}
            </Button>

            <Button 
              variant="ghost" 
              className="w-full h-10 rounded-xl font-bold uppercase tracking-widest text-[10px] text-muted-foreground gap-2"
              onClick={() => router.push('/login')}
              type="button"
            >
              <ArrowLeft size={14} /> Quay lại đăng nhập
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

export default function MfaPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden bg-muted/30">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
        <MfaContent />
      </Suspense>
    </div>
  )
}
