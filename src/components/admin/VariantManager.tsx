'use client'

import { useFieldArray, Control, UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2, Hash, Zap, Image as ImageIcon, Box } from 'lucide-react'
import { generateSKU } from '@/lib/utils/sku'
import Image from 'next/image'

interface VariantManagerProps {
  control: any
  register: any
  watch: any
  setValue: any
  errors: any
}

export function VariantManager({ control, register, watch, setValue, errors }: VariantManagerProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  })

  const productName = watch('name')

  // Tự động cập nhật SKU khi tên biến thể thay đổi
  const handleVariantNameChange = (index: number, vName: string) => {
    if (productName && vName) {
      const sku = generateSKU(productName, vName)
      setValue(`variants.${index}.sku`, sku)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
          <Box className="text-primary h-5 w-5" /> Quản lý biến thể & SKU
        </h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => append({ variant_name: '', switch_type: '', sku: '', price: 0, stock_quantity: 0, image_url: '' })}
          className="gap-2 border-primary text-primary"
        >
          <Plus size={16} /> Thêm biến thể màu sắc
        </Button>
      </div>

      {errors?.variants?.message && (
        <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          {errors.variants.message}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => {
          const watchImageUrl = watch(`variants.${index}.image_url`)
          const variantErrors = errors?.variants?.[index]

          return (
            <Card key={field.id} className="relative overflow-hidden border-2 transition-all hover:border-primary/20 bg-background/50 text-left">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-4 text-left">
                  {/* Image Preview / Thumbnail */}
                  <div className="h-20 w-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center bg-muted shrink-0 overflow-hidden relative group">
                    {watchImageUrl ? (
                      <Image src={watchImageUrl} alt="Thumb" fill className="object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-muted-foreground opacity-20" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-[8px] text-white font-bold uppercase">Preview</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="grid gap-1.5">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground">Tên phiên bản (Màu sắc)</Label>
                      <Input 
                        placeholder="VD: White Heart" 
                        {...register(`variants.${index}.variant_name` as const, {
                          onChange: (e: any) => handleVariantNameChange(index, e.target.value)
                        })} 
                      />
                      {variantErrors?.variant_name && (
                        <p className="text-[10px] font-medium text-destructive">{variantErrors.variant_name.message}</p>
                      )}
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground">Mã SKU (Tự động)</Label>
                      <div className="relative">
                        <Hash className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-primary" />
                        <Input className="pl-8 bg-muted/30 font-mono text-xs font-bold" readOnly {...register(`variants.${index}.sku` as const)} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">Loại Switch</Label>
                    <div className="relative">
                      <Zap className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-amber-500" />
                      <Input className="pl-8" placeholder="VD: Cocoa Cream V2" {...register(`variants.${index}.switch_type` as const)} />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">Link ảnh Thumbnail</Label>
                    <Input placeholder="URL ảnh..." {...register(`variants.${index}.image_url` as const)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed text-left">
                   <div className="grid gap-1.5">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground">Giá bán lẻ</Label>
                      <Input type="number" {...register(`variants.${index}.price` as const)} />
                      {variantErrors?.price && (
                        <p className="text-[10px] font-medium text-destructive">{variantErrors.price.message}</p>
                      )}
                   </div>
                   <div className="grid gap-1.5">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground">Số lượng</Label>
                      <Input type="number" {...register(`variants.${index}.stock_quantity` as const)} />
                      {variantErrors?.stock_quantity && (
                        <p className="text-[10px] font-medium text-destructive">{variantErrors.stock_quantity.message}</p>
                      )}
                   </div>
                </div>

                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8"
                  disabled={fields.length === 1}
                >
                  <Trash2 size={16} />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
