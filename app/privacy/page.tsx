import type { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import PageShell from '@/components/PageShell'

export const metadata: Metadata = {
  title: 'Privacy & Data | Route Optimiser',
  description: 'How Route Optimiser handles your addresses and route data. We do not save, track, or permanently store your location data.',
}

const sections = [
  {
    title: 'What we process',
    body: 'When you add a stop, the address you type is sent to the OpenRouteService API to convert it into coordinates and to calculate distances and durations between stops. This is the only data required to optimise your route.',
  },
  {
    title: 'What we store',
    body: 'Nothing personal. Route Optimiser does not require an account, and we do not save, track, or permanently store your addresses, coordinates, or optimised routes on our servers. Your planning happens within your browser session.',
  },
  {
    title: 'Third-party services',
    body: 'We rely on OpenRouteService for geocoding and routing, and Leaflet with map tiles for display. Requests to these services are subject to their respective privacy policies. We send them only the minimum data needed to return a result.',
  },
  {
    title: 'Cookies and tracking',
    body: 'The core planner works without advertising or cross-site tracking cookies. Any storage used is limited to keeping the app functional during your session.',
  },
  {
    title: 'Your control',
    body: 'Because your data is not stored, closing the tab effectively clears your session. If you have questions about data handling, contact us any time.',
  },
]

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy & Data"
      title="Your routes stay yours"
      description="Route Optimiser is designed to be privacy-first. Here is exactly what happens to the information you enter."
    >
      <div className="flex items-start gap-4 bg-surface/60 border border-border/60 rounded-2xl p-5">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-optimised-badge/15 border border-optimised-badge/30 text-green-400 flex items-center justify-center">
          <ShieldCheck size={22} />
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">
          <strong className="text-white">In short:</strong> no accounts, no permanent storage, and no selling of
          your data. Addresses are used only to look up coordinates and distances, then discarded.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-lg md:text-xl font-bold text-white">{section.title}</h2>
            <p className="text-zinc-300 leading-relaxed text-pretty">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="text-xs text-zinc-500 pt-2">
        This page describes current behaviour and may be updated as the product evolves.
      </p>
    </PageShell>
  )
}
