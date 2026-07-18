import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/PageShell'

export const metadata: Metadata = {
  title: 'FAQ | Route Optimiser',
  description: 'Frequently asked questions about Route Optimiser — stops, optimisation, round trips, data privacy, and more.',
}

const faqs = [
  {
    q: 'Do I need an account to use Route Optimiser?',
    a: 'No. You can add stops and optimise a route immediately — no sign-up, login, or payment required.',
  },
  {
    q: 'How many stops can I add?',
    a: 'You can add many stops, and the 2-opt solver keeps working quickly even as the list grows. Very large lists take a little longer to geocode, but optimisation itself stays fast because it runs in your browser.',
  },
  {
    q: 'How accurate is the optimised route?',
    a: 'We use a nearest-neighbour baseline refined by 2-opt local search. This reliably produces routes within a few percent of the true optimum, which is more than enough for real-world planning, and it returns results in milliseconds.',
  },
  {
    q: 'What is a round trip?',
    a: 'Enabling "Round Trip" tells the optimiser to return to your starting location at the end, closing the loop. This is ideal when you start and finish at the same depot or home base.',
  },
  {
    q: 'Where does the map and distance data come from?',
    a: 'Maps are rendered with Leaflet, and distances, durations, and geocoding come from the OpenRouteService API.',
  },
  {
    q: 'Is my location data stored?',
    a: 'No. Addresses are processed temporarily to fetch coordinates and distances. No location data or routes are saved, tracked, or permanently stored. See the Privacy & Data page for details.',
  },
]

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="FAQ"
      title="Frequently asked questions"
      description="Quick answers to the most common questions. Still stuck? Reach out from the contact page."
    >
      <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-surface/60 overflow-hidden">
        {faqs.map((faq) => (
          <details key={faq.q} className="group">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 md:px-6 md:py-5 text-white font-semibold hover:bg-surface/80 transition-colors">
              <span className="text-pretty">{faq.q}</span>
              <span
                aria-hidden="true"
                className="shrink-0 text-route-line text-2xl leading-none transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="px-5 pb-5 md:px-6 md:pb-6 text-zinc-400 leading-relaxed text-pretty">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <p className="text-zinc-400 text-sm">
        Can&apos;t find what you&apos;re looking for?{' '}
        <Link href="/contact" className="text-route-line font-semibold hover:underline">
          Contact us
        </Link>
        .
      </p>
    </PageShell>
  )
}
