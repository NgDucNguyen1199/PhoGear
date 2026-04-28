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
  width = 50, 
  height = 50,
  showText = true,
  textSize = "text-xl"
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 group cursor-pointer", className)}>
      <div className="relative transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        {/* Subtle glow effect behind the logo */}
        <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        <div className="relative flex items-center justify-center">
          <Image 
            src="/logo.png" 
            alt="PhoGear Logo" 
            width={width} 
            height={height} 
            className="object-contain drop-shadow-md"
            priority
          />
        </div>
      </div>

      {showText && (
        <div className={cn("flex flex-col -space-y-1 justify-center", textSize)}>
          <span className="font-black tracking-tighter uppercase text-foreground leading-none">
            PHO
          </span>
          <span className="font-black tracking-tighter uppercase text-primary group-hover:text-orange-400 transition-colors leading-none">
            GEAR
          </span>
        </div>
      )}
    </div>
  )
}
