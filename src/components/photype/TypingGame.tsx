'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateText, getRank } from '@/lib/photype/dictionary'
import { saveTypingScore } from '@/actions/typing'
import { 
  Keyboard, 
  RotateCcw, 
  Trophy, 
  Music, 
  Volume2, 
  VolumeX, 
  Type,
  Share2,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import useSound from 'use-sound'
import confetti from 'canvas-confetti'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface TypingGameProps {
  profile: any
  initialLeaderboard: any[]
}

export function TypingGame({ profile, initialLeaderboard }: TypingGameProps) {
  // Game States
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeList] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [history, setHistory] = useState<{ time: number, wpm: number }[]>([])
  
  // Settings
  const [switchType, setSwitchType] = useState<'linear' | 'clicky'>('linear')
  const [isMuted, setIsMuted] = useState(false)
  const [mode, setMode] = useState<'normal' | 'advanced'>('normal')
  const [hasSoundFiles, setHasSoundFiles] = useState(true)

  // Sounds (Expects these to be in /public/sounds/)
  const [playLinear] = useSound('/sounds/creamy_linear.mp3', { 
    volume: 0.5,
    onloaderror: () => setHasSoundFiles(false)
  })
  const [playClicky] = useSound('/sounds/blue_clicky.mp3', { 
    volume: 0.5,
    onloaderror: () => setHasSoundFiles(false)
  })
  const [playSpace] = useSound('/sounds/spacebar.mp3', { 
    volume: 0.6,
    onloaderror: () => setHasSoundFiles(false)
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = useCallback(() => {
    setText(generateText(mode === 'normal' ? 40 : 60))
    setUserInput('')
    setTimeList(60)
    setIsActive(false)
    setIsFinished(false)
    setWpm(0)
    setAccuracy(100)
    setHistory([])
    if (inputRef.current) inputRef.current.focus()
  }, [mode])

  useEffect(() => {
    startGame()
  }, [startGame])

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeList((prev) => prev - 1)
        
        // Cập nhật biểu đồ theo thời gian thực
        const currentWpm = Math.round(((userInput.length / 5) / ((60 - timeLeft + 1) / 60)))
        setHistory(prev => [...prev, { time: 60 - timeLeft, wpm: currentWpm }])
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      finishGame()
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive, timeLeft, userInput])

  const finishGame = async () => {
    setIsActive(false)
    setIsFinished(true)
    
    const finalWpm = Math.round((userInput.length / 5) / 1) // 1 minute
    setWpm(finalWpm)

    const rank = getRank(finalWpm)
    if (finalWpm >= 100) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff']
      })
    }

    if (profile) {
      await saveTypingScore({
        wpm: finalWpm,
        accuracy: accuracy,
        mode: mode,
        rank_name: rank.name
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (isFinished) return

    if (!isActive && value.length > 0) {
      setIsActive(true)
    }

    // Play Sound
    if (!isMuted) {
      if (value.endsWith(' ')) {
        playSpace()
      } else {
        switchType === 'linear' ? playLinear() : playClicky()
      }
    }

    // Force Correction Logic: Nếu gõ sai thì không cho gõ tiếp
    const currentWordIndex = userInput.length
    if (value[value.length - 1] !== text[currentWordIndex] && value.length > userInput.length) {
      // toast.error('Gõ sai rồi!', { duration: 500 })
      return
    }

    setUserInput(value)

    // Tính accuracy đơn giản
    setAccuracy(100) // Vì force correction nên luôn 100% cho các ký tự đã nhập

    if (value.length === text.length) {
      finishGame()
    }
  }

  return (
    <div className="w-full max-w-5xl space-y-12 py-10">
      {/* Sound Warning */}
      {!hasSoundFiles && !isMuted && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-center text-xs text-red-400 animate-pulse">
          Cảnh báo: Không tìm thấy file âm thanh tại /public/sounds/. 
          Vui lòng thêm creamy_linear.mp3, blue_clicky.mp3 và spacebar.mp3 để có trải nghiệm tốt nhất.
        </div>
      )}

      {/* Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1a1a11] p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Badge variant={mode === 'normal' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setMode('normal')}>Normal</Badge>
            <Badge variant={mode === 'advanced' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setMode('advanced')}>Advanced</Badge>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase font-bold text-muted-foreground">Switch:</span>
            <button 
              className={`text-sm ${switchType === 'linear' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
              onClick={() => setSwitchType('linear')}
            >
              Linear
            </button>
            <button 
              className={`text-sm ${switchType === 'clicky' ? 'text-primary font-bold' : 'text-muted-foreground'}`}
              onClick={() => setSwitchType('clicky')}
            >
              Clicky
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={startGame}>
            <RotateCcw size={16} /> Reset (Tab)
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-8">
               <div className="text-6xl font-black text-primary/20 tabular-nums">
                {timeLeft}s
              </div>
              <div className="flex gap-8">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Live WPM</p>
                  <p className="text-3xl font-black">{Math.round(((userInput.length / 5) / ((60 - timeLeft + 1) / 60))) || 0}</p>
                </div>
              </div>
            </div>

            {/* Typing Area */}
            <div className="relative text-3xl md:text-4xl leading-relaxed font-mono tracking-tight select-none min-h-[200px]">
              <div className="absolute inset-0 text-white/10">
                {text}
              </div>
              <div className="relative text-primary break-words">
                {userInput}
                <motion.span 
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-[3px] h-8 bg-primary ml-1 align-middle"
                />
              </div>
              <input
                ref={inputRef}
                type="text"
                className="absolute inset-0 opacity-0 cursor-default"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault()
                    startGame()
                  }
                }}
                autoFocus
              />
            </div>
            
            {!isActive && (
              <div className="text-center mt-12 text-muted-foreground animate-pulse">
                Nhấn phím bất kỳ để bắt đầu...
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <Card className="lg:col-span-2 bg-[#1a1a1a] border-white/5">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                   Kết quả cuộc thi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 p-6 rounded-2xl text-center">
                    <p className="text-4xl font-black text-primary">{wpm}</p>
                    <p className="text-xs uppercase font-bold text-muted-foreground mt-2">WPM</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl text-center">
                    <p className="text-4xl font-black text-green-500">{accuracy}%</p>
                    <p className="text-xs uppercase font-bold text-muted-foreground mt-2">Accuracy</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl text-center">
                    <p className={`text-xl font-black ${getRank(wpm).color}`}>{getRank(wpm).name}</p>
                    <p className="text-xs uppercase font-bold text-muted-foreground mt-2">Rank</p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                      <XAxis dataKey="time" hide />
                      <YAxis stroke="#444" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                        itemStyle={{ color: '#ff4500' }}
                      />
                      <Line type="monotone" dataKey="wpm" stroke="#ff4500" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex gap-4">
                  <Button size="lg" className="flex-1 font-bold" onClick={startGame}>
                    Thử lại <RotateCcw className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="flex-1 font-bold">
                    Chia sẻ <Share2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-white/5">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                   Bảng xếp hạng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {initialLeaderboard.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 font-bold ${index < 3 ? 'text-primary' : 'text-muted-foreground'}`}>{index + 1}</span>
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                          {item.profiles?.full_name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-medium truncate max-w-[100px]">{item.profiles?.full_name}</span>
                      </div>
                      <span className="text-sm font-black">{item.wpm} <span className="text-[10px] text-muted-foreground">WPM</span></span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
