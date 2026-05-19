export type Post = {
  id: string
  author_id: string
  title: string
  content: string
  images_url: string[]
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  }
  comments?: PostComment[]
  _count?: {
    comments: number
  }
}

export type PostComment = {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  }
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  created_at?: string
}

export type ProductOption = {
  name: string
  values: string[]
}

export type ProductVariant = {
  id: string
  product_id: string
  variant_name: string
  switch_type?: string | null
  sku?: string | null
  price: number
  stock_quantity: number
  image_url?: string | null
  created_at?: string
}

export type Product = {
  id: string
  name: string
  brand: string | null
  description: string | null
  price: number
  sale_price?: number
  is_sale?: boolean
  sale_percent?: number
  stock_quantity: number
  images_url: string[]
  category_id: string | null
  layout: string | null
  connectivity: string | null
  average_rating: number
  review_count?: number
  is_flash_sale?: boolean
  flash_sale_price?: number | null
  flash_sale_stock?: number
  flash_sale_sold?: number
  options: ProductOption[]
  product_variants?: ProductVariant[]
  reviews?: Review[]
  created_at: string
  categories?: Category
}

export type Review = {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  images_url: string[]
  created_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  }
}
