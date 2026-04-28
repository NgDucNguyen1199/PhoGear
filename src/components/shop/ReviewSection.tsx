'use client'

import { useState, useEffect } from 'react'
import { Review, Product } from '@/types'
import { getProductReviews } from '@/actions/reviews'
import { ReviewForm } from './ReviewForm'
import { Star, MessageSquare, User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'

interface ReviewSectionProps {
  product: Product
  userId?: string
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

export function ReviewSection({ product, userId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchReviews = async () => {
    setIsLoading(true)
    const data = await getProductReviews(product.id)
    setReviews(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchReviews()
  }, [product.id])

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-background rounded-2xl p-8 border shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight">Đánh giá sản phẩm</h2>
          <p className="text-muted-foreground">Khách hàng nói gì về {product.name}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-black text-primary">{averageRating}</div>
            <div className="flex gap-0.5 mt-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(Number(averageRating))
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs font-bold uppercase text-muted-foreground mt-2">{reviews.length} đánh giá</div>
          </div>
          
          <Separator orientation="vertical" className="h-16" />
          
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => r.rating === star).length
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-3 font-bold">{star}</span>
                  <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4">Viết đánh giá</h3>
            {userId ? (
              <ReviewForm productId={product.id} onSuccess={fetchReviews} />
            ) : (
              <div className="bg-muted/30 p-6 rounded-2xl border border-dashed text-center space-y-4">
                <p className="text-sm text-muted-foreground">Bạn cần đăng nhập để đánh giá sản phẩm này</p>
                <a href="/login" className="inline-block text-primary font-bold uppercase text-xs hover:underline">
                  Đăng nhập ngay
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-lg font-bold uppercase tracking-wider">Tất cả đánh giá ({reviews.length})</h3>
          
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full" />
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-muted rounded" />
                      <div className="w-24 h-3 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="w-full h-20 bg-muted rounded-xl" />
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="group space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={review.profiles?.avatar_url || ''} />
                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-sm">{review.profiles?.full_name || 'Người dùng'}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? 'fill-yellow-500 text-yellow-500'
                                    : 'text-muted-foreground/30'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pl-14 space-y-4">
                    <p className="text-muted-foreground leading-relaxed italic">
                      &quot;{review.comment}&quot;
                    </p>

                    {review.images_url && review.images_url.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {review.images_url.map((img, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border bg-muted group-hover:border-primary/30 transition-colors">
                            <Image 
                              src={img} 
                              alt={`Review image ${idx + 1}`} 
                              fill 
                              className="object-cover hover:scale-110 transition-transform duration-500" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Separator className="opacity-50" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
              <p className="text-sm text-muted-foreground/60">Hãy là người đầu tiên đánh giá!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
