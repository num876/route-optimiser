import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Map, ShieldCheck, ArrowRight } from 'lucide-react'
import PageShell from '@/components/PageShell'

export const metadata: Metadata = {
  title: 'About Us | Route Optimiser',
  description: 'Learn about Route Optimiser, a fast, map-first multi-stop route planner powered by an in-browser TSP solver.',
}

const values = [
  {
    icon: Zap,
    title: 'Speed first',
    body: 'Our optimisation runs directly in your browser, returning near-optimal routes in milliseconds — no waiting on slow servers.',
  },
  {
    icon: Map,
    title: 'Map-first design',
    body: 'Every feature is built around a clear, interactive map so you can see and trust the route before you drive it.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy by default',
    body: 'We do not store your addresses or routes. Your planning data stays with you.',
  },
]

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About Us"
      title="Routing made simple, fast, and private"
      description="Route Optimiser started with a simple frustration: planning multi-stop trips is tedious, and most tools are slow, cluttered, or lock the best features behind a paywall."
    >
      <div className="space-y-5 text-zinc-300 leading-relaxed text-pretty">
        <p>
          We built Route Optimiser to do one thing exceptionally well — take a list of stops in any order and
          instantly work out the most efficient way to visit them all. Whether you are running daily deliveries,
          mapping a sales territory, or planning a road trip, the tool reorders your stops to save real time and distance.
        </p>
        <p>
          Under the hood, a custom Traveling Salesman Problem solver combines a nearest-neighbour baseline with 2-opt
          local search, all running client-side. That means fast results, no account required, and no location data
          leaving your session unnecessarily.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {values.map((value) => (
          <div
            key={value.title}
            className="bg-surface/60 border border-border/60 rounded-2xl p-5"
          >
            <div className="w-11 h-11 rounded-xl bg-route-line/10 border border-route-line/20 text-route-line flex items-center justify-center mb-4">
              <value.icon size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">{value.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{value.body}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface/60 border border-border/60 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Ready to plan a route?</h3>
          <p className="text-sm text-zinc-400">Add your stops and let the optimiser do the rest.</p>
        </div>
        <Link
          href="/planner"
          className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-route-line to-blue-600 hover:from-route-line/90 hover:to-blue-600/90 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 group"
        >
          Open the planner
          <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </PageShell>
  )
}
