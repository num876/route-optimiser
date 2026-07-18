"use client"

import {
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

// Snap points as a fraction of the viewport height: peek, half, full.
const SNAPS = [0.46, 0.72, 0.92]
const MIN_FRAC = 0.28
const MAX_FRAC = 0.94

export interface MobileSheetHandle {
  snapTo: (index: number) => void
}

interface MobileSheetProps {
  header: ReactNode
  children: ReactNode
  footer: ReactNode
  onHeightChange?: (px: number) => void
}

const MobileSheet = forwardRef<MobileSheetHandle, MobileSheetProps>(function MobileSheet(
  { header, children, footer, onHeightChange },
  ref
) {
  const [vh, setVh] = useState(0)
  const [height, setHeight] = useState(0)
  const [snapIndex, setSnapIndex] = useState(0)
  const [dragging, setDragging] = useState(false)

  const startY = useRef(0)
  const startH = useRef(0)

  useEffect(() => {
    const update = () => {
      const h = window.innerHeight
      setVh(h)
      setHeight((prev) => (prev === 0 ? h * SNAPS[0] : prev))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Report height only when settled (not mid-drag) so the map re-fits once per snap.
  useEffect(() => {
    if (height > 0 && !dragging) onHeightChange?.(height)
  }, [height, dragging, onHeightChange])

  const snapTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(SNAPS.length - 1, index))
      setSnapIndex(clamped)
      if (vh > 0) setHeight(vh * SNAPS[clamped])
    },
    [vh]
  )

  useImperativeHandle(ref, () => ({ snapTo }), [snapTo])

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true)
    startY.current = e.clientY
    startH.current = height
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    const delta = startY.current - e.clientY // dragging up increases height
    const next = Math.min(vh * MAX_FRAC, Math.max(vh * MIN_FRAC, startH.current + delta))
    setHeight(next)
  }

  const handlePointerUp = () => {
    if (!dragging) return
    setDragging(false)
    const frac = height / vh
    let nearest = 0
    let best = Infinity
    SNAPS.forEach((s, i) => {
      const d = Math.abs(s - frac)
      if (d < best) {
        best = d
        nearest = i
      }
    })
    snapTo(nearest)
  }

  const isFull = snapIndex === SNAPS.length - 1

  return (
    <>
      <div
        aria-hidden="true"
        onClick={() => snapTo(0)}
        className={`fixed inset-0 z-10 bg-background/60 transition-opacity duration-300 md:hidden ${
          isFull ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        style={{
          height: height || undefined,
          transition: dragging ? 'none' : 'height 320ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
        className="fixed inset-x-0 bottom-0 z-20 flex flex-col rounded-t-3xl border-t border-border/60 bg-surface/90 shadow-[0_-8px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden"
      >
        <div
          role="button"
          tabIndex={0}
          aria-label="Drag to resize panel"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') snapTo(snapIndex + 1)
            if (e.key === 'ArrowDown') snapTo(snapIndex - 1)
          }}
          className="flex shrink-0 cursor-grab touch-none items-center justify-center pt-3 pb-2 active:cursor-grabbing"
        >
          <span className="h-1.5 w-12 rounded-full bg-border transition-colors" />
        </div>

        <div className="shrink-0 px-5">{header}</div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-4">{children}</div>

        <div
          className="shrink-0 border-t border-white/10 px-5 pt-3"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        >
          {footer}
        </div>
      </div>
    </>
  )
})

export default MobileSheet
