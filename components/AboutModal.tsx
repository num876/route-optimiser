import { X, Code2, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      document.body.style.overflow = 'hidden'
    } else {
      setTimeout(() => setMounted(false), 300)
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen && !mounted) return null

  return (
    <div className={`fixed inset-0 z-[2000] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'bg-background/80 backdrop-blur-sm opacity-100' : 'bg-transparent backdrop-blur-none opacity-0'}`}>
      <div className={`bg-surface border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Code2 className="text-route-line" /> 
            About the Algorithm
          </h2>
          <button 
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors bg-background rounded-full p-2"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] text-secondary space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-primary mb-2">The Traveling Salesman Problem</h3>
            <p className="leading-relaxed">
              This application solves a variant of the classic Traveling Salesman Problem (TSP). 
              Given a list of stops, what is the most efficient order to visit them all? 
              Because TSP is NP-Hard, calculating every possible permutation becomes impossible very quickly (e.g., 10 stops = 3.6 million combinations).
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-primary mb-2">How it works</h3>
            <p className="leading-relaxed mb-3">
              Instead of relying on a paid API to do the heavy lifting, the optimization math runs entirely within this application using a two-step heuristic approach:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li><strong>Nearest-Neighbour:</strong> We first build a fast "greedy" baseline route by always jumping to the closest unvisited stop.</li>
              <li><strong>2-opt Local Search:</strong> We then iteratively try crossing and uncrossing segments of the route. If reversing a segment results in a shorter total duration, we keep it. This repeats until no further improvements can be found.</li>
            </ol>
            <p className="mt-3 leading-relaxed">
              This approach reliably finds near-optimal solutions in mere milliseconds, making it perfect for client/edge environments.
            </p>
          </section>

          <section className="bg-background p-4 rounded-xl border border-border">
            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-optimised-badge" /> 
              Privacy & Data
            </h3>
            <p className="text-sm">
              Addresses entered into this tool are processed temporarily via the OpenRouteService API to retrieve coordinates and distance matrices. <strong>No location data or routes are saved, tracked, or permanently stored</strong> by this application.
            </p>
          </section>
        </div>

        <div className="p-4 border-t border-border bg-background/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-border text-primary font-medium rounded-lg hover:bg-border/80 transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  )
}
