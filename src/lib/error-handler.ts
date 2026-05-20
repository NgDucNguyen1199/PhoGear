import { toast } from 'sonner'

export type ActionResponse<T = any> = {
  success?: boolean | string
  error?: string
  data?: T
}

export function handleActionResponse<T>(
  response: ActionResponse<T>,
  options?: {
    onSuccess?: (data?: T) => void
    onError?: (error: string) => void
    successMessage?: string
    showToast?: boolean
  }
) {
  const { showToast = true } = options || {}

  if (response.error) {
    if (showToast) {
      toast.error(response.error)
    }
    options?.onError?.(response.error)
    return false
  }

  if (response.success) {
    const message = options?.successMessage || (typeof response.success === 'string' ? response.success : 'Thao tác thành công!')
    if (showToast) {
      toast.success(message)
    }
    options?.onSuccess?.(response.data)
    return true
  }

  return true
}
