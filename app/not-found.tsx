import Link from 'next/link'
import { Map } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-primary">
      <div className="bg-surface/50 p-8 rounded-2xl border border-border flex flex-col items-center text-center max-w-md">
        <div className="w-16 h-16 bg-border rounded-full flex items-center justify-center mb-6">
          <Map size={32} className="text-secondary" />
        </div>
        <h2 className="text-3xl font-bold mb-2">404 - Lost in transit</h2>
        <p className="text-secondary mb-8">
          The route you are looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-route-line text-white font-semibold rounded-lg hover:bg-route-line/90 transition-colors"
        >
          Return to Planner
        </Link>
      </div>
    </div>
  )
}
