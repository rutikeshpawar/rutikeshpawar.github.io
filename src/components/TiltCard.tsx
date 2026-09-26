import { useRef, useState, type ReactNode, type CSSProperties, type MouseEvent } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  disabled?: boolean
}

/**
 * Wraps children in a small mouse-follow tilt effect.
 * Automatically inert on touch/small screens, when the user
 * prefers reduced motion, or when `disabled` is passed (used by Recruiter Mode).
 */
export function TiltCard({ children, className = '', maxTilt = 8, disabled = false }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<CSSProperties>({})

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || window.innerWidth < 768) return

    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(600px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) scale3d(1.02,1.02,1.02)`,
      transition: 'transform 0.1s ease-out',
    })
  }

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(600px) rotateX(0) rotateY(0) scale3d(1,1,1)',
      transition: 'transform 0.4s ease',
    })
  }

  return (
    <div ref={ref} className={className} style={style} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  )
}