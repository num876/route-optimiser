"use client"

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Stop } from '@/lib/types'

const FLEET_COLORS = ['#3a8fd6', '#e8622c', '#16a34a', '#a855f7', '#facc15']

const createNumberedIcon = (number: number, isStart: boolean) => {
  if (isStart) {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #16a34a; color: white; border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; border: 3px solid white; box-shadow: 0 0 20px rgba(22, 163, 74, 0.8), 0 4px 10px rgba(0,0,0,0.5); font-family: var(--font-sans); z-index: 1000; position: relative;">★</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });
  }

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: var(--color-surface); color: var(--color-primary); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; border: 2px solid var(--color-route-line); box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-family: var(--font-sans); opacity: 0.95;">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

function MapUpdater({ stops, fleetGeometries, naiveGeometry, bottomInset = 0 }: { stops: Stop[], fleetGeometries?: [number, number][][], naiveGeometry?: [number, number][], bottomInset?: number }) {
  const map = useMap()

  useEffect(() => {
    if (stops.length > 0) {
      const bounds = L.latLngBounds(stops.map(s => [s.latitude, s.longitude]))

      if (fleetGeometries) {
        fleetGeometries.forEach(route => {
          route.forEach(coord => bounds.extend(coord as [number, number]))
        })
      } else if (naiveGeometry) {
        naiveGeometry.forEach(coord => bounds.extend(coord as [number, number]))
      }

      const isMobile = window.innerWidth < 768
      // On mobile the bottom sheet overlaps the map, so reserve its height (plus a
      // small margin) as bottom padding to keep the whole route visible above it.
      const bottomPad = isMobile ? Math.round(bottomInset) + 24 : 50
      const paddingOptions: L.FitBoundsOptions = isMobile
        ? { paddingBottomRight: [24, bottomPad], paddingTopLeft: [24, 24], maxZoom: 15 }
        : { paddingBottomRight: [50, 50], paddingTopLeft: [450, 50], maxZoom: 15 }

      map.fitBounds(bounds, paddingOptions)
    }
    // Re-fit when the sheet height settles at a snap point as well.
  }, [stops, fleetGeometries, naiveGeometry, map, bottomInset])

  return null
}

interface RouteMapProps {
  stops: Stop[]
  naiveGeometry?: [number, number][]
  fleetGeometries?: [number, number][][]
  showOptimised?: boolean
  bottomInset?: number
}

export default function RouteMap({ stops, naiveGeometry, fleetGeometries, showOptimised, bottomInset = 0 }: RouteMapProps) {
  const defaultCenter: [number, number] = [51.505, -0.09]

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          crossOrigin="anonymous"
        />
        
        {naiveGeometry && !showOptimised && (
          <Polyline 
            positions={naiveGeometry} 
            pathOptions={{ color: '#5c626c', weight: 3, dashArray: '5, 10', opacity: 0.4 }} 
          />
        )}
        
        {fleetGeometries && showOptimised && fleetGeometries.map((geometry, index) => (
          <Polyline 
            key={index}
            positions={geometry} 
            pathOptions={{ color: FLEET_COLORS[index % FLEET_COLORS.length], weight: 5, opacity: 0.9, dashArray: '20, 30' }} 
            className="animate-flow drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
          />
        ))}
        
        {stops.map((stop, i) => (
          <Marker 
            key={stop.id} 
            position={[stop.latitude, stop.longitude]} 
            icon={createNumberedIcon(i, i === 0)}
          />
        ))}
        
        <MapUpdater stops={stops} fleetGeometries={showOptimised ? fleetGeometries : undefined} naiveGeometry={naiveGeometry} bottomInset={bottomInset} />
      </MapContainer>
    </div>
  )
}
