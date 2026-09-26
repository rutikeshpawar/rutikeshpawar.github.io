/**
 * Professional data-analytics themed illustration for hero section.
 * SVG only — no external images.
 */
export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:max-w-none" aria-hidden>
      <svg
        viewBox="0 0 400 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-emerald-500/20"
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
            <stop stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <rect width="400" height="280" fill="url(#grid)" className="text-slate-800" />
        {/* Chart area frame */}
        <rect x="40" y="30" width="320" height="180" rx="8" className="fill-slate-800/50 stroke-slate-700" strokeWidth="1" />
        {/* Bar chart (simplified) */}
        <rect x="60" y="120" width="36" height="80" rx="4" fill="url(#barGrad)" className="text-emerald-500" />
        <rect x="108" y="80" width="36" height="120" rx="4" fill="url(#barGrad)" className="text-emerald-500" />
        <rect x="156" y="100" width="36" height="100" rx="4" fill="url(#barGrad)" className="text-emerald-500" />
        <rect x="204" y="60" width="36" height="140" rx="4" fill="url(#barGrad)" className="text-emerald-500" />
        <rect x="252" y="90" width="36" height="110" rx="4" fill="url(#barGrad)" className="text-emerald-500" />
        <rect x="300" y="130" width="36" height="70" rx="4" fill="url(#barGrad)" className="text-emerald-500" />
        {/* Line trend */}
        <path
          d="M 60 160 Q 120 100, 180 120 T 300 80"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-cyan-400"
        />
        {/* KPI cards */}
        <rect x="50" y="230" width="90" height="36" rx="6" className="fill-slate-800 stroke-slate-600" strokeWidth="1" />
        <rect x="155" y="230" width="90" height="36" rx="6" className="fill-slate-800 stroke-slate-600" strokeWidth="1" />
        <rect x="260" y="230" width="90" height="36" rx="6" className="fill-slate-800 stroke-slate-600" strokeWidth="1" />
        <circle cx="75" cy="248" r="4" className="fill-emerald-500" />
        <circle cx="200" cy="248" r="4" className="fill-emerald-500" />
        <circle cx="305" cy="248" r="4" className="fill-emerald-500" />
      </svg>
    </div>
  )
}
