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
  Type, Quote, EyeOff, ShieldAlert, Palette
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
import {
  DropdownMenu,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// --- THEME DEFINITIONS ---
const THEMES = {
  olive: { bg: "#e9e5db", main: "#91b859", text: "#1d2021", sub: "#b7b19b", caret: "#91b859" },
  olivia: { bg: "#1c1c1c", main: "#deaf9d", text: "#f2f2f2", sub: "#4e4e4e", caret: "#deaf9d" },
  onedark: { bg: "#282c34", main: "#61afef", text: "#abb2bf", sub: "#5c6370", caret: "#61afef" },
  our_theme: { bg: "#111111", main: "#f97316", text: "#eeeeee", sub: "#444444", caret: "#f97316" },
  pale_nimbus: { bg: "#e1e1e1", main: "#7a8a99", text: "#1a1b1c", sub: "#9aa5b1", caret: "#7a8a99" },
  paper: { bg: "#eeeeee", main: "#444444", text: "#000000", sub: "#b2b2b2", caret: "#444444" },
  passion_fruit: { bg: "#70204d", main: "#ff8e72", text: "#f1edcf", sub: "#a24b6e", caret: "#ff8e72" },
  pastel: { bg: "#e0d2e3", main: "#6d5c6f", text: "#1b1b1b", sub: "#a492a8", caret: "#6d5c6f" },
  peach_blossom: { bg: "#e8d0d2", main: "#ce5d97", text: "#3c1430", sub: "#bc9da1", caret: "#ce5d97" },
  peaches: { bg: "#e0d0b0", main: "#dd7a5f", text: "#54392d", sub: "#b7a980", caret: "#dd7a5f" },
  phantom: { bg: "#211a1e", main: "#eed484", text: "#ced461", sub: "#53454e", caret: "#eed484" },
  pink_lemonade: { bg: "#f6d054", main: "#ff6077", text: "#333333", sub: "#caad42", caret: "#ff6077" },
  pulse: { bg: "#181818", main: "#17e5e1", text: "#e5e5e5", sub: "#535353", caret: "#17e5e1" },
  purpleish: { bg: "#282132", main: "#b179d6", text: "#eeeeee", sub: "#6f5f84", caret: "#b179d6" },
  red_dragon: { bg: "#1a0b0c", main: "#ff3a32", text: "#ffffff", sub: "#4a2b2c", caret: "#ff3a32" },
  red_samurai: { bg: "#84142d", main: "#e2b714", text: "#ffffff", sub: "#540d1d", caret: "#e2b714" },
  repose_dark: { bg: "#2f333e", main: "#d4d4d4", text: "#d4d4d4", sub: "#8f9297", caret: "#d4d4d4" },
  repose_light: { bg: "#efefef", main: "#333333", text: "#333333", sub: "#8f9297", caret: "#333333" },
  retro: { bg: "#dad3b1", main: "#c1946a", text: "#1b1b1b", sub: "#918b7d", caret: "#c1946a" },
  retrocast: { bg: "#07737a", main: "#f3e03b", text: "#ffffff", sub: "#264c4f", caret: "#f3e03b" },
  rgb: { bg: "#111111", main: "#ff0000", text: "#eeeeee", sub: "#444444", caret: "#00ff00" },
  rose_pine: { bg: "#191724", main: "#ebbcba", text: "#e0def4", sub: "#6e6a86", caret: "#ebbcba" },
  rose_pine_dawn: { bg: "#faf4ed", main: "#d7827e", text: "#575279", sub: "#9893a5", caret: "#d7827e" },
  rose_pine_moon: { bg: "#232136", main: "#ea9a97", text: "#e0def4", sub: "#6e6a86", caret: "#ea9a97" },
  rudy: { bg: "#101524", main: "#afbcaf", text: "#ffffff", sub: "#213045", caret: "#afbcaf" },
  botanical: { bg: "#7b9c98", main: "#eaf1f3", text: "#1b3936", sub: "#495755", caret: "#eaf1f3" },
  mizu: { bg: "#afcbff", main: "#ffffff", text: "#1a2633", sub: "#5e7da5", caret: "#ffffff" },
  laser: { bg: "#221435", main: "#d0197e", text: "#d1d0ee", sub: "#533483", caret: "#00ecff" },
  bento: { bg: "#2d394d", main: "#ff7a90", text: "#fff1f3", sub: "#4a768d", caret: "#ff7a90" },
  striker: { bg: "#124883", main: "#11a87f", text: "#ffffff", sub: "#1f5e99", caret: "#11a87f" },
  nautilus: { bg: "#132237", main: "#ebb723", text: "#1da1f2", sub: "#0b4c6c", caret: "#ebb723" },
  vaporwave: { bg: "#a435c3", main: "#30d6ea", text: "#ffffff", sub: "#6c25a8", caret: "#30d6ea" },
  8008: { bg: "#333a45", main: "#f44c7f", text: "#939eae", sub: "#4b525f", caret: "#f44c7f" },
  9009: { bg: "#eeebe2", main: "#080909", text: "#080909", sub: "#99947f", caret: "#8b9c73" },
  terra: { bg: "#0c100e", main: "#89c559", text: "#f0edd1", sub: "#435b3d", caret: "#89c559" },
  tiramisu: { bg: "#cfbfa3", main: "#45373c", text: "#45373c", sub: "#7d675c", caret: "#c6735a" },
  rainbow_trail: { bg: "#222222", main: "#ffffff", text: "#eeeeee", sub: "#444444", caret: "#ff0000" },
  nord: { bg: "#2e3440", main: "#88c0d0", text: "#d8dee9", sub: "#4c566a", caret: "#88c0d0" },
  matrix: { bg: "#000000", main: "#15ff00", text: "#003b00", sub: "#003b00", caret: "#15ff00" },
  dracula: { bg: "#282a36", main: "#bd93f9", text: "#f8f8f2", sub: "#6272a4", caret: "#ff79c6" },
  serika: { bg: "#e1e1e1", main: "#e2b714", text: "#323437", sub: "#646669", caret: "#e2b714" },
  carbon: { bg: "#313131", main: "#f66e0d", text: "#eeeeee", sub: "#616161", caret: "#f66e0d" }
}

type ThemeKey = keyof typeof THEMES
type Rank = 'Rùa con' | 'Tay đua' | 'Thần sấm' | 'Pho Master'
type Language = 'vi' | 'en'
type GameTab = 'time' | 'words' | 'quote'

export function TypingGame() {
  // Config
  const [theme, setTheme] = useState<ThemeKey>('olive')
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
  const statsRef = useRef<any>(null)

  const activeColors = THEMES[theme]

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
    statsRef.current = result
    return result
  }, [completedWords, currentInput, words, currentWordIndex, timeLeft, activeConfig, activeTab])

  const finishGame = useCallback(async () => {
    setIsActive(false)
    setIsFinished(true)
    if (timerId.current) clearInterval(timerId.current)
    const finalStats = statsRef.current
    if (finalStats?.wpm >= 100) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [activeColors.main, '#ffffff'] })
    }
    setIsSaving(true)
    await saveTypingScore({
      wpm: finalStats?.wpm || 0,
      accuracy: finalStats?.accuracy || 0,
      mode: `${activeTab}_${language}`,
      rank_name: finalStats?.rank || 'Rùa con'
    })
    setIsSaving(false)
  }, [activeTab, language, activeColors.main])

  const startGame = useCallback(() => {
    if (timerId.current) { clearInterval(timerId.current); timerId.current = null; }
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
    if (isMemory) { const timeout = setTimeout(() => setShowText(false), 3000); return () => clearTimeout(timeout); }
    setTimeout(() => inputRef.current?.focus(), 10)
  }, [language, activeTab, activeConfig, isPunctuation, isNumbers, isMemory])

  useEffect(() => { startGame(); return () => { if (timerId.current) clearInterval(timerId.current) } }, [startGame])

  useEffect(() => {
    if (isActive && !isFinished) {
      timerId.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timerId.current!); timerId.current = null; return 0; }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (timerId.current) clearInterval(timerId.current) }
  }, [isActive, isFinished])

  useEffect(() => {
    if (timeLeft === 0 && isActive && !isFinished) finishGame()
  }, [timeLeft, isActive, isFinished, finishGame])

  useEffect(() => {
    if (isActive && timeLeft < (activeTab === 'time' ? activeConfig : 60) && timeLeft > 0) {
        setWpmData(prev => [...prev, { sec: (activeTab === 'time' ? activeConfig : 60) - timeLeft, wpm: stats.wpm }])
    }
  }, [timeLeft, isActive, stats.wpm, activeTab, activeConfig])

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
    if (!isActive && val.length > 0) { setIsActive(true); if (isMemory) setShowText(false); }
    if (isCombo && val.length > currentInput.length) {
        if (val[val.length-1] !== words[currentWordIndex][val.length-1] && val[val.length-1] !== ' ') { toast.error("COMBO BROKEN!"); startGame(); return; }
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
    <div 
      className="w-full min-h-screen transition-colors duration-500 py-12 px-4" 
      style={{ backgroundColor: activeColors.bg, color: activeColors.text }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="max-w-5xl mx-auto">
        {/* Config Bar */}
        <div 
          className="flex flex-wrap items-center justify-center gap-4 mb-12 p-3 rounded-2xl border shadow-sm transition-all"
          style={{ backgroundColor: `${activeColors.text}08`, borderColor: `${activeColors.text}10` }}
        >
          {/* Theme Selector */}
          <div className="flex items-center gap-2 pr-4 border-r" style={{ borderColor: `${activeColors.text}20` }}>
            <Palette size={14} style={{ color: activeColors.sub }} />
            <Select value={theme} onValueChange={(v) => setTheme(v as ThemeKey)}>
                <SelectTrigger className="w-[180px] h-7 bg-transparent border-none text-[10px] font-black uppercase focus:ring-0">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: activeColors.bg, borderColor: activeColors.sub }}>
                    {Object.entries(THEMES).map(([key, colors]) => (
                        <SelectItem key={key} value={key} className="text-[10px] font-black uppercase hover:bg-white/10" style={{ color: activeColors.text }}>
                           <div className="flex items-center justify-between w-full min-w-[140px] gap-4">
                              <span>{key.replace('_', ' ')}</span>
                              <div className="flex gap-1">
                                 <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: colors.bg }} />
                                 <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: colors.main }} />
                                 <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: colors.text }} />
                              </div>
                           </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 pr-4 border-r" style={{ borderColor: `${activeColors.text}20` }}>
            <Globe2 size={14} style={{ color: activeColors.sub }} />
            <div className="flex rounded-lg p-0.5" style={{ backgroundColor: `${activeColors.text}10` }}>
                {['vi', 'en'].map(l => (
                    <button key={l} onClick={() => setLanguage(l as Language)} className={cn("px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all", language === l ? "bg-white shadow-sm" : "")} style={{ color: language === l ? activeColors.main : activeColors.sub }}>{l}</button>
                ))}
            </div>
          </div>

          <div className="flex items-center gap-4 pr-4 border-r" style={{ borderColor: `${activeColors.text}20` }}>
              <button onClick={() => { setActiveTab('time'); setActiveConfig(30); }} className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase transition-all")} style={{ color: activeTab === 'time' ? activeColors.main : activeColors.sub }}><Timer size={14} /> time</button>
              <button onClick={() => { setActiveTab('words'); setActiveConfig(25); }} className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase transition-all")} style={{ color: activeTab === 'words' ? activeColors.main : activeColors.sub }}><Type size={14} /> words</button>
              <button onClick={() => { setActiveTab('quote'); }} className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase transition-all")} style={{ color: activeTab === 'quote' ? activeColors.main : activeColors.sub }}><Quote size={14} /> quote</button>
          </div>

          {activeTab !== 'quote' && (
              <div className="flex items-center gap-3 pr-4 border-r" style={{ borderColor: `${activeColors.text}20` }}>
                  {(activeTab === 'time' ? [15, 30, 60, 120] : [10, 25, 50, 100]).map(v => (
                      <button key={v} onClick={() => setActiveConfig(v)} className={cn("text-[10px] font-black transition-all", activeConfig === v ? "scale-110" : "")} style={{ color: activeConfig === v ? activeColors.main : activeColors.sub }}>{v}</button>
                  ))}
              </div>
          )}

          <div className="flex items-center gap-4">
              <button onClick={() => setIsPunctuation(!isPunctuation)} className="text-[10px] font-black uppercase transition-all" style={{ color: isPunctuation ? activeColors.main : activeColors.sub }}>@ punctuation</button>
              <button onClick={() => setIsNumbers(!isNumbers)} className="text-[10px] font-black uppercase transition-all" style={{ color: isNumbers ? activeColors.main : activeColors.sub }}># numbers</button>
              <button onClick={() => setIsCombo(!isCombo)} className="flex items-center gap-1 text-[10px] font-black uppercase transition-all" style={{ color: isCombo ? activeColors.main : activeColors.sub }}><ShieldAlert size={12} /> combo</button>
              <button onClick={() => setIsMemory(!isMemory)} className="flex items-center gap-1 text-[10px] font-black uppercase transition-all" style={{ color: isMemory ? activeColors.main : activeColors.sub }}><EyeOff size={12} /> memory</button>
          </div>
        </div>

        {/* Stats Display */}
        <div className="flex justify-between items-end mb-12 px-4">
          <div className="flex gap-16">
              <div><p className="text-xs font-black uppercase tracking-widest opacity-50">WPM</p><p className="text-7xl font-black leading-none" style={{ color: activeColors.main }}>{stats.wpm}</p></div>
              <div><p className="text-xs font-black uppercase tracking-widest opacity-50">Time</p><p className="text-7xl font-black leading-none">{timeLeft}s</p></div>
          </div>
          
          <div className="flex items-center gap-4 p-2 px-4 rounded-2xl border" style={{ backgroundColor: `${activeColors.text}05`, borderColor: `${activeColors.text}10` }}>
              <span className="text-[10px] font-black uppercase opacity-50">{switchType}</span>
              <Switch checked={switchType === 'clicky'} onCheckedChange={(v) => setSwitchType(v ? 'clicky' : 'linear')} className={cn("data-[state=checked]:bg-main")} style={{"--main": activeColors.main} as any} />
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }} className="h-8 w-8 p-0">{soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</Button>
          </div>
        </div>

        {!isFinished ? (
          <div className="relative">
            {!isFocused && (
               <div className="absolute inset-0 z-20 backdrop-blur-[2px] flex items-center justify-center rounded-[2.5rem] cursor-pointer border-2 border-dashed transition-all" style={{ backgroundColor: `${activeColors.bg}cc`, borderColor: `${activeColors.text}20` }}>
                  <div className="flex flex-col items-center gap-2 font-black uppercase text-xs tracking-widest" style={{ color: activeColors.text }}><MousePointer2 className="animate-bounce" size={24} /> Nhấn để tiếp tục gõ</div>
               </div>
            )}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative p-12 rounded-[2.5rem] transition-all overflow-hidden h-[240px]">
              <input ref={inputRef} type="text" className="absolute inset-0 opacity-0 cursor-default z-0" value={currentInput} onChange={handleInputChange} onKeyDown={e => e.key === 'Tab' && (e.preventDefault(), startGame())} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} autoFocus />
              <div ref={scrollRef} className={cn("text-3xl font-mono leading-[1.8] select-none tracking-tight text-left transition-all duration-300 ease-in-out", !showText && !isActive && "blur-md opacity-20")}>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {completedWords.map((item, i) => (<span key={`comp-${i}`} className="rounded-sm px-1" style={{ color: item.isCorrect ? activeColors.text : "#ef4444", textDecoration: item.isCorrect ? "none" : "underline" }}>{item.word}</span>))}
                  <span ref={el => { wordRefs.current[currentWordIndex] = el }} className="relative rounded-md px-1 min-w-[20px]" style={{ backgroundColor: `${activeColors.main}15` }}>
                      {words[currentWordIndex]?.split('').map((char, i) => {
                          let color = activeColors.sub
                          if (i < currentInput.length) color = currentInput[i] === char ? activeColors.text : "#ef4444"
                          return (<span key={i} className="transition-colors relative" style={{ color }}>{i === currentInput.length && isFocused && (<motion.span layoutId="caret" className="absolute w-0.5 h-8 -left-[1px] top-1" style={{ backgroundColor: activeColors.caret }} animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />)}{char}</span>)
                      })}
                      {currentInput.length >= (words[currentWordIndex]?.length || 0) && isFocused && (<motion.span layoutId="caret" className="absolute w-0.5 h-8 top-1" style={{ left: `${(words[currentWordIndex]?.length || 0) * 1.15}rem`, backgroundColor: activeColors.caret }} animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />)}
                  </span>
                  {showText && words.slice(currentWordIndex + 1).map((word, i) => (<span key={`future-${i}`} ref={el => { wordRefs.current[currentWordIndex + 1 + i] = el }} className="px-1 opacity-30" style={{ color: activeColors.sub }}>{word}</span>))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="p-8 rounded-[2.5rem] border shadow-xl text-center relative overflow-hidden" style={{ backgroundColor: activeColors.bg, borderColor: `${activeColors.text}10` }}>
                <div className="absolute top-0 right-0 p-6 opacity-10"><Trophy size={100} style={{ color: activeColors.main }} /></div>
                <p className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-50">Kết quả</p>
                <h2 className="text-8xl font-black mb-2" style={{ color: activeColors.text }}>{stats.wpm}</h2>
                <p className="text-xl font-bold opacity-50 mb-8">Từ mỗi phút</p>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border" style={{ backgroundColor: `${activeColors.main}10`, borderColor: `${activeColors.main}20` }}><Award style={{ color: activeColors.main }} size={24} /><span className="text-lg font-black" style={{ color: activeColors.text }}>{stats.rank}</span></div>
              </div>
              <div className="p-6 rounded-[2rem] border shadow-sm flex items-center justify-between px-10" style={{ backgroundColor: activeColors.bg, borderColor: `${activeColors.text}10` }}>
                 <div className="text-center border-r flex-1" style={{ borderColor: `${activeColors.text}10` }}><p className="text-[10px] font-black uppercase opacity-50">Chính xác</p><p className="text-2xl font-black">{stats.accuracy}%</p></div>
                 <div className="text-center flex-1"><p className="text-[10px] font-black uppercase opacity-50">Từ đúng</p><p className="text-2xl font-black">{completedWords.filter(w => w.isCorrect).length}</p></div>
              </div>
              <div className="flex gap-4">
                 <Button onClick={startGame} size="lg" className="flex-1 h-16 rounded-2xl font-black text-lg gap-2 shadow-lg transition-all active:scale-95" style={{ backgroundColor: activeColors.main, color: activeColors.bg }}>
                   <RefreshCw size={20} /> CHƠI LẠI
                 </Button>
                 <Button variant="outline" size="lg" className="h-16 w-16 rounded-2xl" style={{ borderColor: `${activeColors.text}20`, color: activeColors.text }}><Share2 size={20} /></Button>
              </div>
            </div>
            <div className="lg:col-span-2 p-8 rounded-[2.5rem] border shadow-sm flex flex-col" style={{ backgroundColor: activeColors.bg, borderColor: `${activeColors.text}10` }}>
              <div className="flex items-center justify-between mb-8"><h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: activeColors.main }}><Zap size={16} /> Tốc độ theo thời gian</h3></div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wpmData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${activeColors.text}10`} />
                    <XAxis dataKey="sec" hide />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: activeColors.sub }} />
                    <Tooltip contentStyle={{ backgroundColor: activeColors.bg, border: `1px solid ${activeColors.sub}`, borderRadius: '16px', color: activeColors.text }} />
                    <Line type="monotone" dataKey="wpm" stroke={activeColors.main} strokeWidth={5} dot={false} animationDuration={2000} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
        <div className="mt-12 flex justify-center gap-8 opacity-30"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><kbd className="px-2 py-1 rounded border" style={{ borderColor: activeColors.sub }}>Tab</kbd> - reset nhanh</div></div>
      </div>
    </div>
  )
}
