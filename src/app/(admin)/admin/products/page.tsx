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

export default async function AdminProductsPage() {
  const products = await getProducts(50)
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý kho hàng và thông tin sản phẩm.</p>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Tùy chọn</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-bold">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.brand}</div>
                    </div>
                  </TableCell>
                  <TableCell>{product.categories?.name || 'Chưa phân loại'}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </TableCell>
                  <TableCell>
                    {product.stock_quantity > 0 ? (
                      <span className="font-medium">{product.stock_quantity}</span>
                    ) : (
                      <Badge variant="destructive">Hết hàng</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {product.options?.map((opt, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-1 py-0 h-4">
                          {opt.name}
                        </Badge>
                      )) || <span className="text-xs text-muted-foreground italic">None</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <EditProductDialog product={product} categories={categories} />
                      <form action={async () => {
                        'use server'
                        await deleteProduct(product.id)
                      }}>
                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
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
  )
}
