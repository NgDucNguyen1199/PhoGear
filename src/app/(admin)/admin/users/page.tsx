import { getProfiles } from '@/actions/admin_users'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RoleSelector } from '@/components/admin/RoleSelector'
import { User, Mail, Calendar } from 'lucide-react'

export default async function AdminUsersPage() {
  const profiles = await getProfiles()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Người dùng</h1>
        <p className="text-muted-foreground">Quản lý tài khoản và phân quyền người dùng trong hệ thống.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách thành viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-background rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Email (ID)</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead className="w-[200px]">Phân quyền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.length > 0 ? (
                  profiles.map((profile: any) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {profile.full_name?.charAt(0) || <User className="h-4 w-4" />}
                          </div>
                          <span className="font-medium">{profile.full_name || 'Người dùng ẩn danh'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {profile.id.slice(0, 13)}...
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(profile.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <RoleSelector userId={profile.id} currentRole={profile.role} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground italic">
                      Hệ thống chưa có người dùng nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
