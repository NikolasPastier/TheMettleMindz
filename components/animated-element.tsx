"use client"

import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import type { ReactNode } from "react"

interface AnimatedElementProps {
  children: ReactNode
  className?: string
  animationClass: string
  threshold?: number
  rootMargin?: string
}

export function AnimatedElement({
  children,
  className = "",
  animationClass,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
}: AnimatedElementProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  return (
    <div ref={ref} className={`${animationClass} ${isVisible ? "animate" : ""} ${className}`}>
      {children}
    </div>
  )
}
