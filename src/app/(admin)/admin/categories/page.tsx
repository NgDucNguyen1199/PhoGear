import { getCategories } from '@/actions/products'
import { deleteCategory } from '@/actions/admin_categories'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AddCategoryDialog } from '@/components/admin/AddCategoryDialog'
import { EditCategoryDialog } from '@/components/admin/EditCategoryDialog'
import { Layers, Trash2, Calendar, Pencil } from 'lucide-react'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Danh mục</h1>
          <p className="text-muted-foreground">Quản lý và phân loại nhóm sản phẩm trên cửa hàng.</p>
        </div>
        <AddCategoryDialog />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tất cả danh mục hiện có</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-background rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-[300px]">Mô tả</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories && categories.length > 0 ? (
                  categories.map((category: any) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span className="font-bold">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        /{category.slug}
                      </TableCell>
                      <TableCell className="text-sm truncate max-w-[200px]" title={category.description}>
                        {category.description || 'Không có mô tả'}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(category.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <EditCategoryDialog category={category} />
                          <form action={async () => {
                            'use server'
                            await deleteCategory(category.id)
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
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                      Chưa có danh mục nào được tạo.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
