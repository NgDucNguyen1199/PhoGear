'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logAuditAction } from './audit'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug, description })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Log audit action
  await logAuditAction({
    action: 'CREATE_CATEGORY',
    target_type: 'category',
    target_id: data.id,
    new_values: { name, slug, description }
  })

  revalidatePath('/admin/categories')
  return { success: 'Thêm danh mục thành công!' }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  // Fetch old data
  const { data: oldCategory } = await supabase.from('categories').select('*').eq('id', id).single()

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // Log audit action
  await logAuditAction({
    action: 'DELETE_CATEGORY',
    target_type: 'category',
    target_id: id,
    old_values: oldCategory
  })

  revalidatePath('/admin/categories')
  return { success: 'Xóa danh mục thành công!' }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  // Fetch old data
  const { data: oldCategory } = await supabase.from('categories').select('*').eq('id', id).single()

  const { error } = await supabase
    .from('categories')
    .update({ name, slug, description })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // Log audit action
  await logAuditAction({
    action: 'UPDATE_CATEGORY',
    target_type: 'category',
    target_id: id,
    old_values: oldCategory,
    new_values: { name, slug, description }
  })

  revalidatePath('/admin/categories')
  return { success: 'Cập nhật danh mục thành công!' }
}

