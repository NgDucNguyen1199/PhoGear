'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { Plus, Loader2, Box, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { VariantManager } from './VariantManager'

import { Switch } from '@/components/ui/switch'
import { motion } from 'framer-motion'

const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm quá ngắn'),
  brand: z.string().min(2, 'Thương hiệu không được để trống'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Vui lòng chọn danh mục'),
  base_price: z.coerce.number().min(0, 'Giá không được âm'),
  is_flash_sale: z.boolean().default(false),
  flash_sale_price: z.coerce.number().min(0, 'Giá Flash Sale không được âm').optional().nullable(),
  flash_sale_stock: z.coerce.number().min(0, 'Kho Flash Sale không được âm').default(0),
  variants: z.array(z.object({
    variant_name: z.string().min(1, 'Tên biến thể bắt buộc'),
    switch_type: z.string().optional(),
    sku: z.string().optional(),
    image_url: z.string().optional(),
    price: z.coerce.number().min(0, 'Giá không được âm'),
    stock_quantity: z.coerce.number().min(0, 'Số lượng không được âm'),
  })).min(1, 'Cần ít nhất 1 biến thể')
})

type ProductFormInput = z.input<typeof productSchema>

export function AddProductDialog({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      description: '',
      category_id: '',
      base_price: 0,
      is_flash_sale: false,
      flash_sale_price: 0,
      flash_sale_stock: 0,
      variants: [{ variant_name: '', switch_type: '', sku: '', image_url: '', price: 0, stock_quantity: 0 }]
    }
  })

  const { control, register, watch, setValue, handleSubmit, reset, formState: { errors } } = form
  const isFlashSale = watch('is_flash_sale')

  async function onSubmit(values: ProductFormInput) {
    setIsLoading(true)
    const result = await createProductWithVariants(values)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
      setOpen(false)
      reset()
    }
  }

  const onInvalid = (errors: any) => {
    console.group('Lỗi nhập liệu chi tiết')
    console.error('Đối tượng errors:', errors)
    Object.keys(errors).forEach(key => {
      console.error(`Lỗi tại trường [${key}]:`, errors[key])
    })
    console.groupEnd()
    toast.error('Vui lòng kiểm tra lại các thông tin sản phẩm và biến thể.')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ className: 'gap-2' })}>
        <Plus size={18} /> Thêm sản phẩm & Biến thể 2.0
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
             <Zap className="text-primary fill-primary" /> Hệ thống quản trị kho Pho Gear
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
              {/* ... (brand, category_id, base_price) */}
              
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
                    <Select onValueChange={field.onChange} value={field.value || ''}>
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

            {/* FLASH SALE SETTINGS */}
            <div className="p-8 bg-primary/[0.03] rounded-3xl border-2 border-primary/10 text-left">
                <div className="flex items-center justify-between gap-6">
                    <div className="space-y-1">
                        <Label className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                            <Zap size={20} className="text-primary fill-primary" /> Kích hoạt Flash Sale
                        </Label>
                        <p className="text-sm text-muted-foreground font-medium">Sản phẩm này sẽ xuất hiện trong mục Giờ vàng giá sốc trên trang chủ.</p>
                    </div>
                    <FormField
                        control={control}
                        name="is_flash_sale"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Switch 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {isFlashSale && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-primary/10"
                    >
                        <FormField
                            control={control}
                            name="flash_sale_price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-primary font-black uppercase tracking-widest text-[10px]">Giá Flash Sale (VNĐ)</FormLabel>
                                    <FormControl><Input type="number" {...field} value={field.value as number} className="border-primary/20 focus-visible:ring-primary h-12 rounded-xl font-bold" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name="flash_sale_stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-primary font-black uppercase tracking-widest text-[10px]">Số lượng Flash Sale</FormLabel>
                                    <FormControl><Input type="number" {...field} value={field.value as number} className="border-primary/20 focus-visible:ring-primary h-12 rounded-xl font-bold" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                )}
            </div>


            {/* QUẢN LÝ BIẾN THỂ (VARIANTS V2) */}
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
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus size={18} className="mr-2" />}
                LƯU TOÀN BỘ SẢN PHẨM & BIẾN THỂ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

