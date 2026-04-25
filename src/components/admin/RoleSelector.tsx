'use client'

import { useState } from 'react'
import { updateUserRole } from '@/actions/admin_users'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const roleOptions = [
  { value: 'customer', label: 'Khách hàng' },
  { value: 'admin', label: 'Quản trị viên' },
]

export function RoleSelector({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleChange = async (newRole: string | null) => {
    if (!newRole) return
    setIsLoading(true)
    const result = await updateUserRole(userId, newRole)
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
      <Select defaultValue={currentRole} onValueChange={handleRoleChange} disabled={isLoading}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roleOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
