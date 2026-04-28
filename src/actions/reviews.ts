'use server'

import { createClient } from '@/lib/supabase/server'
import { Review } from '@/types'
import { revalidatePath } from 'next/cache'

export async function getProductReviews(productId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data as Review[]
}

export async function submitReview(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Bạn cần đăng nhập để đánh giá' }

  const productId = formData.get('productId') as string
  const rating = parseInt(formData.get('rating') as string)
  const comment = formData.get('comment') as string
  const imageFiles = formData.getAll('images') as File[]

  if (!productId || !rating) return { error: 'Thiếu thông tin đánh giá' }

  const imageUrls: string[] = []

  // Upload images if any
  for (const file of imageFiles) {
    if (file.size === 0) continue
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}/${user.id}/${Math.random()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reviews')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      continue
    }

    const { data: { publicUrl } } = supabase.storage
      .from('reviews')
      .getPublicUrl(fileName)
    
    imageUrls.push(publicUrl)
  }

  const { error } = await supabase
    .from('reviews')
    .upsert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
      images_url: imageUrls,
      created_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error submitting review:', error)
    return { error: 'Không thể gửi đánh giá. Có thể bạn đã đánh giá sản phẩm này rồi.' }
  }

  revalidatePath(`/products/${productId}`)
  return { success: 'Cảm ơn bạn đã đánh giá sản phẩm!' }
}

export async function deleteReview(reviewId: string, productId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Bạn cần đăng nhập' }

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting review:', error)
    return { error: 'Không thể xóa đánh giá' }
  }

  revalidatePath(`/products/${productId}`)
  return { success: 'Đã xóa đánh giá' }
}
