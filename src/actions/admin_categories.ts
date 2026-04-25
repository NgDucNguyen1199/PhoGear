'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('categories')
    .insert({ name, slug, description })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/categories')
  return { success: 'Thêm danh mục thành công!' }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/categories')
  return { success: 'Xóa danh mục thành công!' }
}
