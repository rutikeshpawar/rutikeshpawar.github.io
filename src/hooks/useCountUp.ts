import { useState, useEffect, useRef } from 'react'

/**
 * Animates a number counting up from 0 to `target` once `isVisible` becomes true.
 * Runs only once, even if isVisible toggles again later.
 */
export function useCountUp(target: number, isVisible: boolean, duration = 1200) {
  const [value, setValue] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!isVisible || hasRun.current) return
    hasRun.current = true

    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isVisible, target, duration])

  return value
}