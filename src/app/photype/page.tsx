import { getProfile } from '@/actions/auth'
import { getLeaderboard } from '@/actions/typing'
import { Navbar } from '@/components/layout/Navbar'
import { TypingGame } from '@/components/photype/TypingGame'

export const metadata = {
  title: 'Pho Type - Thử thách tốc độ gõ phím | Pho Gear',
}

export default async function PhoTypePage() {
  const profile = await getProfile()
  const leaderboard = await getLeaderboard()

  return (
    <div className="flex min-h-screen flex-col bg-[#111111] text-[#eeeeee]">
      <Navbar user={profile} />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <TypingGame profile={profile} initialLeaderboard={leaderboard} />
      </main>
    </div>
  )
}
