'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const brand = formData.get('brand') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stock_quantity = parseInt(formData.get('stock_quantity') as string)
  const category_id = formData.get('category_id') as string
  const layout = formData.get('layout') as string
  const connectivity = formData.get('connectivity') as string
  const options = JSON.parse(formData.get('options') as string || '[]')
  
  const images_url: string[] = []

  const { error } = await supabase.from('products').insert({
    name,
    brand,
    description,
    price,
    stock_quantity,
    category_id: category_id || null,
    layout,
    connectivity,
    images_url,
    options
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: 'Đã thêm sản phẩm thành công!' }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: 'Đã xóa sản phẩm thành công!' }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const updates = {
    name: formData.get('name') as string,
    brand: formData.get('brand') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    stock_quantity: parseInt(formData.get('stock_quantity') as string),
    category_id: (formData.get('category_id') as string) || null,
    layout: formData.get('layout') as string,
    connectivity: formData.get('connectivity') as string,
    options: JSON.parse(formData.get('options') as string || '[]')
  }

  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: 'Đã cập nhật sản phẩm thành công!' }
}
