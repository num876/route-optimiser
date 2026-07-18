"use client"

import { useState, useCallback, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Stop, OptimisedFleet, FleetRoute } from '@/lib/types'
import StopInput from '@/components/StopInput'
import StopList from '@/components/StopList'
import OptimisationReveal from '@/components/OptimisationReveal'
import RouteSummary from '@/components/RouteSummary'
import FleetBreakdown from '@/components/FleetBreakdown'
import Footer from '@/components/Footer'
import AboutModal from '@/components/AboutModal'
import { Loader2, Route as RouteIcon, Truck } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const RouteMap = dynamic(() => import('@/components/RouteMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-background flex items-center justify-center text-secondary">Loading Map...</div>
})

function PlannerContent() {
  const searchParams = useSearchParams()
  const [stops, setStops] = useState<Stop[]>([])
  const [isOptimising, setIsOptimising] = useState(false)
  const [optimisationStage, setOptimisationStage] = useState('')
  const [routeResult, setRouteResult] = useState<OptimisedFleet | null>(null)
  const [showOptimised, setShowOptimised] = useState(false)
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [numVehicles, setNumVehicles] = useState(1)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [hasLoadedDemo, setHasLoadedDemo] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)

  // Hydrate state from localStorage on mount
  useEffect(() => {
    try {
      const savedStops = localStorage.getItem('route-optimiser-stops')
      if (savedStops) setStops(JSON.parse(savedStops))
      
      const savedNumVehicles = localStorage.getItem('route-optimiser-vehicles')
      if (savedNumVehicles) setNumVehicles(parseInt(savedNumVehicles, 10))
      
      const savedRoundTrip = localStorage.getItem('route-optimiser-roundtrip')
      if (savedRoundTrip) setIsRoundTrip(savedRoundTrip === 'true')
    } catch (e) {
      console.error("Failed to parse local storage", e)
    }
    setIsInitialized(true)
  }, [])

  // Persist state to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('route-optimiser-stops', JSON.stringify(stops))
    }
  }, [stops, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('route-optimiser-vehicles', numVehicles.toString())
    }
  }, [numVehicles, isInitialized])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('route-optimiser-roundtrip', isRoundTrip.toString())
    }
  }, [isRoundTrip, isInitialized])

  const handleOptimise = useCallback(async (stopsToUse: Stop[] = stops, roundTripFlag: boolean = isRoundTrip, vehiclesFlag: number = numVehicles) => {
    if (stopsToUse.length < 2) return
    
    setIsOptimising(true)
    setRouteResult(null)
    setShowOptimised(false)
    setIsSidebarExpanded(false) // Auto-collapse on mobile to show the map calculation
    
    try {
      setOptimisationStage('Clustering & Calculating...')
      const matrixRes = await fetch('/api/matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          stops: stopsToUse.map(s => ({ lat: s.latitude, lng: s.longitude })),
          isRoundTrip: roundTripFlag,
          numVehicles: vehiclesFlag
        })
      })
      const matrixData = await matrixRes.json()
      
      if (matrixData.error) throw new Error(matrixData.error)

      setOptimisationStage('Generating geometries...')
      
      // Parallel API Execution using Promise.all
      const fleetPromises = matrixData.fleetRoutes.map(async (routeIndices: number[]) => {
        const vehicleStops = routeIndices.map((index: number) => stopsToUse[index])
        if (roundTripFlag && vehicleStops.length > 1) {
          vehicleStops.push(vehicleStops[0])
        }
        
        if (vehicleStops.length > 1) {
          const geomRes = await fetch('/api/directions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedStops: vehicleStops.map((s: Stop) => ({ lat: s.latitude, lng: s.longitude })) })
          })
          const geomData = await geomRes.json()
          return {
            stopOrder: vehicleStops.map((s: Stop) => s.id),
            geometry: geomData.geometry
          }
        }
        return null
      })
      
      const fleetRoutesResults = await Promise.all(fleetPromises)
      const fleetRoutes = fleetRoutesResults.filter(Boolean) as FleetRoute[]
        
      const naiveStopsForDirections = [...stopsToUse]
      if (roundTripFlag && naiveStopsForDirections.length > 1) {
        naiveStopsForDirections.push(naiveStopsForDirections[0])
      }

      const naiveGeomRes = await fetch('/api/directions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedStops: naiveStopsForDirections.map((s: Stop) => ({ lat: s.latitude, lng: s.longitude })) })
      })
      const naiveGeomData = await naiveGeomRes.json()

      const result: OptimisedFleet = {
        routes: fleetRoutes,
        totalDistanceMeters: matrixData.totalDistanceMeters,
        totalDurationSeconds: matrixData.totalDurationSeconds,
        naiveDistanceMeters: matrixData.naiveDistanceMeters || 0,
        naiveDurationSeconds: matrixData.naiveDuration,
        percentImprovement: matrixData.percentImprovement,
        naiveGeometry: naiveGeomData.geometry
      }

      setRouteResult(result)
      
      // Reorder stops: Depot first, then all other stops grouped by vehicle
      const newStops = [stopsToUse[0]]
      for (const routeIndices of matrixData.fleetRoutes) {
        newStops.push(...routeIndices.slice(1).map((i: number) => stopsToUse[i]))
      }
      setStops(newStops)
      
      setTimeout(() => {
        setShowOptimised(true)
      }, 800)

    } catch (error) {
      console.error(error)
      alert('Failed to optimise fleet routes. Check console for details.')
    } finally {
      setIsOptimising(false)
      setOptimisationStage('')
    }
  }, [stops, isRoundTrip, numVehicles])

  const handleLoadDemo = useCallback(() => {
    const demoStops: Stop[] = [
      { id: 'demo-1', address: 'London, UK (Depot)', latitude: 51.5074, longitude: -0.1278, order: 0 },
      { id: 'demo-2', address: 'Brighton, UK', latitude: 50.8225, longitude: -0.1372, order: 1 },
      { id: 'demo-3', address: 'Oxford, UK', latitude: 51.7520, longitude: -1.2577, order: 2 },
      { id: 'demo-4', address: 'Cambridge, UK', latitude: 52.2053, longitude: 0.1218, order: 3 },
      { id: 'demo-5', address: 'Bristol, UK', latitude: 51.4545, longitude: -2.5879, order: 4 },
      { id: 'demo-6', address: 'Southampton, UK', latitude: 50.9097, longitude: -1.4044, order: 5 },
    ]
    setStops(demoStops)
    setNumVehicles(2)
    setIsRoundTrip(true)
    handleOptimise(demoStops, true, 2)
  }, [handleOptimise])

  useEffect(() => {
    if (searchParams?.get('demo') === 'true' && !hasLoadedDemo && isInitialized) {
      setHasLoadedDemo(true)
      handleLoadDemo()
    }
  }, [searchParams, hasLoadedDemo, handleLoadDemo, isInitialized])

  const handleAddStop = useCallback((address: string, lat: number, lng: number) => {
    setStops(prev => {
      const newStop: Stop = { id: Math.random().toString(36).substring(7), address, latitude: lat, longitude: lng, order: prev.length }
      return [...prev, newStop]
    })
    setRouteResult(null)
    setShowOptimised(false)
  }, [])

  const handleRemoveStop = useCallback((id: string) => {
    setStops(prev => prev.filter(s => s.id !== id))
    setRouteResult(null)
    setShowOptimised(false)
  }, [])

  const handleReorder = useCallback((startIndex: number, endIndex: number) => {
    setStops(prev => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
    setRouteResult(null)
    setShowOptimised(false)
  }, [])

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-background font-sans text-primary">
      
      <div className="absolute inset-0 z-0">
        <RouteMap 
          stops={stops} 
          naiveGeometry={routeResult?.naiveGeometry}
          fleetGeometries={routeResult?.routes.map(r => r.geometry)}
          showOptimised={showOptimised}
        />
      </div>

      <div className={`absolute z-10 flex flex-col gap-5 
        bottom-0 left-0 right-0 rounded-t-3xl border-t border-border/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        md:top-4 md:bottom-4 md:left-4 md:right-auto md:w-[420px] md:h-auto md:rounded-2xl md:border
        bg-surface/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 overflow-hidden
        ${isSidebarExpanded ? 'h-[85vh]' : 'h-[35vh] md:h-auto'}`}
      >
        <button 
          className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-border hover:bg-zinc-600 transition-colors md:hidden"
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        />
        
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <Link href="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-route-line to-purple-500 flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer shrink-0">
            <RouteIcon size={24} className="text-white" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-0 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Fleet Optimiser</h1>
            <p className="text-secondary text-[11px] md:text-xs">Distribute up to 20 stops across your drivers.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-2 -mr-2">
          <StopInput onAddStop={handleAddStop} disabled={isOptimising || stops.length >= 20} />

          <div className="relative min-h-[120px] flex-1">
            {isOptimising && (
              <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
                <div className="flex flex-col items-center gap-2 text-route-line animate-pulse">
                  <Loader2 size={32} className="animate-spin" />
                  <span className="text-sm font-semibold text-center px-4">{optimisationStage}</span>
                </div>
              </div>
            )}
            <StopList 
              stops={stops} 
              onRemoveStop={handleRemoveStop} 
              onReorder={handleReorder}
              disabled={isOptimising}
            />
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-4 shrink-0">
            {/* Fleet Controls */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-white">
                <Truck size={16} className="text-route-line" />
                <span className="text-sm font-semibold">Fleet Size (Vehicles)</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setNumVehicles(Math.max(1, numVehicles - 1)); setRouteResult(null); setShowOptimised(false); }} 
                  className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  -
                </button>
                <span className="font-bold text-lg w-4 text-center">{numVehicles}</span>
                <button 
                  onClick={() => { setNumVehicles(Math.min(5, numVehicles + 1)); setRouteResult(null); setShowOptimised(false); }} 
                  className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <button 
                type="button" 
                onClick={() => { setIsRoundTrip(!isRoundTrip); setRouteResult(null); setShowOptimised(false); }}
                disabled={isOptimising}
                className={`w-10 h-6 rounded-full transition-colors flex items-center relative shadow-inner ${isRoundTrip ? 'bg-route-line' : 'bg-background border border-border'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute transition-transform shadow-md ${isRoundTrip ? 'translate-x-5' : 'translate-x-1'}`}></div>
              </button>
              <span className="text-sm text-secondary select-none cursor-pointer hover:text-primary transition-colors" onClick={() => !isOptimising && setIsRoundTrip(!isRoundTrip)}>
                Return to Depot (Round Trip)
              </span>
            </div>
          </div>

          {routeResult && showOptimised && (
            <div className="shrink-0">
              <RouteSummary 
                totalDistanceMeters={routeResult.totalDistanceMeters} 
                totalDurationSeconds={routeResult.totalDurationSeconds} 
              />
              <FleetBreakdown fleet={routeResult} stops={stops} />
            </div>
          )}
        </div>

        <div className="shrink-0 pt-2">
          <button
            onClick={() => handleOptimise()}
            disabled={stops.length < 2 || isOptimising}
            className="w-full py-4 px-4 bg-route-line text-white font-semibold rounded-xl shadow-[0_10px_20px_rgba(58,143,214,0.3)] hover:bg-route-line/90 hover:shadow-[0_10px_25px_rgba(58,143,214,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isOptimising ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Calculating...
              </>
            ) : (
              `Optimise Fleet Route${numVehicles > 1 ? 's' : ''}`
            )}
          </button>
        </div>

        <Footer onOpenAbout={() => setIsAboutOpen(true)} />
      </div>

      <AnimatePresence>
        {routeResult && showOptimised && routeResult.percentImprovement > 0 && (
          <OptimisationReveal 
            percentImprovement={routeResult.percentImprovement}
            timeSavedSeconds={routeResult.naiveDurationSeconds - routeResult.totalDurationSeconds}
            distanceSavedMeters={(routeResult as any).naiveDistanceMeters - routeResult.totalDistanceMeters || 0}
          />
        )}
      </AnimatePresence>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </main>
  )
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen bg-background flex items-center justify-center text-secondary">Loading...</div>}>
      <PlannerContent />
    </Suspense>
  )
}
