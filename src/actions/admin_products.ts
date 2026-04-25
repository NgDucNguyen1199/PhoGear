'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProductWithVariants(data: any) {
  const supabase = await createClient()

  // 1. Chèn thông tin chung vào bảng products
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: data.name,
      brand: data.brand,
      description: data.description,
      category_id: data.category_id,
      price: data.base_price, // Giá tham khảo hoặc giá thấp nhất
      stock_quantity: data.variants.reduce((acc: number, v: any) => acc + parseInt(v.stock_quantity), 0),
      images_url: [], // Sẽ cập nhật logic upload sau
      options: data.options || []
    })
    .select()
    .single()

  if (productError) return { error: `Lỗi tạo sản phẩm: ${productError.message}` }

  // 2. Chèn hàng loạt biến thể vào bảng product_variants
  const variantsToInsert = data.variants.map((v: any) => ({
    product_id: product.id,
    variant_name: v.variant_name,
    price: parseFloat(v.price),
    stock_quantity: parseInt(v.stock_quantity),
  }))

  const { error: variantsError } = await supabase
    .from('product_variants')
    .insert(variantsToInsert)

  if (variantsError) {
    // Trong thực tế nên xóa product vừa tạo nếu biến thể lỗi (Rollback)
    await supabase.from('products').delete().eq('id', product.id)
    return { error: `Lỗi tạo biến thể: ${variantsError.message}` }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: 'Đã thêm sản phẩm và các biến thể thành công!' }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  return { success: 'Đã xóa sản phẩm thành công!' }
}
