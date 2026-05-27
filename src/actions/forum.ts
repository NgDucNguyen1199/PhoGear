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
  
  // 1. Lấy role của user hiện tại một cách an toàn nhất
  const { data: { user: authUser } } = await supabase.auth.getUser()
  let isAdmin = false
  if (authUser) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', authUser.id).maybeSingle()
    isAdmin = profile?.role === 'admin'
  }

  console.log(`[SYSTEM-DEBUG] User: ${currentUserId}, AuthUser: ${authUser?.id}, IsAdmin: ${isAdmin}`)
  
  // 2. Xây dựng truy vấn cơ bản (chỉ lấy bảng posts trước để đảm bảo không lỗi join)
  let query = supabase.from('posts').select('*')

  if (isAdmin) {
    // Admin: Lấy tất cả, không lọc
    console.log('[SYSTEM-DEBUG] God Mode: Fetching all posts')
  } else if (authUser?.id) {
    // Thành viên: Lấy bài đã duyệt HOẶC bài của chính mình
    query = query.or(`status.eq.approved,author_id.eq.${authUser.id}`)
  } else {
    // Khách: Chỉ lấy bài đã duyệt
    query = query.eq('status', 'approved')
  }

  // Sắp xếp mới nhất lên đầu
  query = query.order('created_at', { ascending: false })

  const { data: posts, error: postsError } = await query

  if (postsError) {
    console.error('[SYSTEM-DEBUG] Error fetching posts table:', postsError)
    return []
  }

  if (!posts || posts.length === 0) {
    console.log('[SYSTEM-DEBUG] No posts found in database matching criteria')
    return []
  }

  // 3. Bổ sung thông tin Author và Like (Làm riêng lẻ để tránh lỗi Join)
  const enrichedPosts = await Promise.all(posts.map(async (post) => {
    // Lấy author
    const { data: author } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', post.author_id).maybeSingle()
    
    // Lấy số like
    const { count: likesCount } = await supabase.from('post_likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id)
    
    // Lấy số bình luận
    const { count: commentsCount } = await supabase.from('comments').select('*', { count: 'exact', head: true }).eq('post_id', post.id)
    
    // Kiểm tra xem user hiện tại đã like chưa
    let isLiked = false
    if (authUser?.id) {
      const { data: like } = await supabase.from('post_likes').select('id').eq('post_id', post.id).eq('user_id', authUser.id).maybeSingle()
      isLiked = !!like
    }

    return {
      ...post,
      author,
      likes_count: likesCount || 0,
      comments_count: commentsCount || 0,
      is_liked: isLiked
    }
  }))

  console.log(`[SYSTEM-DEBUG] Successfully enriched ${enrichedPosts.length} posts`)
  return enrichedPosts as any[]
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
    .maybeSingle()

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
    const { data: post } = await supabase.from('posts').select('author_id, title').eq('id', postId).maybeSingle()
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
    .maybeSingle()

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
    // Check rate limit (Relaxed for debugging)
    const isAllowed = await checkRateLimit('create_post', 20, 1)
    if (!isAllowed) {
      return { error: 'Bạn đang thao tác quá nhanh. Vui lòng thử lại sau.' }
    }

    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Bạn cần đăng nhập để đăng bài.' }
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
      return { error: `Lỗi database [${insertError.code}]: ${insertError.message}` }
    }

    // Quan trọng: Làm mới mọi cache có liên quan
    revalidatePath('/')
    revalidatePath('/forum')
    revalidatePath('/admin/forum')
    
    return { success: 'Bài viết của bạn đã được gửi và đang chờ Admin duyệt!' }
  } catch (err: any) {
    return { error: `Lỗi hệ thống: ${err.message}` }
  }
}

/**
 * Gửi bình luận cho bài viết
 */
export async function addComment(postId: string, content: string) {
  const isAllowed = await checkRateLimit('add_comment', 10, 1)
  if (!isAllowed) {
    return { error: 'Bạn đang bình luận quá nhanh.' }
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

  if (error) return { error: `Lỗi bình luận: ${error.message}` }

  // Notify post author
  const { data: post } = await supabase.from('posts').select('author_id, title').eq('id', postId).maybeSingle()
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
  if (!user) return []

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  
  if (profile?.role !== 'admin') {
    return []
  }

  // Truy vấn đơn giản nhất
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error || !data) return []

  // Bổ sung author cho mỗi bài
  return await Promise.all(data.map(async (post) => {
    const { data: author } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', post.author_id).maybeSingle()
    return { ...post, author }
  }))
}

/**
 * Phê duyệt hoặc Từ chối bài viết (Dành cho Admin)
 */
export async function adminModeratePost(postId: string, status: 'approved' | 'rejected') {
  const supabase = await createClient()

  // Kiểm tra quyền Admin
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id || '').maybeSingle()
  
  if (profile?.role !== 'admin') {
    return { error: 'Bạn không có quyền thực hiện thao tác này.' }
  }

  const { data: post } = await supabase.from('posts').select('author_id, title').eq('id', postId).maybeSingle()
  
  const { error } = await supabase
    .from('posts')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', postId)

  if (error) return { error: `Lỗi database: ${error.message}` }

  // Log audit
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
