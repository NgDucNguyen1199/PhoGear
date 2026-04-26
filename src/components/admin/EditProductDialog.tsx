'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { updateProduct } from '@/actions/admin_products'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Pencil, Loader2, Box, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Product } from '@/types'
import { VariantManager } from './VariantManager'

const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm quá ngắn'),
  brand: z.string().min(1, 'Thương hiệu không được để trống'),
  description: z.string().optional().nullable(),
  category_id: z.string().min(1, 'Vui lòng chọn danh mục'),
  base_price: z.coerce.number().min(0, 'Giá không được âm'),
  variants: z.array(z.object({
    variant_name: z.string().min(1, 'Tên biến thể bắt buộc'),
    switch_type: z.string().optional().nullable(),
    sku: z.string().optional().nullable(),
    image_url: z.string().optional().nullable(),
    price: z.coerce.number().min(0),
    stock_quantity: z.coerce.number().min(0),
  })).min(1, 'Cần ít nhất 1 biến thể')
})

type ProductFormInput = z.input<typeof productSchema>

export function EditProductDialog({ product, categories }: { product: Product, categories: any[] }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name || '',
      brand: product.brand || '',
      description: product.description || '',
      category_id: product.category_id || '',
      base_price: product.price || 0,
      variants: product.product_variants && product.product_variants.length > 0 
        ? product.product_variants.map(v => ({
            variant_name: v.variant_name,
            switch_type: v.switch_type || '',
            sku: v.sku || '',
            image_url: v.image_url || '',
            price: v.price,
            stock_quantity: v.stock_quantity
          })) 
        : [{ variant_name: 'Mặc định', price: product.price || 0, stock_quantity: product.stock_quantity || 0, switch_type: '', sku: '', image_url: '' }]
    }
  })

  const { control, register, watch, setValue, handleSubmit, formState: { errors } } = form

  async function onSubmit(values: ProductFormInput) {
    setIsLoading(true)
    const result = await updateProduct(product.id, values)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
      setOpen(false)
    }
  }

  const onInvalid = (errors: any) => {
    console.error('Lỗi nhập liệu chi tiết:', JSON.parse(JSON.stringify(errors)))
    toast.error('Vui lòng kiểm tra lại các thông tin sản phẩm và biến thể.')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
        <Pencil size={16} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
             <Zap className="text-primary fill-primary" /> Chỉnh sửa sản phẩm Pho Gear
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-10 py-6">
            
            {/* THÔNG TIN CHUNG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-muted/20 rounded-3xl border shadow-inner text-left">
               <div className="col-span-full font-black text-xs uppercase tracking-[0.3em] text-primary flex items-center gap-2 mb-2">
                 <Box size={14} /> Thông tin cơ bản
               </div>
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên sản phẩm</FormLabel>
                    <FormControl><Input placeholder="Ví dụ: Yunzii B75 Pro" {...field} value={field.value as string} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thương hiệu</FormLabel>
                    <FormControl><Input placeholder="Ví dụ: Yunzii" {...field} value={field.value as string} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danh mục</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="base_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá tham khảo (VNĐ)</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value as number} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-full">
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả chi tiết</FormLabel>
                      <FormControl><Textarea rows={3} {...field} value={field.value as string} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* QUẢN LÝ BIẾN THỂ */}
            <VariantManager 
              control={control} 
              register={register} 
              watch={watch} 
              setValue={setValue} 
              errors={errors}
            />

            <DialogFooter className="pt-8 border-t">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={isLoading} className="px-8 font-bold h-12">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pencil size={18} className="mr-2" />}
                LƯU THAY ĐỔI SẢN PHẨM
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
