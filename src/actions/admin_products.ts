'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Hàm hỗ trợ sửa lỗi URL Unsplash bị thiếu dấu '?' trước query params
 */
function fixUnsplashUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes('images.unsplash.com') && url.includes('auto=') && !url.includes('?')) {
    return url.replace('auto=', '?auto=');
  }
  return url;
}

/**
 * Hàm kiểm tra và xử lý trùng lặp SKU trong nội bộ danh sách gửi lên
 */
function handleInternalSkuDuplicates(variants: any[]) {
  const seenSkus = new Set<string>();
  return variants.map((v) => {
    let sku = (v.sku && v.sku.trim() !== '') ? v.sku.trim() : null;
    
    if (sku) {
      if (seenSkus.has(sku)) {
        sku = `${sku}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      }
      seenSkus.add(sku);
    }
    return { ...v, sku };
  });
}

export async function createProductWithVariants(data: any) {
  const supabase = await createClient()

  // 1. Chèn thông tin chung vào bảng products (Đã bỏ trường options)
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      name: data.name,
      brand: data.brand,
      description: data.description,
      category_id: data.category_id,
      price: data.base_price, 
      stock_quantity: data.variants ? data.variants.reduce((acc: number, v: any) => acc + (parseInt(v.stock_quantity) || 0), 0) : 0,
      images_url: []
    })
    .select()
    .single()

  if (productError) {
    console.error('Error creating product:', productError)
    return { error: `Lỗi tạo sản phẩm: ${productError.message}` }
  }

  // 2. Chèn hàng loạt biến thể vào bảng product_variants
  if (data.variants && data.variants.length > 0) {
    const processedVariants = handleInternalSkuDuplicates(data.variants);

    const variantsToInsert = processedVariants.map((v: any) => ({
      product_id: product.id,
      variant_name: v.variant_name,
      switch_type: v.switch_type || '',
      sku: v.sku,
      image_url: fixUnsplashUrl(v.image_url) || '',
      price: parseFloat(v.price) || 0,
      stock_quantity: parseInt(v.stock_quantity) || 0,
    }))

    const { error: variantsError } = await supabase
      .from('product_variants')
      .insert(variantsToInsert)

    if (variantsError) {
      console.error('Error creating variants:', variantsError)
      await supabase.from('products').delete().eq('id', product.id)
      return { error: `Lỗi tạo biến thể (Có thể do trùng mã SKU): ${variantsError.message}` }
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: 'Đã thêm sản phẩm và các biến thể thành công!' }
}

export async function updateProduct(id: string, data: any) {
  const supabase = await createClient()
  
  const totalStock = data.variants 
    ? data.variants.reduce((acc: number, v: any) => acc + (parseInt(v.stock_quantity) || 0), 0) 
    : 0

  const updates = {
    name: data.name,
    brand: data.brand,
    description: data.description,
    category_id: data.category_id,
    price: data.base_price,
    stock_quantity: totalStock
  }

  const { error: productError } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)

  if (productError) {
    console.error('Error updating product:', productError)
    return { error: `Lỗi cập nhật sản phẩm: ${productError.message}` }
  }

  // Cập nhật biến thể
  if (data.variants && data.variants.length > 0) {
    const processedVariants = handleInternalSkuDuplicates(data.variants);

    await supabase.from('product_variants').delete().eq('product_id', id)

    const variantsToInsert = processedVariants.map((v: any) => ({
      product_id: id,
      variant_name: v.variant_name,
      switch_type: v.switch_type || '',
      sku: v.sku,
      image_url: fixUnsplashUrl(v.image_url) || '',
      price: parseFloat(v.price) || 0,
      stock_quantity: parseInt(v.stock_quantity) || 0,
    }))

    const { error: variantsError } = await supabase
      .from('product_variants')
      .insert(variantsToInsert)

    if (variantsError) {
      console.error('Error inserting new variants:', variantsError)
      return { error: `Lỗi cập nhật biến thể (Mã SKU bị trùng lặp): ${variantsError.message}` }
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/')
  return { success: 'Đã cập nhật sản phẩm thành công!' }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) {
    console.error('Error deleting product:', error)
    return { error: error.message }
  }
  revalidatePath('/admin/products')
  return { success: 'Đã xóa sản phẩm thành công!' }
}
