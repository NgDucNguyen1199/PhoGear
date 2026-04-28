import { Product } from '@/types'
import { ProductCard } from './ProductCard'

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black uppercase tracking-tight">Sản phẩm liên quan</h2>
          <p className="text-muted-foreground">Có thể bạn cũng sẽ thích những sản phẩm này</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
