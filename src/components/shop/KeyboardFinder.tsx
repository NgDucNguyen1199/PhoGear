'use client'

import { useState, useEffect } from 'react'
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
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Product } from '@/types'
import { getFilteredProducts } from '@/actions/products'
import { ProductCard } from './ProductCard'
import { cn } from '@/lib/utils'

type FinderStep = 'intro' | 'layout' | 'connectivity' | 'price' | 'results'

type FinderData = {
  layout: string | null
  connectivity: string | null
  priceRange: string | null // 'budget', 'mid', 'high', 'all'
}

export function KeyboardFinder({ categories }: { categories: any[] }) {
  const [step, setStep] = useState<FinderStep>('intro')
  const [data, setData] = useState<FinderData>({
    layout: null,
    connectivity: null,
    priceRange: null,
  })
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (step === 'intro') setStep('layout')
    else if (step === 'layout') setStep('connectivity')
    else if (step === 'connectivity') setStep('price')
    else if (step === 'price') fetchResults()
  }

  const handleBack = () => {
    if (step === 'layout') setStep('intro')
    else if (step === 'connectivity') setStep('layout')
    else if (step === 'price') setStep('connectivity')
    else if (step === 'results') setStep('price')
  }

  const reset = () => {
    setStep('intro')
    setData({
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
          <div className="flex justify-between mb-4">
            {steps.filter(s => s.id !== 'intro' && s.id !== 'results').map((s, i) => {
              const stepIdx = steps.findIndex(st => st.id === s.id)
              const isActive = stepIdx <= currentStepIndex
              return (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500",
                    isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                  )}>
                    {stepIdx < currentStepIndex ? <CheckCircle2 size={20} /> : i + 1}
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>{s.title}</span>
                </div>
              )
            })}
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8 py-12"
          >
            <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4">
              <Keyboard size={48} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              TÌM KIẾM <span className="text-primary">BÀN PHÍM</span><br />HOÀN HẢO CỦA BẠN
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trả lời một vài câu hỏi đơn giản để chúng tôi giúp bạn chọn ra chiếc bàn phím phù hợp nhất với nhu cầu và phong cách của bạn.
            </p>
            <div className="pt-8">
              <Button 
                onClick={handleNext} 
                className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-base shadow-xl shadow-primary/20 hover:scale-105 transition-all gap-3"
              >
                Bắt đầu ngay <ArrowRight size={20} />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'layout' && (
          <motion.div
            key="layout"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Kích thước bàn phím</h2>
              <p className="text-muted-foreground font-medium">Bạn cần một bàn phím đầy đủ hay nhỏ gọn?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'Fullsize', label: 'Fullsize (100%)', desc: 'Đầy đủ phím, có dãy phím số riêng biệt.', icon: <Layout className="h-8 w-8" /> },
                { id: 'TKL', label: 'TKL (80%)', desc: 'Loại bỏ dãy phím số, tiết kiệm diện tích.', icon: <Keyboard className="h-8 w-8" /> },
                { id: 'Compact', label: 'Compact (60-75%)', desc: 'Siêu nhỏ gọn, tối ưu không gian làm việc.', icon: <Zap className="h-8 w-8" /> },
                { id: 'all', label: 'Tất cả', desc: 'Tôi chưa chắc chắn về kích thước.', icon: <RotateCcw className="h-8 w-8" /> },
              ].map((opt) => (
                <Card 
                  key={opt.id}
                  onClick={() => {
                    setData({ ...data, layout: opt.id })
                    handleNext()
                  }}
                  className={cn(
                    "cursor-pointer rounded-3xl border-2 transition-all duration-300 hover:border-primary/50 group",
                    data.layout === opt.id ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "bg-background border-muted"
                  )}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className={cn(
                      "p-4 rounded-2xl transition-colors duration-300",
                      data.layout === opt.id ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {opt.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{opt.label}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center pt-8">
              <Button variant="ghost" onClick={handleBack} className="font-bold uppercase tracking-widest text-xs gap-2 opacity-50 hover:opacity-100">
                <ChevronLeft size={16} /> Quay lại
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'connectivity' && (
          <motion.div
            key="connectivity"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Phương thức kết nối</h2>
              <p className="text-muted-foreground font-medium">Bạn thích sự tự do của không dây hay độ trễ thấp của có dây?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'Wireless', label: 'Không dây', desc: 'Kết nối qua Bluetooth hoặc 2.4Ghz.', icon: <Wifi className="h-8 w-8" /> },
                { id: 'Wired', label: 'Có dây', desc: 'Kết nối trực tiếp qua cáp USB-C.', icon: <Usb className="h-8 w-8" /> },
                { id: 'all', label: 'Cả hai', desc: 'Hỗ trợ đồng thời cả hai phương thức.', icon: <Zap className="h-8 w-8" /> },
              ].map((opt) => (
                <Card 
                  key={opt.id}
                  onClick={() => {
                    setData({ ...data, connectivity: opt.id })
                    handleNext()
                  }}
                  className={cn(
                    "cursor-pointer rounded-3xl border-2 transition-all duration-300 hover:border-primary/50 group",
                    data.connectivity === opt.id ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "bg-background border-muted"
                  )}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className={cn(
                      "p-4 rounded-2xl transition-colors duration-300",
                      data.connectivity === opt.id ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {opt.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{opt.label}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Button variant="ghost" onClick={handleBack} className="font-bold uppercase tracking-widest text-xs gap-2 opacity-50 hover:opacity-100">
                <ChevronLeft size={16} /> Quay lại
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'price' && (
          <motion.div
            key="price"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight">Ngân sách dự kiến</h2>
              <p className="text-muted-foreground font-medium">Khoảng giá mà bạn sẵn sàng chi trả.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: 'budget', label: 'Phổ thông', desc: 'Dưới 1.000.000đ', icon: <DollarSign className="h-8 w-8" /> },
                { id: 'mid', label: 'Tầm trung', desc: '1.000.000đ - 3.000.000đ', icon: <Zap className="h-8 w-8" /> },
                { id: 'high', label: 'Cao cấp', desc: 'Trên 3.000.000đ', icon: <Layout className="h-8 w-8" /> },
                { id: 'all', label: 'Bất kỳ', desc: 'Hiển thị tất cả tầm giá.', icon: <Search className="h-8 w-8" /> },
              ].map((opt) => (
                <Card 
                  key={opt.id}
                  onClick={() => {
                    setData({ ...data, priceRange: opt.id })
                    fetchResults()
                  }}
                  className={cn(
                    "cursor-pointer rounded-3xl border-2 transition-all duration-300 hover:border-primary/50 group",
                    data.priceRange === opt.id ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "bg-background border-muted"
                  )}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className={cn(
                      "p-4 rounded-2xl transition-colors duration-300",
                      data.priceRange === opt.id ? "bg-primary text-white" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {opt.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{opt.label}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{opt.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Button variant="ghost" onClick={handleBack} className="font-bold uppercase tracking-widest text-xs gap-2 opacity-50 hover:opacity-100">
                <ChevronLeft size={16} /> Quay lại
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-8">
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-4xl font-black uppercase tracking-tight">Kết quả tìm kiếm</h2>
                <p className="text-muted-foreground font-medium">Chúng tôi tìm thấy {results.length} lựa chọn phù hợp nhất với bạn.</p>
              </div>
              <Button onClick={reset} variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-xs gap-2 h-12">
                <RotateCcw size={16} /> Bắt đầu lại
              </Button>
            </div>

            {isLoading ? (
              <div className="py-32 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="font-black uppercase tracking-widest text-muted-foreground text-sm">Đang tổng hợp kết quả...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border-2 border-dashed rounded-[3rem] bg-muted/10 space-y-6">
                <div className="mx-auto h-20 w-20 bg-muted rounded-full flex items-center justify-center">
                  <Keyboard size={40} className="text-muted-foreground opacity-30" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Rất tiếc!</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Chúng tôi không tìm thấy bàn phím nào thỏa mãn tất cả các tiêu chí bạn đã chọn. 
                  </p>
                </div>
                <Button onClick={reset} className="rounded-xl font-bold uppercase tracking-widest text-xs h-12 px-8">
                  Thay đổi tiêu chí
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
