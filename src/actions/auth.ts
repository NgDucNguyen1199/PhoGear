'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { checkRateLimit } from './rate_limit'

export async function login(formData: FormData) {
  // Check rate limit (max 5 attempts per minute)
  const isAllowed = await checkRateLimit('login', 5, 1)
  if (!isAllowed) {
    return { error: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 1 phút.' }
  }

  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const rememberMe = formData.get('rememberMe') === 'true'

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message === 'Invalid login credentials') {
      return { error: 'Email hoặc mật khẩu không chính xác.' }
    }
    return { error: error.message }
  }

  // Check if MFA is required
  if (data.user) {
    // 1. Check if user has MFA factors enrolled
    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
    
    if (!factorsError && factors.all.length > 0) {
      const activeFactor = factors.all.find(f => f.status === 'verified')
      if (activeFactor) {
        // User has verified MFA, but signInWithPassword only gives AAL1
        // Redirect to MFA verification page
        return { requiresMfa: true, factorId: activeFactor.id }
      }
    }

    // 2. Check if Admin forces 2FA and user is admin
    const { data: settings } = await supabase
      .from('system_settings')
      .select('two_factor_auth')
      .eq('id', 'main')
      .maybeSingle()

    if (settings?.two_factor_auth) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'admin') {
        // Force admin to setup 2FA if they haven't? 
        // For now, if it's required but they haven't set it up, we let them in 
        // but we should probably show a warning or force setup in profile.
      }
    }

    // Record login history
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || 'Unknown'
    const ip = headersList.get('x-forwarded-for') || 'Unknown'

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', data.user.id)
      .single()

    await supabase.from('login_history').insert({
      user_id: data.user.id,
      full_name: profile?.full_name || email,
      ip_address: ip,
      user_agent: userAgent,
      status: 'success'
    })
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function enrollMfa() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    issuer: 'Pho Gear',
  })

  if (error) {
    console.error('MFA Enrollment error:', error)
    return { error: error.message }
  }

  return { data }
}

export async function verifyMfaChallenge(factorId: string, code: string) {
  const supabase = await createClient()

  // First create a challenge
  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId
  })

  if (challengeError) {
    return { error: challengeError.message }
  }

  // Then verify it
  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function unenrollMfa(factorId: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.mfa.unenroll({
    factorId
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function getMfaFactors() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.mfa.listFactors()
  
  if (error) return { all: [], unverified: [], verified: [] }
  return data
}


export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: 'Vui lòng kiểm tra email để xác nhận tài khoản!' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { ...profile, email: user.email }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) return { error: 'Bạn cần đăng nhập để thực hiện hành động này.' }

  const fullName = formData.get('fullName') as string
  const avatarFile = formData.get('avatarFile') as File
  let avatarUrl = formData.get('avatarUrl') as string

  // Handle file upload if a new file is provided
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, {
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError)
      return { error: `Lỗi upload ảnh: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
    
    avatarUrl = publicUrl
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: 'Cập nhật thông tin thành công!' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    return { error: 'Mật khẩu xác nhận không khớp.' }
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Thay đổi mật khẩu thành công!' }
}

