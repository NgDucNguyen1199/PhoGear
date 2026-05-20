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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Danh mục</h1>
          <p className="text-sm text-muted-foreground">Quản lý và phân loại nhóm sản phẩm trên cửa hàng.</p>
        </div>
        <AddCategoryDialog />
      </div>

      <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-black uppercase tracking-tight">Tất cả danh mục hiện có</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Tên danh mục</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="min-w-[200px]">Mô tả</TableHead>
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
                            <Layers className="h-4 w-4 text-primary" />
                            <span className="font-bold text-sm">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono">
                          /{category.slug}
                        </TableCell>
                        <TableCell className="text-xs truncate max-w-[200px]" title={category.description}>
                          {category.description || 'Không có mô tả'}
                        </TableCell>
                        <TableCell className="text-xs">
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
                              <Button variant="ghost" size="icon" className="text-destructive h-8 w-8 hover:bg-destructive/10">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
