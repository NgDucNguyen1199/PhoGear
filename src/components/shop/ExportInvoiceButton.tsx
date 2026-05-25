'use client'

import { Button } from '@/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { generateInvoiceDocx } from '@/actions/invoices'
import { toast } from 'sonner'

interface ExportInvoiceButtonProps {
  orderId: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function ExportInvoiceButton({ orderId, variant = "outline", size = "sm" }: ExportInvoiceButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    try {
      setLoading(true)
      const result = await generateInvoiceDocx(orderId)
      
      if (result.base64) {
        // Tạo link download từ base64
        const link = document.createElement('a')
        link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${result.base64}`
        link.download = result.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Hóa đơn đã được tải về!')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Lỗi khi xuất hóa đơn. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleExport} 
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4" />
      )}
      Xuất hóa đơn
    </Button>
  )
}
