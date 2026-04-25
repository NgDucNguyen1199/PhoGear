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
import { Plus, Loader2, Box, Zap, Tag, X } from 'lucide-react'
import { toast } from 'sonner'
import { VariantManager } from './VariantManager'
import { Badge } from '@/components/ui/badge'
import { ProductOption } from '@/types'

const productSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm quá ngắn'),
  brand: z.string().min(2, 'Thương hiệu không được để trống'),
  description: z.string().optional(),
  category_id: z.string().uuid('Vui lòng chọn danh mục'),
  base_price: z.coerce.number(),
  variants: z.array(z.object({
    variant_name: z.string().min(1, 'Tên biến thể bắt buộc'),
    switch_type: z.string().optional(),
    sku: z.string().optional(),
    image_url: z.string().optional(),
    price: z.coerce.number(),
    stock_quantity: z.coerce.number(),
  })).min(1, 'Cần ít nhất 1 biến thể')
})

type ProductFormInput = z.input<typeof productSchema>

export function AddProductDialog({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Quản lý Simple Options (JSONB)
  const [options, setOptions] = useState<ProductOption[]>([])

  const addOption = () => setOptions([...options, { name: '', values: [] }])
  const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index))
  const updateOptionName = (index: number, name: string) => {
    const newOptions = [...options]
    newOptions[index].name = name
    setOptions(newOptions)
  }
  const addOptionValue = (index: number, value: string) => {
    if (!value.trim()) return
    const newOptions = [...options]
    if (!newOptions[index].values.includes(value.trim())) {
      newOptions[index].values.push(value.trim())
      setOptions(newOptions)
    }
  }
  const removeOptionValue = (optIndex: number, valIndex: number) => {
    const newOptions = [...options]
    newOptions[optIndex].values = newOptions[optIndex].values.filter((_, i) => i !== valIndex)
    setOptions(newOptions)
  }

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      description: '',
      base_price: 0,
      variants: [{ variant_name: '', switch_type: '', sku: '', image_url: '', price: 0, stock_quantity: 0 }]
    }
  })

  const { control, register, watch, setValue, handleSubmit, reset } = form

  async function onSubmit(values: ProductFormInput) {
    setIsLoading(true)
    // Gộp cả options JSONB vào data gửi lên
    const finalData = { ...values, options }
    const result = await createProductWithVariants(finalData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
      setOpen(false)
      reset()
      setOptions([])
    }
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 py-6">
            
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

            {/* QUẢN LÝ SIMPLE OPTIONS (JSONB) - Đã thêm lại phần này */}
            <div className="space-y-4 p-8 border rounded-3xl bg-primary/[0.02] text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg uppercase tracking-tight flex items-center gap-2">
                  <Tag className="text-primary h-5 w-5" /> Tùy chọn nhanh (Màu, Switch...)
                </h3>
                <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-1 border-primary text-primary">
                  <Plus size={14} /> Thêm loại tùy chọn
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {options.map((opt, optIndex) => (
                  <div key={optIndex} className="space-y-4 p-4 border rounded-2xl bg-background relative shadow-sm">
                    <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 text-destructive" onClick={() => removeOption(optIndex)}>
                      <X size={16} />
                    </Button>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground">Tên tùy chọn</Label>
                      <Input placeholder="VD: Màu sắc" value={opt.name} onChange={(e) => updateOptionName(optIndex, e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground">Các giá trị (Nhấn Enter để thêm)</Label>
                      <div className="flex flex-wrap gap-2 mb-2 min-h-[30px]">
                        {opt.values.map((val, valIndex) => (
                          <Badge key={valIndex} variant="secondary" className="gap-1 pr-1 bg-primary/10 text-primary border-none">
                            {val}
                            <button type="button" onClick={() => removeOptionValue(optIndex, valIndex)}><X size={12} /></button>
                          </Badge>
                        ))}
                      </div>
                      <Input 
                        placeholder="Gõ giá trị..." 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addOptionValue(optIndex, e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUẢN LÝ BIẾN THỂ (VARIANTS V2) */}
            <VariantManager 
              control={control} 
              register={register} 
              watch={watch} 
              setValue={setValue} 
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
