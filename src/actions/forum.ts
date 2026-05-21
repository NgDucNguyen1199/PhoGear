'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Post, PostComment } from '@/types'

/**
 * Lấy danh sách các bài viết đã được duyệt
 */
export async function getApprovedPosts(currentUserId?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles (full_name, avatar_url),
      comments (count),
      likes:post_likes (count)
      ${currentUserId ? `, user_liked:post_likes!left(user_id)` : ''}
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (currentUserId) {
    query = query.eq('user_liked.user_id', currentUserId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching approved posts:', error.message, error.details, error.hint)
    return []
  }

  return data.map(post => ({
    ...post,
    likes_count: post.likes?.[0]?.count || 0,
    is_liked: currentUserId ? (post.user_liked && post.user_liked.length > 0) : false
  }))
}

/**
 * Thả tim hoặc Bỏ tim bài viết
 */
export async function toggleLikePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Bạn cần đăng nhập để thả tim.' }

  // Kiểm tra xem đã like chưa
  const { data: existingLike } = await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existingLike) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
    
    if (error) return { error: error.message }
    return { success: 'Đã bỏ tim', action: 'removed' }
  } else {
    const { error } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: user.id })

    if (error) return { error: error.message }
    return { success: 'Đã thả tim', action: 'added' }
  }
}

/**
 * Lấy chi tiết bài viết và bình luận
 */
export async function getPostById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (full_name, avatar_url),
      comments (
        *,
        profiles (full_name, avatar_url)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching post detail:', error)
    return null
  }

  return data as any
}

/**
 * Tạo bài viết mới (Mặc định ở trạng thái pending)
 */
export async function createPost(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Bạn cần đăng nhập để đăng bài.' }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const images_url_str = formData.get('images_url') as string
  
  const images_url = images_url_str 
    ? images_url_str.split(',').map(url => url.trim()).filter(Boolean)
    : []

  if (!title || !content) {
    return { error: 'Vui lòng nhập đầy đủ tiêu đề và nội dung.' }
  }

  const { error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      title,
      content,
      images_url,
      status: 'pending'
    })

  if (error) {
    return { error: `Lỗi đăng bài: ${error.message}` }
  }

  revalidatePath('/forum')
  return { success: 'Bài viết của bạn đã được gửi và đang chờ Admin duyệt!' }
}

/**
 * Gửi bình luận cho bài viết
 */
export async function addComment(postId: string, content: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Bạn cần đăng nhập để bình luận.' }

  if (!content.trim()) return { error: 'Nội dung bình luận không được để trống.' }

  const { error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      author_id: user.id,
      content
    })

  if (error) {
    return { error: `Lỗi bình luận: ${error.message}` }
  }

  revalidatePath(`/forum/${postId}`)
  return { success: 'Đã gửi bình luận!' }
}

/**
 * Lấy danh sách bài viết đang chờ duyệt (Dành cho Admin)
 */
export async function adminGetPendingPosts() {
  const supabase = await createClient()
  
  // Kiểm tra quyền Admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id || '').single()
  
  if (profile?.role !== 'admin') {
    return []
  }

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (full_name, avatar_url)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching pending posts:', error)
    return []
  }

  return data as any[]
}

/**
 * Phê duyệt hoặc Từ chối bài viết (Dành cho Admin)
 */
export async function adminModeratePost(postId: string, status: 'approved' | 'rejected') {
  const supabase = await createClient()

  // Kiểm tra quyền Admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id || '').single()
  
  if (profile?.role !== 'admin') {
    return { error: 'Bạn không có quyền thực hiện thao tác này.' }
  }
  
  const { error } = await supabase
    .from('posts')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', postId)

  if (error) {
    return { error: `Lỗi cập nhật trạng thái: ${error.message}` }
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
  revalidatePath('/')
  return { success: `Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} bài viết thành công!` }
}
