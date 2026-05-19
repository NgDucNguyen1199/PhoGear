'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updatePassword } from '@/actions/auth'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'

export function ChangePasswordDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await updatePassword(formData)
    
    setIsLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
      setOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="w-full rounded-xl font-bold uppercase tracking-widest text-xs h-12">
            Thay đổi mật khẩu
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight">Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Nhập mật khẩu mới của bạn bên dưới.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest ml-1">Mật khẩu mới</Label>
              <Input
                id="password"
                name="password"
                type="password"
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest ml-1">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="h-12 rounded-xl"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Cập nhật mật khẩu'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
