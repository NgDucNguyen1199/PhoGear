'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Keyboard, 
  Wifi, 
  Usb, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Layout, 
  Zap, 
  DollarSign,
  CheckCircle2,
  Search,
  ArrowRight,
  Loader2,
  Gamepad2,
  Briefcase,
  Code2,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Product } from '@/types'
import { getFilteredProducts } from '@/actions/products'
import { ProductCard } from './ProductCard'
import { cn } from '@/lib/utils'
import useSound from 'use-sound'

type FinderStep = 'intro' | 'purpose' | 'profile' | 'layout' | 'connectivity' | 'price' | 'results'

type FinderData = {
  purpose: string | null
  profile: string | null // 'Normal', 'Low'
  layout: string | null
  connectivity: string | null
  priceRange: string | null // 'budget', 'mid', 'high', 'all'
}

// SVG Illustrations for Layouts
const LayoutIllustration = ({ type, active }: { type: string, active: boolean }) => {
  const color = active ? "currentColor" : "rgba(156, 163, 175, 0.4)"
  
  if (type === 'Fullsize') {
    return (
      <svg viewBox="0 0 100 40" className="w-full h-auto mb-4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="96" height="30" rx="4" stroke={color} strokeWidth="2" />
        <rect x="8" y="10" width="55" height="20" rx="2" fill={color} fillOpacity="0.1" />
        <rect x="68" y="10" width="10" height="20" rx="2" fill={color} fillOpacity="0.1" />
        <rect x="82" y="10" width="10" height="20" rx="2" fill={color} fillOpacity="0.1" />
      </svg>
    )
  }
  if (type === 'TKL') {
    return (
      <svg viewBox="0 0 100 40" className="w-full h-auto mb-4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="80" height="30" rx="4" stroke={color} strokeWidth="2" />
        <rect x="8" y="10" width="55" height="20" rx="2" fill={color} fillOpacity="0.1" />
        <rect x="68" y="10" width="10" height="20" rx="2" fill={color} fillOpacity="0.1" />
      </svg>
    )
  }
  if (type === 'Compact') {
    return (
      <svg viewBox="0 0 100 40" className="w-full h-auto mb-4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="65" height="30" rx="4" stroke={color} strokeWidth="2" />
        <rect x="8" y="10" width="55" height="20" rx="2" fill={color} fillOpacity="0.1" />
      </svg>
    )
  }
  return <Layout className="h-8 w-8 mb-4" />
}

export function KeyboardFinder({ categories }: { categories: any[] }) {
  const [step, setStep] = useState<FinderStep>('intro')
  const [data, setData] = useState<FinderData>({
    purpose: null,
    profile: null,
    layout: null,
    connectivity: null,
    priceRange: null,
  })
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [playClick] = useSound('/sounds/blue_clicky.mp3', { volume: 0.5 })

  const handleNext = () => {
    playClick()
    if (step === 'intro') setStep('purpose')
    else if (step === 'purpose') setStep('profile')
    else if (step === 'profile') setStep('layout')
    else if (step === 'layout') setStep('connectivity')
    else if (step === 'connectivity') setStep('price')
    else if (step === 'price') fetchResults()
  }

  const handleBack = () => {
    playClick()
    if (step === 'purpose') setStep('intro')
    else if (step === 'profile') setStep('purpose')
    else if (step === 'layout') setStep('profile')
    else if (step === 'connectivity') setStep('layout')
    else if (step === 'price') setStep('connectivity')
    else if (step === 'results') setStep('price')
  }

  const reset = () => {
    playClick()
    setStep('intro')
    setData({
      purpose: null,
      profile: null,
      layout: null,
      connectivity: null,
      priceRange: null,
    })
    setResults([])
  }

  const fetchResults = async () => {
    setIsLoading(true)
    setStep('results')
    
    let minPrice: number | undefined = undefined
    let maxPrice: number | undefined = undefined

    if (data.priceRange === 'budget') {
      maxPrice = 1000000
    } else if (data.priceRange === 'mid') {
      minPrice = 1000000
      maxPrice = 3000000
    } else if (data.priceRange === 'high') {
      minPrice = 3000000
    }

    const filters = {
      layout: data.layout === 'all' ? undefined : data.layout || undefined,
      connectivity: data.connectivity === 'all' ? undefined : data.connectivity || undefined,
      minPrice,
      maxPrice,
    }

    const products = await getFilteredProducts(filters)
    setResults(products)
    setIsLoading(false)
  }

  const steps = [
    { id: 'intro', title: 'Bắt đầu' },
    { id: 'purpose', title: 'Mục đích' },
    { id: 'profile', title: 'Độ dày' },
    { id: 'layout', title: 'Kích thước' },
    { id: 'connectivity', title: 'Kết nối' },
    { id: 'price', title: 'Ngân sách' },
    { id: 'results', title: 'Kết quả' },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === step)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      {step !== 'intro' && step !== 'results' && (
        <div className="mb-12">
          <div className="flex justify-between mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {steps.filter(s => s.id !== 'intro' && s.id !== 'results').map((s, i) => {
              const stepIdx = steps.findIndex(st => st.id === s.id)
              const isActive = stepIdx <= currentStepIndex
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500",
                    isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                  )}>
                    {stepIdx < currentStepIndex ? <CheckCircle2 size={20} /> : i + 1}
                  </div>
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-widest text-center",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>{s.title}</span>
                </div>
              )
            })}
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="text-center space-y-8 py-12"
          >
            <div className="relative inline-block">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative inline-flex p-6 rounded-[2rem] bg-background border-2 border-primary/20 text-primary mb-4 shadow-xl">
                    <Keyboard size={64} strokeWidth={1.5} />
                </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight uppercase italic">
              <span className="text-primary">Keyboard</span> Finder
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium leading-relaxed">
              Bạn đang bối rối trước hàng ngàn lựa chọn? <br />
              Hãy để Pho Gear giúp bạn tìm ra "chân ái" chỉ trong 60 giây.
            </p>
            <div className="pt-8">
              <Button 
                onClick={handleNext} 
                className="h-20 px-12 rounded-[2rem] font-black uppercase tracking-[0.2em] text-lg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-4 group"
              >
                Khám phá ngay <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'purpose' && (
          <motion.div
            key="purpose"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tight italic">Bạn sử dụng bàn phím để làm gì?</h2>
              <p className="text-muted-foreground font-medium text-lg">Mỗi nhu cầu sẽ có những tiêu chuẩn riêng về độ trễ và cảm giác gõ.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'gaming', label: 'Chơi Game', desc: 'Yêu cầu tốc độ phản hồi siêu nhanh và LED RGB.', icon: <Gamepad2 className="h-10 w-10" /> },
                { id: 'office', label: 'Văn phòng', desc: 'Ưu tiên sự yên tĩnh, thoải mái và kết nối đa thiết bị.', icon: <Briefcase className="h-10 w-10" /> },
                { id: 'coding', label: 'Lập trình', desc: 'Cần sự bền bỉ, layout tối ưu và khả năng tùy biến cao.', icon: <Code2 className="h-10 w-10" /> },
              ].map((opt) => (
                <Card 
                  key={opt.id}
                  onClick={() => {
                    setData({ ...data, purpose: opt.id })
                    handleNext()
                  }}
                  className={cn(
                    "cursor-pointer rounded-[2.5rem] border-2 transition-all duration-500 hover:border-primary/50 group overflow-hidden relative",
                    data.purpose === opt.id ? "border-primary bg-primary/5 ring-8 ring-primary/5" : "bg-background border-muted"
                  )}
                >
                  <CardContent className="p-10 flex flex-col items-center text-center space-y-6 relative z-10">
                    <div className={cn(
                      "p-5 rounded-2xl transition-all duration-500 group-hover:scale-110",
                      data.purpose === opt.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {opt.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-xl mb-3 uppercase tracking-tight">{opt.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">{opt.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center pt-8">
              <Button variant="ghost" onClick={handleBack} className="font-black uppercase tracking-widest text-xs gap-2 opacity-40 hover:opacity-100 transition-opacity">
                <ChevronLeft size={16} /> Quay lại
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tight italic">Độ dày của bàn phím?</h2>
              <p className="text-muted-foreground font-medium text-lg">Bạn thích cảm giác gõ sâu truyền thống hay mỏng nhẹ hiện đại?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {[
                { id: 'Normal', label: 'Normal Profile', desc: 'Kích thước tiêu chuẩn, cảm giác gõ sâu, dễ thay keycap.', icon: <Maximize2 className="h-10 w-10" /> },
                { id: 'Low', label: 'Low Profile', desc: 'Siêu mỏng, phong cách laptop, giảm mỏi cổ tay.', icon: <Minimize2 className="h-10 w-10" /> },
              ].map((opt) => (
                <Card 
                  key={opt.id}
                  onClick={() => {
                    setData({ ...data, profile: opt.id })
                    handleNext()
                  }}
                  className={cn(
                    "cursor-pointer rounded-[2.5rem] border-2 transition-all duration-500 hover:border-primary/50 group",
                    data.profile === opt.id ? "border-primary bg-primary/5 ring-8 ring-primary/5" : "bg-background border-muted"
                  )}
                >
                  <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                    <div className={cn(
                      "p-5 rounded-2xl transition-all duration-500 group-hover:scale-110",
                      data.profile === opt.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {opt.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-xl mb-3 uppercase tracking-tight">{opt.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">{opt.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Button variant="ghost" onClick={handleBack} className="font-black uppercase tracking-widest text-xs gap-2 opacity-40 hover:opacity-100">
                <ChevronLeft size={16} /> Quay lại
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'layout' && (
          <motion.div
            key="layout"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tight italic">Kích thước (Layout)</h2>
              <p className="text-muted-foreground font-medium text-lg">Sự cân bằng giữa tính năng và diện tích mặt bàn.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'Fullsize', label: 'Fullsize (100%)', desc: 'Đầy đủ 104-108 phím.' },
                { id: 'TKL', label: 'TKL (80%)', desc: 'Gọn hơn, bỏ cụm số.' },
                { id: 'Compact', label: 'Compact (60-75%)', desc: 'Siêu gọn, tối giản.' },
                { id: 'all', label: 'Tất cả', desc: 'Hiển thị mọi kích thước.' },
              ].map((opt) => (
                <Card 
                  key={opt.id}
                  onClick={() => {
                    setData({ ...data, layout: opt.id })
                    handleNext()
                  }}
                  className={cn(
                    "cursor-pointer rounded-[2.5rem] border-2 transition-all duration-500 hover:border-primary/50 group",
                    data.layout === opt.id ? "border-primary bg-primary/5 ring-8 ring-primary/5" : "bg-background border-muted"
                  )}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className="w-full text-primary group-hover:scale-110 transition-transform duration-500">
                        <LayoutIllustration type={opt.id} active={data.layout === opt.id} />
                    </div>
                    <div>
                      <h3 className="font-black text-base mb-2 uppercase tracking-tight">{opt.label}</h3>
                      <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{opt.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center pt-8">
              <Button variant="ghost" onClick={handleBack} className="font-black uppercase tracking-widest text-xs gap-2 opacity-40 hover:opacity-100">
                <ChevronLeft size={16} /> Quay lại
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'connectivity' && (
          <motion.div
            key="connectivity"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tight italic">Phương thức kết nối</h2>
              <p className="text-muted-foreground font-medium text-lg">Tự do không dây hay ổn định tuyệt đối từ có dây?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'Wireless', label: 'Không dây', desc: 'Bluetooth 5.0 & 2.4GHz không độ trễ.', icon: <Wifi className="h-10 w-10" /> },
                { id: 'Wired', label: 'Có dây', desc: 'Kết nối USB-C Type-C ổn định.', icon: <Usb className="h-10 w-10" /> },
                { id: 'all', label: 'Cả hai (3-Mode)', desc: 'Chuyển đổi linh hoạt giữa các chế độ.', icon: <Zap className="h-10 w-10" /> },
              ].map((opt) => (
                <Card 
                  key={opt.id}
                  onClick={() => {
                    setData({ ...data, connectivity: opt.id })
                    handleNext()
                  }}
                  className={cn(
                    "cursor-pointer rounded-[2.5rem] border-2 transition-all duration-500 hover:border-primary/50 group",
                    data.connectivity === opt.id ? "border-primary bg-primary/5 ring-8 ring-primary/5" : "bg-background border-muted"
                  )}
                >
                  <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                    <div className={cn(
                      "p-5 rounded-2xl transition-all duration-500 group-hover:scale-110",
                      data.connectivity === opt.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {opt.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-xl mb-3 uppercase tracking-tight">{opt.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">{opt.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Button variant="ghost" onClick={handleBack} className="font-black uppercase tracking-widest text-xs gap-2 opacity-40 hover:opacity-100">
                <ChevronLeft size={16} /> Quay lại
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'price' && (
          <motion.div
            key="price"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tight italic">Ngân sách của bạn</h2>
              <p className="text-muted-foreground font-medium text-lg">Chúng tôi sẽ lọc ra những lựa chọn tối ưu nhất trong tầm giá.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'budget', label: 'Kinh tế', desc: 'Dưới 1.000.000đ', icon: <DollarSign className="h-10 w-10" /> },
                { id: 'mid', label: 'Cân bằng', desc: '1tr - 3.000.000đ', icon: <Sparkles className="h-10 w-10" /> },
                { id: 'high', label: 'Premium', desc: 'Trên 3.000.000đ', icon: <CardContent className="p-0"><Layout className="h-10 w-10" /></CardContent> },
                { id: 'all', label: 'Bất kỳ', desc: 'Hiển thị mọi phân khúc.', icon: <Search className="h-10 w-10" /> },
              ].map((opt) => (
                <Card 
                  key={opt.id}
                  onClick={() => {
                    setData({ ...data, priceRange: opt.id })
                    fetchResults()
                  }}
                  className={cn(
                    "cursor-pointer rounded-[2.5rem] border-2 transition-all duration-500 hover:border-primary/50 group",
                    data.priceRange === opt.id ? "border-primary bg-primary/5 ring-8 ring-primary/5" : "bg-background border-muted"
                  )}
                >
                  <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                    <div className={cn(
                      "p-5 rounded-2xl transition-all duration-500 group-hover:scale-110",
                      data.priceRange === opt.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {opt.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-xl mb-3 uppercase tracking-tight">{opt.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">{opt.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Button variant="ghost" onClick={handleBack} className="font-black uppercase tracking-widest text-xs gap-2 opacity-40 hover:opacity-100">
                <ChevronLeft size={16} /> Quay lại
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-primary/10 pb-12">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-5xl font-black uppercase tracking-tighter italic">Gợi ý dành riêng cho bạn</h2>
                <p className="text-muted-foreground font-medium text-lg italic">Dựa trên sở thích: {data.purpose}, {data.profile}, {data.layout}...</p>
              </div>
              <Button onClick={reset} variant="outline" className="rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] gap-3 h-14 px-8 border-2">
                <RotateCcw size={18} /> Thử lại từ đầu
              </Button>
            </div>

            {isLoading ? (
              <div className="py-40 flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <Loader2 className="h-20 w-20 animate-spin text-primary opacity-20" />
                    <Search className="h-10 w-10 text-primary absolute inset-0 m-auto animate-pulse" />
                </div>
                <p className="font-black uppercase tracking-[0.3em] text-primary text-sm animate-pulse">Đang giải mã sở thích của bạn...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {results.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative"
                  >
                    {idx === 0 && (
                        <div className="absolute -top-4 -left-4 z-20 bg-primary text-primary-foreground px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl rotate-[-5deg] border-2 border-background">
                            Best Match ⭐
                        </div>
                    )}
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border-4 border-dashed rounded-[4rem] bg-muted/5 space-y-8 max-w-2xl mx-auto">
                <div className="mx-auto h-28 w-28 bg-muted rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 animate-ping"></div>
                  <Keyboard size={56} className="text-muted-foreground opacity-30 relative z-10" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black uppercase tracking-tight italic">Ồ, Phím này hơi "hiếm"!</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto font-medium text-lg">
                    Chúng tôi không tìm thấy mẫu nào khớp 100% với các tiêu chí này. Hãy thử thay đổi một vài lựa chọn nhé!
                  </p>
                </div>
                <Button onClick={reset} className="rounded-2xl font-black uppercase tracking-[0.2em] text-xs h-16 px-12 shadow-2xl shadow-primary/20">
                  Điều chỉnh tiêu chí
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
