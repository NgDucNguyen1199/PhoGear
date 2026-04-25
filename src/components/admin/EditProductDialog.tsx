'use client'

import { useState } from 'react'
import { updateProduct } from '@/actions/admin_products'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
import { Pencil, Loader2, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Product, ProductOption } from '@/types'
import { Badge } from '@/components/ui/badge'

export function EditProductDialog({ product, categories }: { product: Product, categories: any[] }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<ProductOption[]>(product.options || [])

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    formData.append('options', JSON.stringify(options))

    const result = await updateProduct(product.id, formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 text-left">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input id="name" name="name" defaultValue={product.name} required />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="brand">Thương hiệu</Label>
              <Input id="brand" name="brand" defaultValue={product.brand || ''} required />
            </div>
          </div>

          <div className="grid gap-2 text-left">
            <Label htmlFor="category_id">Danh mục</Label>
            <Select name="category_id" defaultValue={product.category_id || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* OPTIONS */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <Label className="text-base font-bold">Tùy chọn sản phẩm</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-1">
                <Plus size={14} /> Thêm loại
              </Button>
            </div>
            {options.map((opt, optIndex) => (
              <div key={optIndex} className="space-y-3 p-3 border rounded bg-background relative">
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7 text-destructive" onClick={() => removeOption(optIndex)}>
                  <X size={14} />
                </Button>
                <Input placeholder="Tên tùy chọn" value={opt.name} onChange={(e) => updateOptionName(optIndex, e.target.value)} />
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val, valIndex) => (
                    <Badge key={valIndex} variant="secondary" className="gap-1 pr-1">
                      {val}
                      <button type="button" onClick={() => removeOptionValue(optIndex, valIndex)}><X size={12} /></button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Giá trị" id={`edit-opt-val-${optIndex}`} onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addOptionValue(optIndex, e.currentTarget.value); e.currentTarget.value = '' } }} />
                  <Button type="button" variant="secondary" onClick={() => { const input = document.getElementById(`edit-opt-val-${optIndex}`) as HTMLInputElement; addOptionValue(optIndex, input.value); input.value = '' }}>Thêm</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Giá bán (VNĐ)</Label>
              <Input id="price" name="price" type="number" defaultValue={product.price} required />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="stock_quantity">Tồn kho</Label>
              <Input id="stock_quantity" name="stock_quantity" type="number" defaultValue={product.stock_quantity} required />
            </div>
          </div>

          <div className="grid gap-2 text-left">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" name="description" defaultValue={product.description || ''} rows={4} />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
