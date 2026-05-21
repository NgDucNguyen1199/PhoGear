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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar user={profile} />
      <main className="flex-grow flex flex-col items-center py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tight mb-4">PHO TYPE</h1>
          <p className="text-muted-foreground font-medium">Luyện gõ phím chuyên nghiệp theo phong cách Pho Gear.</p>
        </div>
        
        <div className="w-full max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-12">
            <TypingGame />
            <UserTypingStats />
          </div>

          {/* Sidebar Leaderboard */}
          <div className="lg:col-span-1 h-[700px]">
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  )
}
