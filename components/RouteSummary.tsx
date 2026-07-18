import { Clock, Route } from 'lucide-react'

interface RouteSummaryProps {
  totalDistanceMeters: number
  totalDurationSeconds: number
}

export default function RouteSummary({ totalDistanceMeters, totalDurationSeconds }: RouteSummaryProps) {
  const distanceKm = (totalDistanceMeters / 1000).toFixed(1)
  const hours = Math.floor(totalDurationSeconds / 3600)
  const minutes = Math.floor((totalDurationSeconds % 3600) / 60)
  
  const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

  return (
    <div className="bg-surface border border-border p-4 rounded-lg flex justify-between items-center mt-4">
      <div className="flex items-center gap-3 text-primary">
        <Route size={20} className="text-route-line" />
        <div>
          <div className="text-sm text-secondary">Total Distance</div>
          <div className="font-mono font-semibold">{distanceKm} km</div>
        </div>
      </div>
      <div className="w-px h-8 bg-border"></div>
      <div className="flex items-center gap-3 text-primary">
        <Clock size={20} className="text-route-line" />
        <div>
          <div className="text-sm text-secondary">Est. Time</div>
          <div className="font-mono font-semibold">{timeString}</div>
        </div>
      </div>
    </div>
  )
}
