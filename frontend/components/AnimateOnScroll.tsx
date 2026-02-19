'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  variant?: 'fade-up' | 'fade-in' | 'scale'
  delay?: number
}

export function AnimateOnScroll({ children, variant = 'fade-up', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setVisible(true), delay)
          return () => clearTimeout(t)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  const base = 'transition-all duration-700 ease-out'
  const variants = {
    'fade-up': visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
    'fade-in': visible ? 'opacity-100' : 'opacity-0',
    'scale': visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
  }

  return (
    <div ref={ref} className={`${base} ${variants[variant]}`}>
      {children}
    </div>
  )
}
