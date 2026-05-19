'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Loader2, ArrowLeft, Image as ImageIcon, Send } from 'lucide-react'
import { createPost } from '@/actions/forum'
import { toast } from 'sonner'
import Link from 'next/link'

export default function CreatePostPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await createPost(formData)
    
    setIsLoading(false)
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
      router.push('/forum')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/forum" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 font-black uppercase tracking-widest text-[10px] transition-colors">
            <ArrowLeft size={14} /> Quay lại diễn đàn
          </Link>

          <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-background">
            <CardHeader className="bg-primary/5 p-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-2">
                <PlusCircle size={32} />
              </div>
              <CardTitle className="text-4xl font-black uppercase tracking-tighter italic">Chia sẻ bản Build của bạn</CardTitle>
              <CardDescription className="text-muted-foreground font-medium text-lg">
                Hãy kể cho cộng đồng nghe về quá trình bạn tạo ra chiếc bàn phím ưng ý nhất.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest ml-1">Tiêu đề bài viết</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ví dụ: Review nhanh bộ Keycap GMK Botanical sau 1 tháng sử dụng"
                    className="h-16 rounded-2xl text-lg font-bold border-2 focus-visible:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="images_url" className="text-xs font-black uppercase tracking-widest ml-1">Link hình ảnh (ngăn cách bằng dấu phẩy)</Label>
                  <Input
                    id="images_url"
                    name="images_url"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    className="h-14 rounded-2xl border-2 font-mono text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground italic flex items-center gap-1.5 ml-1">
                    <ImageIcon size={10} /> Bạn có thể dán link ảnh từ Unsplash, Imgur hoặc bất kỳ nguồn nào.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="content" className="text-xs font-black uppercase tracking-widest ml-1">Nội dung chi tiết</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Chia sẻ về các thành phần (Kit, Switch, Keycap), cảm giác gõ, âm thanh và những khó khăn bạn gặp phải..."
                    className="min-h-[300px] rounded-3xl p-6 text-base font-medium border-2 leading-relaxed focus-visible:ring-primary"
                    required
                  />
                </div>

                <div className="pt-4">
                    <Button type="submit" className="w-full h-20 rounded-[2rem] font-black uppercase tracking-[0.2em] text-lg shadow-xl shadow-primary/20 gap-3 group" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="animate-spin h-6 w-6" />
                    ) : (
                        <>
                            Đăng bài ngay <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                    </Button>
                    <p className="text-center mt-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                        * Bài viết sẽ được Admin duyệt trước khi hiển thị công khai.
                    </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
