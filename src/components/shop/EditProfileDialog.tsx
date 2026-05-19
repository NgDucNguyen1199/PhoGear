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
import { updateProfile } from '@/actions/auth'
import { toast } from 'sonner'
import { Loader2, User, Camera } from 'lucide-react'

interface EditProfileDialogProps {
  profile: any
}

export function EditProfileDialog({ profile }: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(profile.avatar_url || '')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)
    
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
          <Button variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 h-10 px-4">
            <User size={14} /> Chỉnh sửa hồ sơ
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight">Cập nhật thông tin</DialogTitle>
          <DialogDescription>
            Thay đổi thông tin cá nhân của bạn tại đây. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            <div className="flex flex-col items-center gap-4 mb-2">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black border-4 border-muted relative group overflow-hidden">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        profile.full_name?.charAt(0)
                    )}
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <Camera className="text-white" size={24} />
                        <input 
                          type="file" 
                          id="avatar-upload" 
                          name="avatarFile" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                    </label>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nhấn vào ảnh để thay đổi</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-widest ml-1">Họ và tên</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={profile.full_name}
                className="h-12 rounded-xl"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="avatarUrl" className="text-xs font-bold uppercase tracking-widest ml-1">Link ảnh đại diện (Tùy chọn)</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                defaultValue={profile.avatar_url}
                className="h-12 rounded-xl"
                placeholder="Hoặc dán link ảnh tại đây"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
