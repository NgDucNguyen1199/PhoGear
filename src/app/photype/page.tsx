import { getProfile } from '@/actions/auth'
import { getLeaderboard } from '@/actions/typing'
import { Navbar } from '@/components/layout/Navbar'
import { TypingGame } from '@/components/photype/TypingGame'
import { Award } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
  title: 'Pho Type - Thử thách tốc độ gõ phím | Pho Gear',
}

interface LeaderboardEntry {
  id: string
  wpm: number
  accuracy: number
  rank_name: string
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export default async function PhoTypePage() {
  const profile = await getProfile()
  const leaderboard = await getLeaderboard() as unknown as LeaderboardEntry[]

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar user={profile} />
      <main className="flex-grow flex flex-col items-center py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-4">PHO TYPE</h1>
          <p className="text-slate-500 font-medium">Luyện gõ phím chuyên nghiệp theo phong cách Pho Gear.</p>
        </div>
        <TypingGame />
        
        {/* Leaderboard Section */}
        <div className="w-full max-w-5xl px-4 mt-20">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                <Award size={20} />
              </div>
              Bảng xếp hạng thần tốc
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((entry, index: number) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 w-4">{index + 1}</span>
                      <div className="h-10 w-10 rounded-full bg-white border flex items-center justify-center overflow-hidden relative">
                        {entry.profiles?.avatar_url ? (
                          <Image src={entry.profiles.avatar_url} alt="Avatar" fill className="object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-slate-400">{entry.profiles?.full_name?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{entry.profiles?.full_name || 'Anonymous'}</p>
                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{entry.rank_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900 leading-none">{Math.round(entry.wpm)}</p>
                      <p className="text-[10px] font-bold text-slate-400">WPM</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-slate-400 italic">
                  Chưa có kỷ lục nào được ghi nhận.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
