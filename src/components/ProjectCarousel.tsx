import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LayoutDashboard } from 'lucide-react'

const AUTO_ADVANCE_MS = 4500

type ProjectCarouselProps = {
  images: string[]
  title: string
  projectUrl: string
}

export function ProjectCarousel({ images, title, projectUrl }: ProjectCarouselProps) {
  const [index, setIndex] = useState(0)
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set())

  const validImages = images.filter((src) => !failedUrls.has(src))

  useEffect(() => {
    setIndex((i) => (validImages.length ? Math.min(i, validImages.length - 1) : 0))
  }, [validImages.length])

  useEffect(() => {
    if (validImages.length <= 1) return
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % validImages.length)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(t)
  }, [validImages.length])

  const go = (delta: number) => {
    setIndex((i) => (i + delta + validImages.length) % validImages.length)
  }

  const showPlaceholder = validImages.length === 0

  if (showPlaceholder) {
    return (
      <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex aspect-video w-full items-center justify-center bg-slate-800 text-slate-500" aria-hidden>
          <LayoutDashboard className="h-12 w-12" />
        </div>
      </a>
    )
  }

  return (
    <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        {validImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${title} dashboard ${i + 1}`}
            className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300"
            style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}
            loading="lazy"
            onError={() => setFailedUrls((f) => new Set(f).add(src))}
          />
        ))}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                go(-1)
              }}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-900/80 p-1.5 text-white opacity-0 transition-opacity hover:bg-slate-800 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                go(1)
              }}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-900/80 p-1.5 text-white opacity-0 transition-opacity hover:bg-slate-800 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {validImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setIndex(i)
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-4 bg-emerald-500' : 'w-1.5 bg-slate-500 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </a>
  )
}
