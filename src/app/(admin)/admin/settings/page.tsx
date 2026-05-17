import { getSystemSettings } from '@/actions/admin_settings'
import { SettingsForm } from '@/components/admin/SettingsForm'

export const metadata = {
  title: 'Cài đặt hệ thống | Quản trị Pho Gear',
}

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground">Quản lý cấu hình toàn cục và thiết lập hệ thống.</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  )
}
