'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  width?: number
  height?: number
  showText?: boolean
  textSize?: string
}

export function Logo({ 
  className, 
  width = 40, 
  height = 40,
  showText = true,
  textSize = "text-xl"
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 group cursor-pointer", className)}>
      <div className="relative transform transition-all duration-500 group-hover:scale-110">
        {/* Glow effect behind the logo */}
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-all" />
        
        <div className="relative bg-background rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <Image 
            src="/logo.png" 
            alt="PhoGear Logo" 
            width={width} 
            height={height} 
            className="object-contain"
          />
        </div>
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
