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
  stock_quantity: number
  images_url: string[]
  category_id: string | null
  layout: string | null
  connectivity: string | null
  average_rating: number
  review_count?: number
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
