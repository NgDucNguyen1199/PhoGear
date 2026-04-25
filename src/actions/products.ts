'use server'

import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types'

export async function getProducts(limit = 8) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

export async function getProductById(id: string) {
  // Validate UUID format to prevent invalid input syntax errors
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return null;
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching product by ID:', error)
    return null
  }

  return data as Product
}

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

export async function searchProducts(query: string) {
  const supabase = await createClient()

  // Thay vì dùng RPC (yêu cầu người dùng phải chạy SQL config trên Supabase),
  // chúng ta fetch dữ liệu và lọc bằng JavaScript để hỗ trợ "không dấu" một cách an toàn.
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*)')

  if (error) {
    console.error('Error searching products:', error.message)
    return []
  }

  if (!query || query.trim() === '') {
    return data as Product[]
  }

  // Hàm chuyển đổi tiếng Việt có dấu thành không dấu và viết thường
  const removeAccents = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  }

  const normalizedQuery = removeAccents(query.trim())

  // Lọc sản phẩm theo tên, nhà sản xuất (brand), và tên danh mục
  const filteredProducts = (data as Product[]).filter((product) => {
    const normalizedName = removeAccents(product.name)
    const normalizedBrand = removeAccents(product.brand || '')
    const normalizedCategory = removeAccents(product.categories?.name || '')

    return (
      normalizedName.includes(normalizedQuery) ||
      normalizedBrand.includes(normalizedQuery) ||
      normalizedCategory.includes(normalizedQuery)
    )
  })

  return filteredProducts
}


