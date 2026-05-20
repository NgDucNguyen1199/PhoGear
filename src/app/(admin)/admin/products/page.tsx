import { getProducts, getCategories } from '@/actions/products'
import { deleteProduct } from '@/actions/admin_products'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2, Search, Settings2 } from 'lucide-react'
import { AddProductDialog } from '@/components/admin/AddProductDialog'
import { EditProductDialog } from '@/components/admin/EditProductDialog'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const products = await getProducts(50)
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sản phẩm</h1>
          <p className="text-sm text-muted-foreground">Quản lý kho hàng và thông tin sản phẩm.</p>
        </div>
        <AddProductDialog categories={categories} />
      </div>

      <div className="flex items-center gap-4 bg-background p-4 rounded-lg border shadow-sm">
        <Search className="text-muted-foreground h-5 w-5" />
        <input 
          placeholder="Tìm kiếm sản phẩm..." 
          className="flex-1 bg-transparent border-none outline-none text-sm"
        />
      </div>

      <div className="bg-background rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Tên sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead className="min-w-[150px]">Tùy chọn</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-bold text-sm sm:text-base">{product.name}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">{product.brand}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{product.categories?.name || 'Chưa phân loại'}</TableCell>
                    <TableCell className="text-sm font-bold text-primary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </TableCell>
                    <TableCell>
                      {product.stock_quantity > 0 ? (
                        <span className="font-medium text-sm">{product.stock_quantity}</span>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] uppercase font-black">Hết hàng</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {product.options?.map((opt, i) => (
                          <Badge key={i} variant="outline" className="text-[9px] px-1 py-0 h-4 bg-muted/50">
                            {opt.name}
                          </Badge>
                        )) || <span className="text-[10px] text-muted-foreground italic">None</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <EditProductDialog product={product} categories={categories} />
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">
                    Chưa có sản phẩm nào trong kho.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
