import { useState } from 'react'

interface AssistantOrbProps {
  isOpen: boolean
  isThinking: boolean
  recruiterMode: boolean
  prefersReducedMotion: boolean
  compact?: boolean
}

export function AssistantOrb({
  isOpen,
  isThinking,
  recruiterMode,
  prefersReducedMotion,
  compact = false,
}: AssistantOrbProps) {
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const isStatic = recruiterMode || prefersReducedMotion
  const state = isThinking ? 'thinking' : isOpen ? 'open' : hovered ? 'hover' : 'idle'

  return (
    <span
      className={`assistant-orb${compact ? ' assistant-orb--compact' : ''}${isStatic ? ' assistant-orb--static' : ''}`}
      data-state={state}
      aria-hidden={compact ? true : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true)
      }}
      onPointerLeave={() => {
        setHovered(false)
        setTilt({ x: 0, y: 0 })
      }}
      onPointerMove={(event) => {
        if (isStatic || compact || event.pointerType !== 'mouse') return
        const bounds = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width * 2 - 1
        const y = (event.clientY - bounds.top) / bounds.height * 2 - 1
        setTilt({ x: -y * 12, y: x * 12 })
      }}
    >
      <span
        className="assistant-orb__tilt"
        style={{ transform: isStatic ? undefined : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <span className="assistant-orb__aura" />
        <svg className="assistant-orb__ring assistant-orb__ring--one" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="27" />
          <circle className="assistant-orb__ticks" cx="32" cy="32" r="29" />
        </svg>
        <svg className="assistant-orb__ring assistant-orb__ring--two" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="23" />
          <circle className="assistant-orb__ticks" cx="32" cy="32" r="25" />
        </svg>
        <svg className="assistant-orb__ring assistant-orb__ring--three" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="19" />
          <circle className="assistant-orb__ticks" cx="32" cy="32" r="21" />
        </svg>
        <span className="assistant-orb__core">
          <span className="assistant-orb__highlight" />
        </span>
      </span>
      {isThinking && !isStatic && <span className="assistant-orb__pulse" aria-hidden="true" />}
    </span>
  )
}
