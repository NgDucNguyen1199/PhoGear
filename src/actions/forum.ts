'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Post, PostComment } from '@/types'
import { createNotification } from './notifications'
import { checkRateLimit } from './rate_limit'
import { logAuditAction } from './audit'

/**
 * Lấy danh sách các bài viết đã được duyệt
 */
export async function getApprovedPosts(currentUserId?: string) {
  const supabase = await createClient()
  
  // Lấy thông tin role của user hiện tại
  const { data: { user: authUser } } = await supabase.auth.getUser()
  let isAdmin = false
  if (authUser) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', authUser.id).single()
    isAdmin = profile?.role === 'admin'
  }

  console.log(`[DEBUG] Fetching posts. User: ${currentUserId}, IsAdmin: ${isAdmin}`)
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles (full_name, avatar_url),
      comments (count),
      likes:post_likes (count)
    `)
    .order('created_at', { ascending: false })

  if (isAdmin) {
    // Admin thấy TẤT CẢ bài viết (God Mode)
    console.log('[DEBUG] Admin God Mode activated for getApprovedPosts')
  } else if (currentUserId) {
    // User thấy bài đã duyệt HOẶC bài của chính mình
    query = query.or(`status.eq.approved,author_id.eq.${currentUserId}`)
  } else {
    // Khách vãng lai chỉ thấy bài đã duyệt
    query = query.eq('status', 'approved')
  }

  const { data, error } = await query

  if (error) {
    console.error('[DEBUG] Error fetching posts:', error)
    return []
  }

  console.log(`[DEBUG] Query result: ${data?.length || 0} posts found`)

  if (!data) return []

  // Lấy danh sách ID bài viết mà user hiện tại đã like
  let likedPostIds: string[] = []
  if (currentUserId && data.length > 0) {
    const { data: likesData } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', currentUserId)
      .in('post_id', data.map(p => p.id))
    
    if (likesData) {
      likedPostIds = likesData.map(l => l.post_id)
    }
  }

  return (data as any[]).map((post: any) => ({
    ...post,
    likes_count: post.likes?.[0]?.count || 0,
    is_liked: likedPostIds.includes(post.id)
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
    
    // Notify post author (async, don't wait)
    const { data: post } = await supabase.from('posts').select('author_id, title').eq('id', postId).single()
    if (post && post.author_id !== user.id) {
       createNotification({
         user_id: post.author_id,
         type: 'forum_reply',
         title: 'Tương tác mới',
         content: `Ai đó đã thả tim bài viết "${post.title}" của bạn.`,
         link: `/forum/${postId}`
       })
    }

    return { success: 'Đã thả tim', action: 'added' }
  }
}

/**
 * Lấy chi tiết bài viết
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
  try {
    // Check rate limit (Relaxed for debugging: max 10 posts per 1 minute)
    const isAllowed = await checkRateLimit('create_post', 10, 1)
    if (!isAllowed) {
      return { error: 'Bạn đang đăng bài quá nhanh. Vui lòng thử lại sau vài phút.' }
    }

    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: `Lỗi xác thực: ${authError?.message || 'Bạn cần đăng nhập để đăng bài.'}` }
    }

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const images_url_str = formData.get('images_url') as string
    
    const images_url = images_url_str 
      ? images_url_str.split(',').map(url => url.trim()).filter(Boolean)
      : []

    if (!title || !content) {
      return { error: 'Vui lòng nhập đầy đủ tiêu đề và nội dung.' }
    }

    const { error: insertError } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        title,
        content,
        images_url,
        status: 'pending'
      })

    if (insertError) {
      console.error('Database insert error:', insertError)
      return { error: `Lỗi lưu bài viết: [${insertError.code}] ${insertError.message}` }
    }

    revalidatePath('/forum')
    revalidatePath('/')
    return { success: 'Bài viết của bạn đã được gửi và đang chờ Admin duyệt!' }
  } catch (err: any) {
    console.error('Unexpected error in createPost:', err)
    return { error: `Đã xảy ra lỗi không xác định: ${err.message || 'Vui lòng thử lại sau.'}` }
  }
}

/**
 * Gửi bình luận cho bài viết
 */
export async function addComment(postId: string, content: string) {
  // Check rate limit (max 5 comments per minute)
  const isAllowed = await checkRateLimit('add_comment', 5, 1)
  if (!isAllowed) {
    return { error: 'Bạn đang bình luận quá nhanh. Vui lòng thử lại sau.' }
  }

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

  // Notify post author
  const { data: post } = await supabase.from('posts').select('author_id, title').eq('id', postId).single()
  if (post && post.author_id !== user.id) {
    await createNotification({
      user_id: post.author_id,
      type: 'forum_reply',
      title: 'Bình luận mới',
      content: `Ai đó đã bình luận trong bài viết "${post.title}" của bạn.`,
      link: `/forum/${postId}`
    })
  }

  revalidatePath(`/forum/${postId}`)
  return { success: 'Đã gửi bình luận!' }
}

/**
 * Lấy danh sách bài viết đang chờ duyệt (Dành cho Admin)
 */
export async function adminGetPendingPosts() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.log('[DEBUG] No user found in adminGetPendingPosts')
    return []
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  if (profile?.role !== 'admin') {
    console.warn('[DEBUG] User is NOT admin in profiles table:', user.email, 'Role:', profile?.role)
    return []
  }

  console.log('[DEBUG] Admin confirmed, fetching pending posts (simplified query)...')

  // Thử truy vấn đơn giản nhất không join để xem có dữ liệu không
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[DEBUG] Simple query error:', error)
    return []
  }

  if (!data || data.length === 0) {
    console.log('[DEBUG] No pending posts found even with simple query')
    return []
  }

  // Nếu có dữ liệu, mới thử lấy thông tin author
  const postsWithAuthor = await Promise.all(data.map(async (post) => {
    const { data: authorData } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', post.author_id).single()
    return { ...post, author: authorData }
  }))

  console.log(`[DEBUG] Successfully fetched ${postsWithAuthor.length} pending posts`)
  return postsWithAuthor as any[]
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

  const { data: post } = await supabase.from('posts').select('author_id, title').eq('id', postId).single()
  
  const { error } = await supabase
    .from('posts')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', postId)

  if (error) {
    return { error: `Lỗi cập nhật trạng thái: ${error.message}` }
  }

  // Log audit action
  await logAuditAction({
    action: 'MODERATE_POST',
    target_type: 'post',
    target_id: postId,
    new_values: { status }
  })

  // Notify author
  if (post) {
    await createNotification({
      user_id: post.author_id,
      type: 'system',
      title: 'Kiểm duyệt bài viết',
      content: `Bài viết "${post.title}" của bạn đã ${status === 'approved' ? 'được phê duyệt và hiển thị' : 'bị từ chối'}.`,
      link: '/forum'
    })
  }

  revalidatePath('/admin/forum')
  revalidatePath('/forum')
  revalidatePath('/')
  return { success: `Đã ${status === 'approved' ? 'duyệt' : 'từ chối'} bài viết thành công!` }
}
