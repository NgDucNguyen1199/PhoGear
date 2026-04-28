'use client'

import { Keyboard } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconSize?: number
  textSize?: string
  showText?: boolean
}

export function Logo({ 
  className, 
  iconSize = 24, 
  textSize = "text-xl", 
  showText = true 
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2 group cursor-pointer", className)}>
      <div className="relative flex items-center justify-center">
        {/* Background gear effect */}
        <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg group-hover:bg-primary/30 transition-all duration-500" />
        
        {/* Logo Container */}
        <div className="relative bg-primary text-primary-foreground p-1.5 rounded-xl shadow-lg shadow-primary/20 transform transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
          <Keyboard size={iconSize} strokeWidth={2.5} />
        </div>
        
        {/* Small "gear" or "dot" accent */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-background animate-pulse" />
      </div>

      {showText && (
        <span className={cn("font-black tracking-tighter uppercase", textSize)}>
          <span className="text-foreground">PHO</span>
          <span className="text-primary group-hover:text-orange-400 transition-colors">GEAR</span>
        </span>
      )}
    </div>
  )
}
