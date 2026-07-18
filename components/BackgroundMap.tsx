"use client"
import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function MapPanner() {
  const map = useMap()

  useEffect(() => {
    // Respect reduced-motion preferences: skip the continuous pan entirely.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let animationFrameId: number | null = null

    const pan = () => {
      map.panBy([0.5, 0], { animate: false })
      animationFrameId = requestAnimationFrame(pan)
    }

    const start = () => {
      if (animationFrameId === null) animationFrameId = requestAnimationFrame(pan)
    }

    const stop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
    }

    // Pause the animation loop when the tab is hidden to save battery/CPU on mobile.
    const handleVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    if (!document.hidden) start()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      stop()
    }
  }, [map])

  return null
}

export default function BackgroundMap() {
  // Start near London
  const center: [number, number] = [51.505, -0.09]

  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60 overflow-hidden">
      {/* Oversize the map so panning doesn't immediately reveal edges */}
      <div className="w-[150%] h-[150%] -translate-x-[25%] -translate-y-[25%]">
        <MapContainer 
          center={center} 
          zoom={14} 
          zoomControl={false} 
          dragging={false} 
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          attributionControl={false}
          className="w-full h-full"
        >
          {/* CartoDB Dark Matter tile layer for sleek dark theme */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapPanner />
        </MapContainer>
      </div>

      {/* Heavy vignette to blend the map into the #0c0e11 background */}
      <div className="absolute inset-0 bg-background/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent h-48 bottom-0" />
    </div>
  )
}
