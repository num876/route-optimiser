import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Sparkles, Repeat, Route, ArrowRight } from 'lucide-react'
import PageShell from '@/components/PageShell'

export const metadata: Metadata = {
  title: 'How It Works | Route Optimiser',
  description: 'Understand the Traveling Salesman Problem and the nearest-neighbour + 2-opt heuristic that powers Route Optimiser.',
}

const steps = [
  {
    icon: MapPin,
    title: '1. Add your stops',
    body: 'Type in each address. Stops are geocoded to coordinates so we can measure real driving distances and durations between them.',
  },
  {
    icon: Sparkles,
    title: '2. Build a baseline',
    body: 'A nearest-neighbour pass builds a fast greedy route by always hopping to the closest unvisited stop.',
  },
  {
    icon: Route,
    title: '3. Refine with 2-opt',
    body: 'We repeatedly uncross route segments; whenever reversing a segment shortens the total duration, we keep it — until no further gains remain.',
  },
  {
    icon: Repeat,
    title: '4. Close the loop (optional)',
    body: 'Toggle "Round Trip" and the optimiser returns you to your starting point, ideal for depots and home bases.',
  },
]

export default function HowItWorksPage() {
  return (
    <PageShell
      eyebrow="How It Works"
      title="Near-optimal routes in milliseconds"
      description="Route Optimiser solves a variant of the classic Traveling Salesman Problem entirely in your browser — no paid routing API doing the heavy lifting."
    >
      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-bold text-white">The Traveling Salesman Problem</h2>
        <p className="text-zinc-300 leading-relaxed text-pretty">
          Given a list of stops, what is the most efficient order to visit them all? Because the problem is NP-hard,
          checking every possible permutation becomes impossible very quickly — just 10 stops already yields over
          3.6 million combinations. Instead of brute force, we use a two-step heuristic that reliably finds
          near-optimal answers fast.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {steps.map((step) => (
          <div key={step.title} className="bg-surface/60 border border-border/60 rounded-2xl p-5">
            <div className="w-11 h-11 rounded-xl bg-route-line/10 border border-route-line/20 text-route-line flex items-center justify-center mb-4">
              <step.icon size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>

      <section className="bg-surface/60 border border-border/60 rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-bold text-white">Why run it in the browser?</h2>
        <p className="text-zinc-300 leading-relaxed text-pretty">
          Running the optimisation math client-side keeps results instant, avoids per-request API costs, and means
          your stop list does not need to be sent to a server just to be reordered. It is fast enough for
          client and edge environments while still producing routes within a few percent of the true optimum.
        </p>
      </section>

      <div className="pt-2">
        <Link
          href="/planner"
          className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-route-line to-blue-600 hover:from-route-line/90 hover:to-blue-600/90 text-white font-bold text-sm shadow-lg items-center gap-2 group"
        >
          Try it on a real route
          <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </PageShell>
  )
}
