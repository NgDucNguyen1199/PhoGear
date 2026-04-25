import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { User, Mail, Calendar, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const profile = await getProfile()
  if (!profile) redirect('/login')

  const supabase = await createClient()
  const { data: scores } = await supabase
    .from('typing_scores')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={profile} />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="col-span-1">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold mb-4">
                  {profile.full_name?.charAt(0) || <User />}
                </div>
                <h2 className="text-xl font-bold">{profile.full_name}</h2>
                <p className="text-sm text-muted-foreground uppercase mt-1 tracking-widest">{profile.role}</p>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Mã định danh</p>
                    <p className="font-mono text-sm">{profile.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Ngày tham gia</p>
                    <p className="text-sm">{new Date(profile.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mt-12 flex items-center gap-2">
            <Award className="text-primary" /> Thành tích Pho Type gần đây
          </h2>
          
          <div className="grid gap-4">
            {scores && scores.length > 0 ? (
              scores.map((score) => (
                <Card key={score.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-black text-primary">{score.wpm}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">WPM</p>
                      </div>
                      <div className="text-center border-l pl-6">
                        <p className="text-lg font-bold">{score.accuracy}%</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">Độ chính xác</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{score.rank_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(score.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground italic py-8 text-center border-2 border-dashed rounded-xl">
                Bạn chưa tham gia luyện gõ phím. Hãy thử ngay tại Pho Type!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
