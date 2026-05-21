import { getProfile } from '@/actions/auth'
import { Navbar } from '@/components/layout/Navbar'
import { TypingGame } from '@/components/photype/TypingGame'
import { UserTypingStats } from '@/components/photype/UserTypingStats'
import { Leaderboard } from '@/components/photype/Leaderboard'

export const metadata = {
  title: 'Pho Type - Thử thách tốc độ gõ phím | Pho Gear',
}

export default async function PhoTypePage() {
  const profile = await getProfile()

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0c10] text-foreground relative overflow-hidden">
      {/* Background Decor - Softer and more spread out */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[5%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[150px] opacity-50" />
        <div className="absolute top-[30%] -right-[5%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px] opacity-30" />
        <div className="absolute bottom-0 left-[20%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <Navbar user={profile} />
      <main className="flex-grow flex flex-col items-center py-12 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="border-primary/20 text-primary px-4 py-1 rounded-full font-black uppercase tracking-[0.3em]">Skill Lab</Badge>
          <h1 className="text-7xl font-black tracking-tight italic uppercase">PHO TYPE</h1>
          <p className="text-muted-foreground font-medium text-lg max-w-xl mx-auto">Luyện gõ phím chuyên nghiệp theo phong cách Pho Gear. Chinh phục tốc độ, dẫn đầu bảng xếp hạng.</p>
        </div>
        
        <div className="w-full max-w-7xl px-4 flex flex-col gap-24 pb-32">
          {/* Main Game Area - Full Width */}
          <div className="space-y-24">
            <TypingGame />
            <UserTypingStats />
          </div>

          {/* Footer Leaderboard - Horizontal Grid */}
          <div className="w-full">
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  )
}

import { Badge } from '@/components/ui/badge'
