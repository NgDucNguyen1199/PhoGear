'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { generateText, generateQuote } from '@/lib/photype/dictionary'
import useSound from 'use-sound'
import confetti from 'canvas-confetti'
import { 
  Trophy, RefreshCw, Zap, 
  Share2, Volume2, VolumeX,
  Timer, Award, MousePointer2, Globe2,
  Type, Quote, EyeOff, ShieldAlert
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
type Language = 'vi' | 'en'
type GameTab = 'time' | 'words' | 'quote'

export function TypingGame() {
  // Config
  const [language, setLanguage] = useState<Language>('vi')
  const [activeTab, setActiveTab] = useState<GameTab>('time')
  const [activeConfig, setActiveConfig] = useState<number>(30)
  const [isPunctuation, setIsPunctuation] = useState(false)
  const [isNumbers, setIsNumbers] = useState(false)
  const [isCombo, setIsCombo] = useState(false)
  const [isMemory, setIsMemory] = useState(false)
  
  // States
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentInput, setCurrentWordInput] = useState('')
  const [completedWords, setCompletedWords] = useState<{word: string, isCorrect: boolean}[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [wpmData, setWpmData] = useState<{sec: number, wpm: number}[]>([])
  const [switchType, setSwitchType] = useState<'linear' | 'clicky'>('linear')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isFocused, setIsFocused] = useState(true)
  const [showText, setShowText] = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const timerId = useRef<NodeJS.Timeout | null>(null)

  // Refs to store latest values for callbacks without re-triggering effects
  const statsRef = useRef<any>(null)

  // Audio
  const [playLinear] = useSound('/sounds/creamy_linear.mp3', { volume: 0.4 })
  const [playClicky] = useSound('/sounds/blue_clicky.mp3', { volume: 0.4 })
  const [playSpace] = useSound('/sounds/spacebar.mp3', { volume: 0.5 })

  const stats = useMemo(() => {
    const correctCharsFromCompleted = completedWords.reduce((acc, curr) => curr.isCorrect ? acc + curr.word.length + 1 : acc, 0)
    const currentWord = words[currentWordIndex] || ''
    let currentCorrect = 0
    for(let i=0; i < currentInput.length; i++) if(currentInput[i] === currentWord[i]) currentCorrect++
    
    const totalCorrect = correctCharsFromCompleted + currentCorrect
    let elapsed = activeTab === 'time' ? (activeConfig - timeLeft) : (60 - timeLeft)
    if (elapsed <= 0) elapsed = 0.001

    const wpm = Math.round((totalCorrect / 5) / (elapsed / 60)) || 0
    const typed = completedWords.reduce((acc, curr) => acc + curr.word.length + 1, 0) + currentInput.length
    const acc = typed > 0 ? Math.round((totalCorrect / typed) * 100) : 100
    
    let rank: Rank = 'Rùa con'
    if (wpm >= 100) rank = 'Pho Master'
    else if (wpm >= 60) rank = 'Thần sấm'
    else if (wpm >= 30) rank = 'Tay đua'

    const result = { wpm, accuracy: acc, rank }
    statsRef.current = result // Keep ref updated
    return result
  }, [completedWords, currentInput, words, currentWordIndex, timeLeft, activeConfig, activeTab])

  const finishGame = useCallback(async () => {
    setIsActive(false)
    setIsFinished(true)
    if (timerId.current) clearInterval(timerId.current)
    
    const finalStats = statsRef.current
    if (finalStats?.wpm >= 100) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#f97316', '#ffffff'] })
    }

    setIsSaving(true)
    await saveTypingScore({
      wpm: finalStats?.wpm || 0,
      accuracy: finalStats?.accuracy || 0,
      mode: `${activeTab}_${language}`,
      rank_name: finalStats?.rank || 'Rùa con'
    })
    setIsSaving(false)
  }, [activeTab, language])

  const startGame = useCallback(() => {
    if (timerId.current) {
        clearInterval(timerId.current)
        timerId.current = null
    }
    
    const raw = activeTab === 'quote' ? generateQuote(language) : generateText(activeTab === 'words' ? activeConfig : 100, language, { punctuation: isPunctuation, numbers: isNumbers })
    
    setWords(raw.split(' '))
    setCurrentWordIndex(0)
    setCurrentWordInput('')
    setCompletedWords([])
    setTimeLeft(activeTab === 'time' ? activeConfig : 60)
    setIsActive(false)
    setIsFinished(false)
    setWpmData([])
    setShowText(true)
    
    if (isMemory) {
        const timeout = setTimeout(() => {
            setShowText(false)
        }, 3000)
        return () => clearTimeout(timeout)
    }

    setTimeout(() => inputRef.current?.focus(), 10)
  }, [language, activeTab, activeConfig, isPunctuation, isNumbers, isMemory])

  useEffect(() => {
    startGame()
    return () => { if (timerId.current) clearInterval(timerId.current) }
  }, [startGame])

  // Independent Timer Logic
  useEffect(() => {
    if (isActive && !isFinished) {
      timerId.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerId.current!)
            timerId.current = null
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (timerId.current) clearInterval(timerId.current) }
  }, [isActive, isFinished]) // NO finishGame or stats in dependencies

  // Auto-finish listener
  useEffect(() => {
    if (timeLeft === 0 && isActive && !isFinished) {
      finishGame()
    }
  }, [timeLeft, isActive, isFinished, finishGame])

  useEffect(() => {
    if (isActive && timeLeft < (activeTab === 'time' ? activeConfig : 60) && timeLeft > 0) {
        setWpmData(prev => [...prev, { sec: (activeTab === 'time' ? activeConfig : 60) - timeLeft, wpm: stats.wpm }])
    }
  }, [timeLeft, isActive, stats.wpm, activeTab, activeConfig])

  // Scroll
  useEffect(() => {
    const el = wordRefs.current[currentWordIndex]
    if (el && scrollRef.current) {
        const top = el.offsetTop
        scrollRef.current.style.transform = top >= 80 ? `translateY(-${top - 10}px)` : `translateY(0)`
    }
  }, [currentWordIndex])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return
    const val = e.target.value
    if (!isActive && val.length > 0) {
      setIsActive(true)
      if (isMemory) setShowText(false)
    }

    if (isCombo && val.length > currentInput.length) {
        if (val[val.length-1] !== words[currentWordIndex][val.length-1] && val[val.length-1] !== ' ') {
            toast.error("COMBO BROKEN!"); startGame(); return
        }
    }

    if (val.endsWith(' ')) {
        const typed = val.trim()
        const target = words[currentWordIndex]
        if (!target) return
        if (isCombo && typed !== target) { toast.error("COMBO BROKEN!"); startGame(); return }
        setCompletedWords(prev => [...prev, { word: target, isCorrect: typed === target }])
        setCurrentWordIndex(prev => prev + 1)
        setCurrentWordInput('')
        if (soundEnabled) playSpace()
        if ((activeTab === 'words' || activeTab === 'quote') && currentWordIndex + 1 >= words.length) finishGame()
        return
    }

    setCurrentWordInput(val)
    if (soundEnabled && val.length > currentInput.length) switchType === 'linear' ? playLinear() : playClicky()
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4" onClick={() => inputRef.current?.focus()}>
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
            <Globe2 size={14} className="text-slate-400" />
            <div className="flex bg-slate-100 rounded-lg p-0.5">
                {['vi', 'en'].map(l => (
                    <button key={l} onClick={() => setLanguage(l as Language)} className={cn("px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all", language === l ? "bg-white text-orange-500 shadow-sm" : "text-slate-400")}>{l}</button>
                ))}
            </div>
        </div>
        <div className="flex items-center gap-4 pr-4 border-r border-slate-200">
            <button onClick={() => { setActiveTab('time'); setActiveConfig(30); }} className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase transition-all", activeTab === 'time' ? "text-orange-500" : "text-slate-400 hover:text-slate-600")}><Timer size={14} /> time</button>
            <button onClick={() => { setActiveTab('words'); setActiveConfig(25); }} className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase transition-all", activeTab === 'words' ? "text-orange-500" : "text-slate-400 hover:text-slate-600")}><Type size={14} /> words</button>
            <button onClick={() => { setActiveTab('quote'); }} className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase transition-all", activeTab === 'quote' ? "text-orange-500" : "text-slate-400 hover:text-slate-600")}><Quote size={14} /> quote</button>
        </div>
        {activeTab !== 'quote' && (
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
                {(activeTab === 'time' ? [15, 30, 60, 120] : [10, 25, 50, 100]).map(v => (
                    <button key={v} onClick={() => setActiveConfig(v)} className={cn("text-[10px] font-black transition-all", activeConfig === v ? "text-orange-500 scale-110" : "text-slate-400 hover:text-slate-600")}>{v}</button>
                ))}
            </div>
        )}
        <div className="flex items-center gap-4">
            <button onClick={() => setIsPunctuation(!isPunctuation)} className={cn("text-[10px] font-black uppercase transition-all", isPunctuation ? "text-orange-500" : "text-slate-400")}>@ punctuation</button>
            <button onClick={() => setIsNumbers(!isNumbers)} className={cn("text-[10px] font-black uppercase transition-all", isNumbers ? "text-orange-500" : "text-slate-400")}># numbers</button>
            <button onClick={() => setIsCombo(!isCombo)} className={cn("flex items-center gap-1 text-[10px] font-black uppercase transition-all", isCombo ? "text-orange-500" : "text-slate-400")}><ShieldAlert size={12} /> combo</button>
            <button onClick={() => setIsMemory(!isMemory)} className={cn("flex items-center gap-1 text-[10px] font-black uppercase transition-all", isMemory ? "text-orange-500" : "text-slate-400")}><EyeOff size={12} /> memory</button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-8 px-4">
        <div className="flex gap-12">
            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WPM</p><p className="text-5xl font-black text-orange-500 leading-none">{stats.wpm}</p></div>
            <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</p><p className="text-5xl font-black text-slate-900 leading-none">{timeLeft}s</p></div>
        </div>
        <div className="flex items-center gap-4 bg-white shadow-sm border p-2 px-4 rounded-2xl">
            <span className="text-[10px] font-black text-slate-400 uppercase">{switchType}</span>
            <Switch checked={switchType === 'clicky'} onCheckedChange={(v) => setSwitchType(v ? 'clicky' : 'linear')} className="data-[state=checked]:bg-orange-500" />
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }} className="h-8 w-8 p-0">{soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</Button>
        </div>
      </div>

      {!isFinished ? (
        <div className="relative">
          {!isFocused && (
             <div className="absolute inset-0 z-20 bg-slate-50/80 backdrop-blur-[2px] flex items-center justify-center rounded-[2.5rem] cursor-pointer border-2 border-dashed border-slate-200">
                <div className="flex flex-col items-center gap-2 text-slate-600 font-black uppercase text-xs tracking-widest"><MousePointer2 className="animate-bounce" size={24} /> Nhấn để tiếp tục gõ</div>
             </div>
          )}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={cn("relative bg-white p-12 rounded-[2.5rem] shadow-xl shadow-orange-500/5 border border-slate-100 transition-all overflow-hidden h-[240px]", !isFocused && "opacity-40 blur-[1px]")}>
            <input ref={inputRef} type="text" className="absolute inset-0 opacity-0 cursor-default z-0" value={currentInput} onChange={handleInputChange} onKeyDown={e => e.key === 'Tab' && (e.preventDefault(), startGame())} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} autoFocus />
            <div ref={scrollRef} className={cn("text-3xl font-mono leading-[1.8] select-none tracking-tight text-left transition-all duration-300 ease-in-out", !showText && !isActive && "blur-md opacity-20")}>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {completedWords.map((item, i) => (<span key={`comp-${i}`} className={cn("rounded-sm px-1", item.isCorrect ? "text-slate-800" : "text-red-500 underline decoration-red-200")}>{item.word}</span>))}
                <span ref={el => { wordRefs.current[currentWordIndex] = el }} className="relative bg-orange-500/10 rounded-md px-1 min-w-[20px]">
                    {words[currentWordIndex]?.split('').map((char, i) => {
                        let color = "text-slate-300"
                        if (i < currentInput.length) color = currentInput[i] === char ? "text-slate-800" : "text-red-500"
                        return (<span key={i} className={cn("transition-colors relative", color)}>{i === currentInput.length && isFocused && (<motion.span layoutId="caret" className="absolute w-0.5 h-8 bg-orange-500 -left-[1px] top-1" animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />)}{char}</span>)
                    })}
                    {currentInput.length >= (words[currentWordIndex]?.length || 0) && isFocused && (<motion.span layoutId="caret" className="absolute w-0.5 h-8 bg-orange-500 top-1" style={{ left: `${(words[currentWordIndex]?.length || 0) * 1.15}rem` }} animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />)}
                </span>
                {showText && words.slice(currentWordIndex + 1).map((word, i) => (<span key={`future-${i}`} ref={el => { wordRefs.current[currentWordIndex + 1 + i] = el }} className="text-slate-200 px-1">{word}</span>))}
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-orange-500/5 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10"><Trophy size={100} className="text-orange-500" /></div>
              <p className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Kết quả cuối cùng</p>
              <h2 className="text-8xl font-black text-slate-900 mb-2">{stats.wpm}</h2>
              <p className="text-xl font-bold text-slate-500 mb-8">Từ mỗi phút</p>
              <div className="inline-flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100"><Award className="text-orange-500" size={24} /><span className="text-lg font-black text-slate-700">{stats.rank}</span></div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between px-10">
               <div className="text-center border-r pr-10 flex-1"><p className="text-[10px] font-black text-slate-400 uppercase">Chính xác</p><p className="text-2xl font-black text-slate-900">{stats.accuracy}%</p></div>
               <div className="text-center flex-1"><p className="text-[10px] font-black text-slate-400 uppercase">Từ đúng</p><p className="text-2xl font-black text-slate-900">{completedWords.filter(w => w.isCorrect).length}</p></div>
            </div>
            <div className="flex gap-4"><Button onClick={startGame} size="lg" className="flex-1 h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg gap-2 shadow-lg shadow-orange-500/20"><RefreshCw size={20} /> CHƠI LẠI</Button><Button variant="outline" size="lg" className="h-16 w-16 rounded-2xl border-slate-200" disabled={isSaving}><Share2 size={20} /></Button></div>
          </div>
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8"><h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Zap size={16} className="text-orange-500" /> Tốc độ theo thời gian</h3></div>
            <div className="flex-1 min-h-[300px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={wpmData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="sec" hide /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} /><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '16px' }} /><Line type="monotone" dataKey="wpm" stroke="#f97316" strokeWidth={5} dot={false} animationDuration={2000} /></LineChart></ResponsiveContainer></div>
          </div>
        </motion.div>
      )}
      <div className="mt-8 flex justify-center gap-8 text-slate-400"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><kbd className="px-2 py-1 bg-slate-100 rounded border border-slate-200">Tab</kbd> - reset nhanh</div></div>
    </div>
  )
}
