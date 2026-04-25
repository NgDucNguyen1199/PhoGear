export type Category = {
  id: string
  name: string
  slug: string
}

export type ProductOption = {
  name: string
  values: string[]
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
  created_at: string
  categories?: Category
}
