'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createProductWithVariants } from '@/actions/admin_products'
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
import { Plus, Loader2, Trash2, Box, BadgeCheck } from 'lucide-react'
import { toast } from 'sonner'

const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm quá ngắn'),
  brand: z.string().min(2, 'Thương hiệu không được để trống'),
  description: z.string().optional(),
  category_id: z.string().uuid('Vui lòng chọn danh mục'),
  base_price: z.coerce.number(),
  variants: z.array(z.object({
    variant_name: z.string().min(1, 'Tên biến thể bắt buộc'),
    price: z.coerce.number(),
    stock_quantity: z.coerce.number(),
  })).min(1, 'Cần ít nhất 1 biến thể')
})

// Define input type specifically for the form to avoid resolver mismatches
type ProductFormInput = z.input<typeof productSchema>
type ProductFormOutput = z.output<typeof productSchema>

export function AddProductDialog({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      description: '',
      base_price: 0,
      variants: [{ variant_name: '', price: 0, stock_quantity: 0 }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants"
  })

  async function onSubmit(values: ProductFormInput) {
    setIsLoading(true)
    // The values are already transformed by Zod because of resolver
    const result = await createProductWithVariants(values)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
      setOpen(false)
      form.reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ className: 'gap-2' })}>
        <Plus size={18} /> Thêm sản phẩm & Biến thể
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight">Hệ thống thêm sản phẩm</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            
            {/* THÔNG TIN CHUNG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/30 rounded-2xl border border-dashed text-left">
               <div className="col-span-full font-bold text-sm uppercase tracking-widest text-primary flex items-center gap-2">
                 <Box size={16} /> Thông tin cơ bản
               </div>
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                  control={form.control}
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

            {/* QUẢN LÝ BIẾN THỂ (VARIANTS) */}
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg uppercase tracking-tight flex items-center gap-2">
                  <BadgeCheck className="text-green-500" /> Biến thể & Tồn kho
                </h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ variant_name: '', price: 0, stock_quantity: 0 })}
                  className="gap-2 border-primary text-primary hover:bg-primary/5"
                >
                  <Plus size={14} /> Thêm phiên bản
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-4 p-4 border rounded-xl bg-background shadow-sm items-end relative group">
                    <div className="col-span-12 md:col-span-5 space-y-2">
                      <Label className="text-xs">Tên phiên bản (Màu sắc/Switch)</Label>
                      <Input 
                        placeholder="VD: Black - Cocoa Cream V2" 
                        {...form.register(`variants.${index}.variant_name` as const)} 
                      />
                    </div>
                    <div className="col-span-5 md:col-span-3 space-y-2">
                      <Label className="text-xs">Giá bán</Label>
                      <Input 
                        type="number" 
                        {...form.register(`variants.${index}.price` as const)} 
                      />
                    </div>
                    <div className="col-span-5 md:col-span-3 space-y-2">
                      <Label className="text-xs">Số lượng kho</Label>
                      <Input 
                        type="number" 
                        {...form.register(`variants.${index}.stock_quantity` as const)} 
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1 pb-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => remove(index)}
                        className="text-destructive hover:bg-destructive/10"
                        disabled={fields.length === 1}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-6 border-t">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={isLoading} className="px-8 font-bold">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus size={18} className="mr-2" />}
                LƯU SẢN PHẨM & BIẾN THỂ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
