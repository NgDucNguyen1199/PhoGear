'use client'

import { useState, useTransition } from 'react'
import { Star, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { submitReview } from '@/actions/reviews'
import { toast } from 'sonner'
import Image from 'next/image'

interface ReviewFormProps {
  productId: string
  onSuccess?: () => void
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      toast.error('Chỉ được tải lên tối đa 5 hình ảnh')
      return
    }

    setImages(prev => [...prev, ...files])
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index])
      return newPreviews.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá')
      return
    }

    const formData = new FormData()
    formData.append('productId', productId)
    formData.append('rating', rating.toString())
    formData.append('comment', comment)
    images.forEach(image => {
      formData.append('images', image)
    })

    startTransition(async () => {
      const result = await submitReview(formData)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.success)
        setComment('')
        setImages([])
        setPreviews([])
        setRating(5)
        if (onSuccess) onSuccess()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-muted/30 p-6 rounded-2xl border border-white/5">
      <div className="space-y-2">
        <Label className="text-sm font-bold uppercase tracking-wider">Đánh giá của bạn</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-500 text-yellow-500'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment" className="text-sm font-bold uppercase tracking-wider">Nhận xét</Label>
        <Textarea
          id="comment"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[120px] bg-background border-white/10 focus:border-primary/50 rounded-xl"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-bold uppercase tracking-wider">Hình ảnh thực tế (Tối đa 5)</Label>
        <div className="flex flex-wrap gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 group">
              <Image src={preview} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {previews.length < 5 && (
            <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-[10px] mt-2 font-bold uppercase text-muted-foreground">Thêm ảnh</span>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full font-bold uppercase tracking-widest h-12 rounded-xl"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang gửi...
          </>
        ) : 'Gửi đánh giá'}
      </Button>
    </form>
  )
}
