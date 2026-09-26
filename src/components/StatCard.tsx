import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../hooks/useCountUp'

interface StatCardProps {
  target: number
  suffix: string
  label: string
}

export function StatCard({ target, suffix, label }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const count = useCountUp(target, isVisible)

  return (
    <div ref={ref} className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
      <span className="block text-2xl font-bold text-emerald-400">{count}{suffix}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  )
}