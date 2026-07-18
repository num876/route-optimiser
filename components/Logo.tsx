import type { CSSProperties } from 'react'

interface LogoMarkProps {
  size?: number
  className?: string
  /** Unique suffix so multiple gradients on one page don't collide. */
  idSuffix?: string
  style?: CSSProperties
}

/**
 * Self-contained Route Optimiser logo mark.
 * A route line threads through two stop nodes and arrives at a highlighted
 * destination pin — the whole path reading as an "optimised" journey.
 * Fully self-contained (own gradient) so it also works as a favicon / OG mark.
 */
export function LogoMark({ size = 40, className = '', idSuffix = 'default', style }: LogoMarkProps) {
  const badgeId = `ro-badge-${idSuffix}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Route Optimiser logo"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={badgeId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3a8fd6" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* Badge */}
      <rect width="32" height="32" rx="8" fill={`url(#${badgeId})`} />

      {/* Optimised route path */}
      <path
        d="M8.5 23.5 L14 15.5 L19.5 18.5 L23.5 9.5"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />

      {/* Origin + intermediate stop nodes */}
      <circle cx="8.5" cy="23.5" r="2.1" fill="white" />
      <circle cx="14" cy="15.5" r="2.1" fill="white" />
      <circle cx="19.5" cy="18.5" r="2.1" fill="white" />

      {/* Highlighted destination (optimised = green) */}
      <circle cx="23.5" cy="9.5" r="3.6" fill="#22c55e" stroke="white" strokeWidth="1.4" />
    </svg>
  )
}

interface LogoProps {
  /** Badge size in px. */
  size?: number
  /** Show the "Route Optimiser" wordmark next to the mark. */
  showWordmark?: boolean
  /** Override the wordmark text. */
  wordmark?: string
  /** Tailwind classes for the wordmark text. */
  wordmarkClassName?: string
  className?: string
  idSuffix?: string
}

export default function Logo({
  size = 40,
  showWordmark = true,
  wordmark = 'Route Optimiser',
  wordmarkClassName = 'font-bold text-lg tracking-tight text-white',
  className = '',
  idSuffix = 'default',
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={size} idSuffix={idSuffix} className="shrink-0 shadow-lg rounded-[8px]" />
      {showWordmark && <span className={wordmarkClassName}>{wordmark}</span>}
    </span>
  )
}
