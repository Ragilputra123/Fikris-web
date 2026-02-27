"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 48, text: "text-2xl" },
    lg: { icon: 64, text: "text-3xl" },
  }

  const { icon: iconSize, text: textSize } = sizes[size]

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {/* Mosque dome with crescent moon SVG */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        {/* Mosque dome */}
        <path
          d="M32 4C18 4 8 18 8 32V52H56V32C56 18 46 4 32 4Z"
          fill="#10b981"
          stroke="#047857"
          strokeWidth="2"
        />
        
        {/* Dome inner curve */}
        <path
          d="M16 52V32C16 20 22 10 32 10C42 10 48 20 48 32V52"
          fill="#059669"
        />
        
        {/* Dome highlight */}
        <path
          d="M20 52V32C20 22 25 14 32 14"
          stroke="#34d399"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        
        {/* Base/foundation */}
        <rect
          x="4"
          y="52"
          width="56"
          height="8"
          rx="2"
          fill="#047857"
        />
        
        {/* Base highlight */}
        <rect
          x="8"
          y="54"
          width="48"
          height="2"
          rx="1"
          fill="#10b981"
          opacity="0.5"
        />
        
        {/* Crescent moon */}
        <path
          d="M42 8C42 8 38 12 38 18C38 24 42 28 48 28C50 28 52 27 53 26C52 30 48 34 42 34C35 34 30 28 30 21C30 14 35 8 42 8Z"
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="1"
        />
        
        {/* Star accent */}
        <circle cx="50" cy="14" r="1.5" fill="#fbbf24" />
        <circle cx="54" cy="18" r="1" fill="#fbbf24" />
        
        {/* Door/arch */}
        <path
          d="M28 60V48C28 44 30 42 32 42C34 42 36 44 36 48V60"
          fill="#064e3b"
          stroke="#047857"
          strokeWidth="1"
        />
        
        {/* Door inner */}
        <path
          d="M30 60V50C30 47 31 46 32 46C33 46 34 47 34 50V60"
          fill="#022c22"
        />
      </svg>
      
      {/* Text */}
      {showText && (
        <span
          className={cn(
            "font-bold tracking-wide text-emerald-600",
            textSize
          )}
        >
          Fikris
        </span>
      )}
    </div>
  )
}
