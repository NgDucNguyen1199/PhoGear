'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck, Smartphone, Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { enrollMfa, verifyMfaChallenge, getMfaFactors, unenrollMfa } from '@/actions/auth'

export function MfaSetup() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: Info/Current Status, 2: QR, 3: Verify, 4: Success
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [factorId, setFactorId] = useState('')
  const [activeFactors, setActiveFactors] = useState<any[]>([])

  useEffect(() => {
    fetchFactors()
  }, [])

  const fetchFactors = async () => {
    const factors = await getMfaFactors()
    setActiveFactors(factors.all.filter((f: any) => f.status === 'verified'))
  }

  const startSetup = async () => {
    setIsLoading(true)
    const result = await enrollMfa()
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    if (result?.data) {
      setQrCode(result.data.totp.qr_code)
      setFactorId(result.data.id)
      setStep(2)
    }
  }

  const verifyCode = async () => {
    if (code.length !== 6) {
      toast.error('Mã xác thực phải có 6 chữ số.')
      return
    }

    setIsLoading(true)
    const result = await verifyMfaChallenge(factorId, code)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else if (result) {
      setStep(4)
      toast.success('Xác thực 2 lớp đã được kích hoạt!')
      fetchFactors()
    }
  }

  const handleDisable = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn tắt xác thực 2 lớp?')) return

    setIsLoading(true)
    const result = await unenrollMfa(id)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else if (result) {
      toast.success('Đã tắt xác thực 2 lớp.')
      fetchFactors()
    }
  }

  const reset = () => {
    setIsOpen(false)
    setTimeout(() => {
      setStep(1)
      setCode('')
      setQrCode('')
      setFactorId('')
    }, 300)
  }

  return (
    <>
      {activeFactors.length > 0 ? (
        <div className="space-y-4 w-full">
          <div className="p-4 border rounded-2xl bg-green-500/5 border-green-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <div>
                <p className="font-bold text-sm text-green-700">2FA Đang hoạt động</p>
                <p className="text-xs text-green-600/80">Tài khoản của bạn đang được bảo vệ.</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDisable(activeFactors[0].id)}
              disabled={isLoading}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 font-bold text-[10px] uppercase tracking-wider"
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : 'Vô hiệu hóa'}
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          className="w-full rounded-xl font-bold uppercase tracking-widest text-xs h-12"
        >
          Thiết lập 2FA
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="text-primary" size={20} /> Thiết lập xác thực 2 lớp
            </DialogTitle>
          </DialogHeader>

          {step === 1 && (
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Smartphone className="h-10 w-10 text-primary" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="font-bold text-lg">Bảo vệ tài khoản của bạn</p>
                <p className="text-sm text-muted-foreground">
                  Xác thực 2 lớp thêm một lớp bảo mật bằng cách yêu cầu mã từ ứng dụng xác thực trên điện thoại của bạn.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 text-sm items-start p-3 bg-muted/50 rounded-xl">
                  <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</div>
                  <p>Cài đặt Google Authenticator hoặc Authy trên điện thoại.</p>
                </div>
                <div className="flex gap-3 text-sm items-start p-3 bg-muted/50 rounded-xl">
                  <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</div>
                  <p>Quét mã QR được cung cấp trong bước tiếp theo.</p>
                </div>
              </div>
              <Button onClick={startSetup} disabled={isLoading} className="w-full rounded-xl font-bold uppercase tracking-widest text-xs h-12">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Bắt đầu thiết lập'}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">Quét mã QR dưới đây bằng ứng dụng xác thực của bạn:</p>
              </div>
              <div className="flex justify-center p-4 bg-white rounded-2xl border-4 border-muted">
                {qrCode ? (
                  <img src={qrCode} alt="MFA QR Code" className="h-48 w-48" />
                ) : (
                  <div className="h-48 w-48 flex items-center justify-center bg-muted animate-pulse rounded-lg">
                    <Loader2 className="animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-3 items-start">
                <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">Sau khi quét xong, hãy nhấn Tiếp theo để nhập mã xác thực.</p>
              </div>
              <Button onClick={() => setStep(3)} className="w-full rounded-xl font-bold uppercase tracking-widest text-xs h-12">
                Tiếp theo
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <p className="font-bold text-lg">Nhập mã xác thực</p>
                <p className="text-sm text-muted-foreground">
                  Nhập mã 6 chữ số được hiển thị trong ứng dụng xác thực của bạn.
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Mã xác nhận</Label>
                  <Input 
                    id="code" 
                    placeholder="000000" 
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="text-center text-3xl h-16 font-black tracking-[0.5em] rounded-2xl border-2 focus:border-primary"
                  />
                </div>
              </div>
              <Button 
                onClick={verifyCode} 
                disabled={isLoading || code.length !== 6} 
                className="w-full rounded-xl font-bold uppercase tracking-widest text-xs h-12"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Xác nhận kích hoạt'}
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 py-8 text-center">
              <div className="flex justify-center">
                <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in duration-300" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Thành công!</h3>
                <p className="text-sm text-muted-foreground">
                  Xác thực 2 lớp đã được kích hoạt thành công. Tài khoản của bạn hiện đã được bảo vệ tối đa.
                </p>
              </div>
              <Button onClick={reset} className="w-full rounded-xl font-bold uppercase tracking-widest text-xs h-12">
                Đóng
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
