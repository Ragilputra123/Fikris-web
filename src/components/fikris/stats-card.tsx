"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "gradient"
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        variant === "gradient" && "bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-emerald-400",
        variant === "default" && "bg-white border-emerald-100 hover:border-emerald-200",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Content */}
          <div className="space-y-2">
            <p
              className={cn(
                "text-sm font-medium",
                variant === "gradient" ? "text-emerald-100" : "text-gray-500"
              )}
            >
              {title}
            </p>
            <p
              className={cn(
                "text-3xl font-bold",
                variant === "gradient" ? "text-white" : "text-gray-900"
              )}
            >
              {value}
            </p>
            {description && (
              <p
                className={cn(
                  "text-xs",
                  variant === "gradient" ? "text-emerald-200" : "text-gray-400"
                )}
              >
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                {trend.isPositive ? (
                  <TrendingUp
                    className={cn(
                      "h-4 w-4",
                      variant === "gradient" ? "text-amber-300" : "text-emerald-500"
                    )}
                  />
                ) : (
                  <TrendingDown
                    className={cn(
                      "h-4 w-4",
                      variant === "gradient" ? "text-red-300" : "text-red-500"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive
                      ? variant === "gradient" ? "text-amber-300" : "text-emerald-600"
                      : variant === "gradient" ? "text-red-300" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                <span
                  className={cn(
                    "text-xs",
                    variant === "gradient" ? "text-emerald-200" : "text-gray-400"
                  )}
                >
                  dari bulan lalu
                </span>
              </div>
            )}
          </div>

          {/* Icon */}
          <div
            className={cn(
              "flex items-center justify-center rounded-xl p-3",
              variant === "gradient"
                ? "bg-white/20 backdrop-blur-sm"
                : "bg-emerald-50"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                variant === "gradient" ? "text-white" : "text-emerald-600"
              )}
            />
          </div>
        </div>

        {/* Decorative element for gradient variant */}
        {variant === "gradient" && (
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        )}
      </CardContent>
    </Card>
  )
}
