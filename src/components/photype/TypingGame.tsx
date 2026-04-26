'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { generateText } from '@/lib/photype/dictionary'
import useSound from 'use-sound'
import confetti from 'canvas-confetti'
import { 
  Trophy, RefreshCw, Zap, 
  Share2, Volume2, VolumeX,
  Timer, Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { cn } from '@/lib/utils'
import { saveTypingScore } from '@/actions/typing'
import { toast } from 'sonner'

type Rank = 'Rùa con' | 'Tay đua' | 'Thần sấm' | 'Pho Master'

export function TypingGame() {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [wpmData, setWpmData] = useState<{sec: number, wpm: number}[]>([])
  const [switchType, setSwitchType] = useState<'linear' | 'clicky'>('linear')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Audio Hooks (Files should be in public/sounds/)
  const [playLinear] = useSound('/sounds/creamy_linear.mp3', { volume: 0.4 })
  const [playClicky] = useSound('/sounds/blue_clicky.mp3', { volume: 0.4 })
  const [playSpace] = useSound('/sounds/spacebar.mp3', { volume: 0.5 })

  const startGame = useCallback(() => {
    setText(generateText(45))
    setUserInput('')
    setTimeLeft(60)
    setIsActive(false)
    setIsFinished(false)
    setWpmData([])
    if (inputRef.current) inputRef.current.focus()
  }, [])

  useEffect(() => {
    startGame()
  }, [startGame])

  const stats = useMemo(() => {
    const correctChars = userInput.split('').filter((char, i) => char === text[i]).length
    const timeElapsed = (60 - timeLeft) / 60
    const currentWpm = Math.round((correctChars / 5) / (timeElapsed || 1/60)) || 0
    const accuracy = Math.round((correctChars / (userInput.length || 1)) * 100)
    
    let rank: Rank = 'Rùa con'
    if (currentWpm >= 100) rank = 'Pho Master'
    else if (currentWpm >= 60) rank = 'Thần sấm'
    else if (currentWpm >= 30) rank = 'Tay đua'

    return { wpm: currentWpm, accuracy, rank }
  }, [userInput, text, timeLeft])

  const finishGame = useCallback(async () => {
    setIsActive(false)
    setIsFinished(true)
    
    if (stats.wpm >= 100) {
      confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 },
        colors: ['#f97316', '#fb923c', '#ffffff'] 
      })
    }

    // Tự động lưu điểm
    setIsSaving(true)
    const result = await saveTypingScore({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      mode: 'normal',
      rank_name: stats.rank
    })
    setIsSaving(false)

    if (result.success) {
      toast.success('Đã lưu kết quả vào bảng xếp hạng!')
    }
  }, [stats])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
        setWpmData(prev => [...prev, { sec: 60 - timeLeft, wpm: stats.wpm }])
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      finishGame()
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isActive, timeLeft, stats.wpm, finishGame])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFinished) return
    if (!isActive && e.key.length === 1) setIsActive(true)

    if (e.key === 'Tab') {
      e.preventDefault()
      startGame()
      return
    }

    if (e.key === 'Escape') {
      setIsActive(false)
      startGame()
      return
    }

    // Force correction logic
    const isCurrentCharCorrect = userInput[userInput.length - 1] === text[userInput.length - 1]
    if (userInput.length > 0 && !isCurrentCharCorrect && e.key !== 'Backspace') {
      e.preventDefault()
      return
    }

    if (soundEnabled && e.key !== 'Backspace' && e.key !== 'Shift') {
      if (e.key === ' ') {
        playSpace()
      } else {
        if (switchType === 'linear') {
          playLinear()
        } else {
          playClicky()
        }
      }
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
        <div className="flex items-center gap-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-[140px]">
            <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
              <Zap size={20} className="fill-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tốc độ</p>
              <p className="text-xl font-black text-slate-900">{stats.wpm} <span className="text-xs font-medium">WPM</span></p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 min-w-[140px]">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
              <Timer size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Thời gian</p>
              <p className="text-xl font-black text-slate-900">{timeLeft}s</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm border border-slate-100 px-6">
          <span className="text-xs font-bold text-slate-500 uppercase">{switchType} Sound</span>
          <Switch 
            checked={switchType === 'clicky'} 
            onCheckedChange={(v) => setSwitchType(v ? 'clicky' : 'linear')}
            className="data-[state=checked]:bg-orange-500"
          />
          <div className="h-4 w-px bg-slate-200 mx-2" />
          <Button variant="ghost" size="sm" onClick={() => setSoundEnabled(!soundEnabled)} className="h-8 w-8 p-0">
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
        </div>
      </div>

      {!isFinished ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative bg-white p-12 rounded-[2.5rem] shadow-xl shadow-orange-500/5 border border-slate-100"
        >
          <input
            ref={inputRef}
            type="text"
            className="absolute inset-0 opacity-0 cursor-default"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          
          <div className="text-3xl font-mono leading-[1.8] select-none tracking-tight text-left h-48 overflow-hidden">
            {text.split('').map((char, i) => {
              let state = 'pending'
              if (i < userInput.length) {
                state = userInput[i] === text[i] ? 'correct' : 'wrong'
              }
              return (
                <span key={i} className={cn(
                  "relative transition-all duration-150 rounded-sm px-[1px]",
                  state === 'pending' && "text-slate-200",
                  state === 'correct' && "text-slate-800",
                  state === 'wrong' && "text-red-500 bg-red-50",
                  i === userInput.length && "bg-orange-500/10"
                )}>
                  {i === userInput.length && (
                    <motion.span 
                      layoutId="caret"
                      className="absolute -left-0.5 top-1 w-0.5 h-8 bg-orange-500"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                  {char}
                </span>
              )
            })}
          </div>

          <div className="mt-12 flex justify-center items-center gap-8 text-slate-400">
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
               <kbd className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-slate-500">Tab</kbd>
               <span>Reset nhanh</span>
             </div>
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
               <kbd className="px-2 py-1 bg-slate-100 rounded border border-slate-200 text-slate-500">Esc</kbd>
               <span>Dừng lại</span>
             </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Card Kết quả */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-orange-500/5 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Trophy size={100} className="text-orange-500" />
              </div>
              
              <p className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Kết quả cuối cùng</p>
              <h2 className="text-8xl font-black text-slate-900 mb-2">{stats.wpm}</h2>
              <p className="text-xl font-bold text-slate-500 mb-8">Từ mỗi phút</p>
              
              <div className="inline-flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                <Award className="text-orange-500" size={24} />
                <span className="text-lg font-black text-slate-700">{stats.rank}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between px-10">
               <div className="text-center border-r pr-10">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Chính xác</p>
                 <p className="text-2xl font-black text-slate-900">{stats.accuracy}%</p>
               </div>
               <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Ký tự</p>
                 <p className="text-2xl font-black text-slate-900">{userInput.length}</p>
               </div>
            </div>

            <div className="flex gap-4">
               <Button onClick={startGame} size="lg" className="flex-1 h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg gap-2 shadow-lg shadow-orange-500/20">
                 <RefreshCw size={20} /> CHƠI LẠI
               </Button>
               <Button variant="outline" size="lg" className="h-16 w-16 rounded-2xl border-slate-200" disabled={isSaving}>
                 <Share2 size={20} />
               </Button>
            </div>
          </div>

          {/* Card Biểu đồ */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Zap size={16} className="text-orange-500" /> Tốc độ theo thời gian
              </h3>
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <div className="h-2 w-2 rounded-full bg-slate-100" />
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wpmData}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="sec" hide />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #f1f5f9', 
                      borderRadius: '16px', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }}
                    labelClassName="hidden"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="#f97316" 
                    strokeWidth={5} 
                    dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 8, strokeWidth: 0 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
