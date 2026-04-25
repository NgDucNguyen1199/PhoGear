'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Hàm kiểm tra và xử lý trùng lặp SKU trong nội bộ danh sách gửi lên
 */
function handleInternalSkuDuplicates(variants: any[]) {
  const seenSkus = new Set<string>();
  return variants.map((v) => {
    let sku = (v.sku && v.sku.trim() !== '') ? v.sku.trim() : null;
    
    if (sku) {
      // Nếu SKU đã xuất hiện trong danh sách này rồi
      if (seenSkus.has(sku)) {
        // Tự động thêm hậu tố để tránh trùng nội bộ
        sku = `${sku}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      }
      seenSkus.add(sku);
    }
    return { ...v, sku };
  });
}

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
      price: data.base_price, 
      stock_quantity: data.variants ? data.variants.reduce((acc: number, v: any) => acc + (parseInt(v.stock_quantity) || 0), 0) : 0,
      images_url: [], 
      options: data.options || []
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
      image_url: v.image_url || '',
      price: parseFloat(v.price) || 0,
      stock_quantity: parseInt(v.stock_quantity) || 0,
    }))

    const { error: variantsError } = await supabase
      .from('product_variants')
      .insert(variantsToInsert)

    if (variantsError) {
      console.error('Error creating variants:', variantsError)
      await supabase.from('products').delete().eq('id', product.id)
      return { error: `Lỗi tạo biến thể (Có thể do trùng mã SKU với sản phẩm khác): ${variantsError.message}` }
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
    stock_quantity: totalStock,
    options: data.options || []
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
    // 1. Xử lý trùng lặp SKU nội bộ trong danh sách gửi lên
    const processedVariants = handleInternalSkuDuplicates(data.variants);

    // 2. Xóa trắng biến thể cũ của sản phẩm này
    const { error: deleteError } = await supabase
      .from('product_variants')
      .delete()
      .eq('product_id', id)
    
    if (deleteError) {
      console.error('Error deleting old variants:', deleteError)
      return { error: `Lỗi dọn dẹp biến thể cũ: ${deleteError.message}` }
    }

    // 3. Chuẩn bị dữ liệu chèn mới
    const variantsToInsert = processedVariants.map((v: any) => ({
      product_id: id,
      variant_name: v.variant_name,
      switch_type: v.switch_type || '',
      sku: v.sku,
      image_url: v.image_url || '',
      price: parseFloat(v.price) || 0,
      stock_quantity: parseInt(v.stock_quantity) || 0,
    }))

    const { error: variantsError } = await supabase
      .from('product_variants')
      .insert(variantsToInsert)

    if (variantsError) {
      console.error('Error inserting new variants:', variantsError)
      return { error: `Lỗi cập nhật biến thể (Mã SKU bị trùng lặp với sản phẩm khác trên hệ thống): ${variantsError.message}` }
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
