'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Settings, 
  Bell, 
  Shield, 
  Save,
  RotateCcw,
  Loader2,
  History,
  Zap,
  Timer
} from 'lucide-react'
import { updateSystemSettings, getLoginHistory } from '@/actions/admin_settings'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const settingsFormSchema = z.object({
  siteName: z.string().min(2, "Tên trang web phải có ít nhất 2 ký tự"),
  contactEmail: z.string().email("Email không hợp lệ"),
  currency: z.string().min(1, "Vui lòng nhập tiền tệ"),
  language: z.string().min(1, "Vui lòng nhập ngôn ngữ"),
  orderNotifications: z.boolean(),
  weeklyReports: z.boolean(),
  twoFactorAuth: z.boolean(),
  flashSaleEnabled: z.boolean(),
  flashSaleEndTime: z.string().optional().nullable(),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

interface SettingsFormProps {
  initialSettings: any
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [loginHistory, setLoginHistory] = useState<any[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      siteName: initialSettings.site_name || "Pho Gear",
      contactEmail: initialSettings.contact_email || "contact@phogear.com",
      currency: initialSettings.currency || "VND",
      language: initialSettings.language || "vi",
      orderNotifications: initialSettings.order_notifications ?? true,
      weeklyReports: initialSettings.weekly_reports ?? false,
      twoFactorAuth: initialSettings.two_factor_auth ?? false,
      flashSaleEnabled: initialSettings.flash_sale_enabled ?? false,
      flashSaleEndTime: initialSettings.flash_sale_end_time ? new Date(new Date(initialSettings.flash_sale_end_time).getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16) : "",
    },
  })

  async function handleViewHistory() {
    setIsHistoryOpen(true)
    setIsLoadingHistory(true)
    const history = await getLoginHistory()
    setLoginHistory(history)
    setIsLoadingHistory(false)
  }

  async function onSubmit(values: SettingsFormValues) {
    setIsLoading(true)
    
    // Create FormData manually to match the server action expectation
    const formData = new FormData()
    formData.append('siteName', values.siteName)
    formData.append('contactEmail', values.contactEmail)
    formData.append('currency', values.currency)
    formData.append('language', values.language)
    if (values.orderNotifications) formData.append('orderNotifications', 'on')
    if (values.weeklyReports) formData.append('weeklyReports', 'on')
    if (values.twoFactorAuth) formData.append('twoFactorAuth', 'on')
    if (values.flashSaleEnabled) formData.append('flashSaleEnabled', 'on')
    if (values.flashSaleEndTime) formData.append('flashSaleEndTime', values.flashSaleEndTime)

    const result = await updateSystemSettings(formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error, {
        duration: 5000,
      })
    } else {
      toast.success(result.success)
      // Update form default values to the new ones to prevent "Hoàn tác" from reverting to old data
      form.reset(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {/* FLASH SALE CONFIGURATION */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-background ring-2 ring-primary/20">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="text-primary fill-primary" size={20} /> Cấu hình Flash Sale
            </CardTitle>
            <CardDescription>Bật/Tắt chương trình khuyến mãi giờ vàng trên toàn trang chủ.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <FormField
              control={form.control}
              name="flashSaleEnabled"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border">
                  <div>
                    <FormLabel className="text-base font-bold">Kích hoạt Flash Sale</FormLabel>
                    <FormDescription>Khi bật, khu vực Flash Sale sẽ xuất hiện ở trang chủ.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="flashSaleEndTime"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Timer size={16} className="text-primary" />
                    <FormLabel className="font-bold">Thời gian kết thúc</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      className="max-w-md h-12 rounded-xl"
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Thời điểm bộ đếm ngược kết thúc. Hệ thống sẽ tự động hiển thị thời gian còn lại dựa trên mốc này.
                  </FormDescription>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>        {/* Cấu hình chung */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-background">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Settings className="text-primary" size={20} /> Cấu hình chung
            </CardTitle>
            <CardDescription>Thiết lập các thông tin cơ bản của cửa hàng.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên trang web</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Pho Gear" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email liên hệ</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="contact@phogear.com" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiền tệ mặc định</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="VND" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngôn ngữ mặc định</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tiếng Việt" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Thông báo */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-background">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Bell className="text-primary" size={20} /> Thông báo
            </CardTitle>
            <CardDescription>Quản lý cách hệ thống gửi thông báo cho bạn.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="orderNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-2xl">
                  <div>
                    <FormLabel className="text-base font-bold">Thông báo đơn hàng mới</FormLabel>
                    <FormDescription>Nhận email khi có khách hàng đặt hàng mới.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weeklyReports"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-2xl">
                  <div>
                    <FormLabel className="text-base font-bold">Báo cáo doanh thu hàng tuần</FormLabel>
                    <FormDescription>Gửi báo cáo tổng kết doanh thu vào mỗi sáng thứ Hai.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Bảo mật */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-background">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Shield className="text-primary" size={20} /> Bảo mật
            </CardTitle>
            <CardDescription>Cấu hình các thiết lập bảo mật cho trang quản trị.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
             <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="twoFactorAuth"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 border rounded-2xl bg-orange-500/5 border-orange-500/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-base font-bold">Bắt buộc xác thực 2 lớp (2FA)</FormLabel>
                          <Badge variant="outline" className="text-orange-500 border-orange-500/30 text-[10px]">Khuyên dùng</Badge>
                        </div>
                        <FormDescription className="max-w-md">
                          Khi bật tính năng này, tất cả tài khoản Quản trị viên sẽ bắt buộc phải thiết lập và sử dụng 2FA để truy cập trang quản trị. Giúp ngăn chặn 99.9% các cuộc tấn công chiếm quyền điều khiển tài khoản.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Separator />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Lịch sử đăng nhập</p>
                  <Button variant="outline" size="sm" type="button" onClick={handleViewHistory}>
                    Xem chi tiết
                  </Button>
                </div>
             </div>
          </CardContent>
        </Card>

        {/* Login History Dialog */}
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="text-primary" size={20} /> Lịch sử đăng nhập
              </DialogTitle>
              <DialogDescription>
                Hiển thị 50 lượt đăng nhập gần nhất vào hệ thống.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Đang tải lịch sử...</p>
                </div>
              ) : loginHistory.length > 0 ? (
                <div className="border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Địa chỉ IP</TableHead>
                        <TableHead>Thiết bị / Trình duyệt</TableHead>
                        <TableHead>Thời gian</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loginHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.full_name}</TableCell>
                          <TableCell className="text-xs font-mono">{item.ip_address}</TableCell>
                          <TableCell className="text-xs max-w-[200px] truncate" title={item.user_agent}>
                            {item.user_agent}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleString('vi-VN')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 border rounded-xl border-dashed">
                  <p className="text-muted-foreground italic">Chưa có dữ liệu lịch sử đăng nhập.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" type="button" onClick={() => form.reset()} className="gap-2" disabled={isLoading}>
            <RotateCcw size={16} /> Hoàn tác
          </Button>
          <Button type="submit" className="gap-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Form>
  )
}
