import { useState, useEffect } from 'react'

/**
 * Tracks window.scrollY reactively.
 * Returns 0 (and stays 0) if the user prefers reduced motion,
 * so any parallax using this hook automatically becomes inert.
 */
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return scrollY
}