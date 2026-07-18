import Link from 'next/link'
import { MapPin } from 'lucide-react'

const footerLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy & Data' },
]

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-border/40 z-10 relative bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-route-line to-blue-600 flex items-center justify-center shadow-lg">
              <MapPin size={18} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">Route Optimiser</span>
          </Link>
          <p className="text-zinc-500 text-sm leading-relaxed">
            A fast, map-first multi-stop route planner powered by an in-browser TSP solver.
          </p>
        </div>

        <nav className="flex flex-col gap-3" aria-label="Footer">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Pages</span>
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors w-fit"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-zinc-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Route Optimiser. All rights reserved.
          </p>
          <p className="text-zinc-600 text-xs font-medium">
            Powered by OpenRouteService and Leaflet.
          </p>
        </div>
      </div>
    </footer>
  )
}
