'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/actions/admin_orders'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipped', label: 'Đang giao hàng' },
  { value: 'delivered', label: 'Đã giao hàng' },
  { value: 'cancelled', label: 'Đã hủy' },
]

export function StatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return
    setIsLoading(true)
    const result = await updateOrderStatus(orderId, newStatus)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
      <Select defaultValue={currentStatus} onValueChange={handleStatusChange} disabled={isLoading}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
