import { OptimisedFleet, Stop } from '@/lib/types'
import { Truck, ExternalLink, Clock, MapPin } from 'lucide-react'

const FLEET_COLORS = ['#3a8fd6', '#e8622c', '#16a34a', '#a855f7', '#facc15']

interface FleetBreakdownProps {
  fleet: OptimisedFleet
  stops: Stop[]
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function FleetBreakdown({ fleet, stops }: FleetBreakdownProps) {
  const generateGoogleMapsLink = (stopOrder: string[]) => {
    // Generate a Google Maps directions URL
    const orderedStops = stopOrder.map(id => stops.find(s => s.id === id)).filter(Boolean) as Stop[]
    if (orderedStops.length < 2) return '#'
    
    const origin = encodeURIComponent(orderedStops[0].address)
    const destination = encodeURIComponent(orderedStops[orderedStops.length - 1].address)
    
    let waypoints = ''
    if (orderedStops.length > 2) {
      waypoints = '&waypoints=' + orderedStops.slice(1, -1).map(s => encodeURIComponent(s.address)).join('|')
    }
    
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints}&travelmode=driving`
  }

  return (
    <div className="flex flex-col gap-3 mt-4 mb-2">
      <h3 className="text-white font-semibold text-sm px-1">Fleet Manifest</h3>
      <div className="flex flex-col gap-2">
        {fleet.routes.map((route, index) => {
          // Estimate this specific route's stops (excluding depot duplicates if any)
          const stopCount = new Set(route.stopOrder).size - 1 // -1 for depot
          
          return (
            <div key={index} className="bg-background/80 border border-border/60 rounded-xl p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${FLEET_COLORS[index % FLEET_COLORS.length]}20`, color: FLEET_COLORS[index % FLEET_COLORS.length] }}>
                    <Truck size={16} />
                  </div>
                  <div>
                    <span className="text-white text-sm font-semibold block">Vehicle {index + 1}</span>
                    <span className="text-xs text-secondary">{stopCount} stops</span>
                  </div>
                </div>
                <a 
                  href={generateGoogleMapsLink(route.stopOrder)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-surface hover:bg-white/10 transition-colors text-xs font-semibold text-white flex items-center gap-1.5 border border-border"
                >
                  <MapPin size={12} className="text-blue-400" />
                  Export
                  <ExternalLink size={12} className="text-secondary ml-0.5" />
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
