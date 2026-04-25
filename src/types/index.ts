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
  options: ProductOption[]
  product_variants?: ProductVariant[]
  created_at: string
  categories?: Category
}
