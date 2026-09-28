import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

interface Project {
  title: string
  stack: string
  description: string
  url: string
  badge?: string
}

interface FeaturedProjectsCarouselProps {
  projects: Project[]
  recruiterMode: boolean
}

const AUTO_ADVANCE_MS = 6000

export function FeaturedProjectsCarousel({ projects, recruiterMode }: FeaturedProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-advance effect
  useEffect(() => {
    if (recruiterMode || prefersReducedMotion) return

    const interval = setInterval(() => {
      if (!isPaused) {
        handleNext()
      }
    }, AUTO_ADVANCE_MS)

    return () => clearInterval(interval)
  }, [isPaused, recruiterMode, prefersReducedMotion])

  // Touch/drag handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentX = e.touches[0].clientX
    const diff = currentX - startX
    setTranslateX(diff)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50
    if (translateX > threshold) {
      handlePrevious()
    } else if (translateX < -threshold) {
      handleNext()
    }

    setTranslateX(0)
  }

  if (projects.length === 0) return null

  const transitionClass = prefersReducedMotion ? 'transition-opacity duration-300' : 'transition-transform duration-500 ease-out'

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="gradient-text">Featured Projects</span>
      </h3>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex ${transitionClass}`}
          style={{
            transform: prefersReducedMotion ? 'none' : `translateX(calc(-${currentIndex * 100}% + ${translateX}px))`,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
            touchAction: 'pan-y',
            pointerEvents: isDragging ? 'none' : 'auto',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 p-8 md:p-12"
              style={{ width: '100%' }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-start gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-amber-400">
                    {project.badge && (
                      <>
                        <span className="text-amber-400">★</span> {project.badge}
                      </>
                    )}
                  </span>
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-white mb-3">{project.title}</h4>
                <p className="text-sm text-cyan-400 font-mono mb-4">{project.stack}</p>
                <p className="text-slate-300 leading-relaxed mb-6 text-lg">{project.description}</p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-cyan-500 text-slate-950 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  View Project <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {!recruiterMode && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-slate-900/80 p-3 text-white border border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50 transition-all shadow-lg"
              aria-label="Previous project"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-slate-900/80 p-3 text-white border border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50 transition-all shadow-lg"
              aria-label="Next project"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-cyan-500'
                  : 'w-2 bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
