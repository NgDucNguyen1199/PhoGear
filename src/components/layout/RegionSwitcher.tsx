'use client'

import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Region = {
  id: string
  name: string
  flag: string
  language: string
  currency: string
}

const regions: Region[] = [
  {
    id: 'vn',
    name: 'Việt Nam',
    flag: '🇻🇳',
    language: 'Tiếng Việt',
    currency: 'VND',
  },
  {
    id: 'us',
    name: 'USA',
    flag: '🇺🇸',
    language: 'English',
    currency: 'USD',
  },
]

export function RegionSwitcher() {
  const [currentRegion, setCurrentRegion] = useState<Region>(regions[0])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedRegion = localStorage.getItem('pho_gear_region')
    if (savedRegion) {
      const found = regions.find((r) => r.id === savedRegion)
      if (found) setCurrentRegion(found)
    }
  }, [])

  const handleRegionChange = (region: Region) => {
    setCurrentRegion(region)
    localStorage.setItem('pho_gear_region', region.id)
    // In a real app, this would trigger a language/currency change globally
    // For now, we just update the local state to show it works
    window.location.reload() // Reload to simulate changes taking effect
  }

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "h-9 gap-2 px-2 hover:bg-muted rounded-xl transition-all border border-transparent hover:border-border flex items-center justify-center outline-none select-none",
        "text-sm font-medium whitespace-nowrap"
      )}>
        <span className="text-lg">{currentRegion.flag}</span>
        <span className="hidden lg:inline text-xs font-bold uppercase tracking-widest">{currentRegion.id}</span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl bg-background/95 backdrop-blur-xl border-primary/10 shadow-2xl">
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-2 py-2">
          Khu vực & Ngôn ngữ
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/5" />
        {regions.map((region) => (
          <DropdownMenuItem
            key={region.id}
            onClick={() => handleRegionChange(region)}
            className={cn(
              "flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all duration-200",
              currentRegion.id === region.id ? "bg-primary/5 text-primary" : "hover:bg-muted"
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{region.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">{region.name}</span>
                <span className="text-[10px] text-muted-foreground leading-tight uppercase font-medium tracking-wider">
                  {region.language} • {region.currency}
                </span>
              </div>
            </div>
            {currentRegion.id === region.id && (
              <Check className="h-4 w-4 text-primary animate-in zoom-in-50 duration-300" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
