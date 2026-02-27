"use client"

import { cn } from "@/lib/utils"

interface IslamicPatternProps {
  className?: string
  opacity?: number
  variant?: "geometric" | "arabesque" | "stars"
}

export function IslamicPattern({
  className,
  opacity = 0.05,
  variant = "geometric",
}: IslamicPatternProps) {
  const patterns = {
    geometric: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="islamic-geometric"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            {/* Eight-pointed star pattern */}
            <path
              d="M30 0L35 15L50 10L40 20L50 30L35 25L30 40L25 25L10 30L20 20L10 10L25 15Z"
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
            />
            {/* Connecting lines */}
            <path
              d="M30 0V40M10 10L50 30M50 10L10 30M0 20H60"
              stroke="#10b981"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#islamic-geometric)`} />
      </svg>
    ),
    arabesque: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="islamic-arabesque"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            {/* Curved arabesque pattern */}
            <path
              d="M0 40Q20 20 40 40Q60 60 80 40"
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
            />
            <path
              d="M0 60Q20 40 40 60Q60 80 80 60"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.5"
              opacity="0.5"
            />
            <path
              d="M40 0Q20 20 40 40Q60 60 40 80"
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
            />
            <circle cx="40" cy="40" r="5" fill="none" stroke="#10b981" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#islamic-arabesque)`} />
      </svg>
    ),
    stars: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="islamic-stars"
            x="0"
            y="0"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            {/* Six-pointed star pattern */}
            <polygon
              points="24,0 28,14 42,14 30,22 34,36 24,28 14,36 18,22 6,14 20,14"
              fill="none"
              stroke="#10b981"
              strokeWidth="0.8"
            />
            {/* Inner detail */}
            <circle cx="24" cy="20" r="3" fill="none" stroke="#10b981" strokeWidth="0.5" />
            {/* Cross pattern */}
            <path d="M24 0V40M4 20H44" stroke="#10b981" strokeWidth="0.3" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#islamic-stars)`} />
      </svg>
    ),
  }

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      {patterns[variant]}
    </div>
  )
}
