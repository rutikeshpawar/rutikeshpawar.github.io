import { useState, useEffect, useRef } from 'react'

/**
 * Tracks window.scrollY reactively with eased/lerped values for smooth parallax.
 * Returns 0 (and stays 0) if the user prefers reduced motion,
 * so any parallax using this hook automatically becomes inert.
 */
export function useScrollY() {
  const [easedScrollY, setEasedScrollY] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastScrollY = useRef(0)
  const currentEasedScrollY = useRef(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const onScroll = () => {
      lastScrollY.current = window.scrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // Easing loop for smooth parallax
    const easeScroll = () => {
      const target = lastScrollY.current
      const current = currentEasedScrollY.current
      const diff = target - current

      if (Math.abs(diff) > 0.1) {
        const newValue = current + diff * 0.08 // Lerp factor of 0.08 for smooth easing
        currentEasedScrollY.current = newValue
        setEasedScrollY(newValue)
        rafRef.current = requestAnimationFrame(easeScroll)
      } else {
        setEasedScrollY(target)
      }
    }

    rafRef.current = requestAnimationFrame(easeScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return { easedScrollY }
}