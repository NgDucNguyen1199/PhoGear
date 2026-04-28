'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ 
  className, 
  width = 60, 
  height = 60,
}: LogoProps) {
  return (
    <div className={cn("relative group cursor-pointer inline-block", className)}>
      {/* Dynamic glow effect that pulses on hover */}
      <div className="absolute inset-0 bg-primary/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150" />
      
      <div className="relative transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
        <Image 
          src="/logo.png" 
          alt="PhoGear Logo" 
          width={width} 
          height={height} 
          className="object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          priority
        />
      </div>
    </div>
  )
}
