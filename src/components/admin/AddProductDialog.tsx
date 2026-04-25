'use client'

import { useState } from 'react'
import { createProduct } from '@/actions/admin_products'
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
import { Plus, Loader2, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { ProductOption } from '@/types'

export function AddProductDialog({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // State quản lý các tùy chọn (Options)
  const [options, setOptions] = useState<ProductOption[]>([])

  const addOption = () => {
    setOptions([...options, { name: '', values: [] }])
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(event.currentTarget)
    // Chuyển mảng options thành chuỗi JSON để gửi qua Server Action
    formData.append('options', JSON.stringify(options))

    const result = await createProduct(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
      setOpen(false)
      setOptions([]) // Reset options
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants({ className: 'gap-2' })}>
        <Plus size={18} /> Thêm sản phẩm
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 text-left">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input id="name" name="name" placeholder="Ví dụ: Keychron Q1" required />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="brand">Thương hiệu</Label>
              <Input id="brand" name="brand" placeholder="Ví dụ: Keychron" required />
            </div>
          </div>

          <div className="grid gap-2 text-left">
            <Label htmlFor="category_id">Danh mục</Label>
            <Select name="category_id" required>
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

          {/* QUẢN LÝ OPTIONS */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <Label className="text-base font-bold">Tùy chọn sản phẩm (Màu sắc, Switch...)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-1">
                <Plus size={14} /> Thêm loại
              </Button>
            </div>
            
            {options.map((opt, optIndex) => (
              <div key={optIndex} className="space-y-3 p-3 border rounded bg-background relative">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1 h-7 w-7 text-destructive"
                  onClick={() => removeOption(optIndex)}
                >
                  <X size={14} />
                </Button>
                
                <div className="grid gap-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Tên tùy chọn</Label>
                  <Input 
                    placeholder="VD: Màu sắc hoặc Loại Switch" 
                    value={opt.name}
                    onChange={(e) => updateOptionName(optIndex, e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Các giá trị</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {opt.values.map((val, valIndex) => (
                      <Badge key={valIndex} variant="secondary" className="gap-1 pr-1">
                        {val}
                        <button type="button" onClick={() => removeOptionValue(optIndex, valIndex)}>
                          <X size={12} className="hover:text-destructive" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Nhập giá trị và nhấn Thêm" 
                      id={`opt-val-${optIndex}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.currentTarget
                          addOptionValue(optIndex, input.value)
                          input.value = ''
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => {
                        const input = document.getElementById(`opt-val-${optIndex}`) as HTMLInputElement
                        addOptionValue(optIndex, input.value)
                        input.value = ''
                      }}
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="grid gap-2">
              <Label htmlFor="price">Giá bán (VNĐ)</Label>
              <Input id="price" name="price" type="number" placeholder="3000000" required />
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="stock_quantity">Số lượng tồn kho</Label>
              <Input id="stock_quantity" name="stock_quantity" type="number" placeholder="10" required />
            </div>
          </div>

          <div className="grid gap-2 text-left">
            <Label htmlFor="description">Mô tả sản phẩm</Label>
            <Textarea id="description" name="description" placeholder="Nhập mô tả chi tiết sản phẩm..." rows={4} />
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu sản phẩm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
