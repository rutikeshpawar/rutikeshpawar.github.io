import { useState } from 'react'

/** GitHub profile photo (github.com/rutikeshpawar). Fallback: initials "RP". */
const GITHUB_AVATAR_URL = 'https://avatars.githubusercontent.com/u/77493271?v=4'

export function Avatar() {
  const [useFallback, setUseFallback] = useState(false)

  return (
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-emerald-500/50 bg-slate-800 ring-2 ring-slate-700 md:h-28 md:w-28">
      {!useFallback ? (
        <img
          src={GITHUB_AVATAR_URL}
          alt="Rutikesh Pawar"
          className="h-full w-full object-cover"
          onError={() => setUseFallback(true)}
          loading="lazy"
          decoding="async"
        />
      ) : null}
      {useFallback && (
        <div className="flex h-full w-full items-center justify-center bg-slate-700 text-2xl font-bold text-emerald-400 md:text-3xl">
          RP
        </div>
      )}
    </div>
  )
}
