"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { LogoMark } from '@/components/Logo'

export const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export default function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Prevent background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  return (
    <nav className="w-full flex items-center justify-between p-6 max-w-7xl mx-auto z-30 relative">
      <Link href="/" className="flex items-center gap-3 group" aria-label="Route Optimiser home">
        <LogoMark size={40} idSuffix="nav" className="shrink-0 rounded-xl shadow-lg group-hover:scale-105 transition-transform" />
        <span className="font-bold text-lg tracking-tight text-white drop-shadow-md">Route Optimiser</span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                active
                  ? 'text-white bg-surface/80'
                  : 'text-zinc-300 hover:text-white hover:bg-surface/50'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
        <Link
          href="/planner"
          className="ml-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-route-line to-blue-600 hover:from-route-line/90 hover:to-blue-600/90 text-white transition-all font-semibold text-sm shadow-lg flex items-center gap-1.5 group"
        >
          Open App
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="md:hidden flex h-11 w-11 items-center justify-center rounded-xl bg-surface/80 backdrop-blur-md border border-border/50 text-white"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 top-[88px] z-20 md:hidden bg-background/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-4 rounded-xl text-lg font-semibold transition-colors ${
                  active
                    ? 'text-white bg-surface'
                    : 'text-zinc-300 hover:text-white hover:bg-surface/60'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            href="/planner"
            className="mt-2 px-4 py-4 rounded-xl bg-gradient-to-r from-route-line to-blue-600 text-white font-bold text-lg text-center shadow-lg flex items-center justify-center gap-2"
          >
            Open App
            <ArrowRight size={20} />
          </Link>
        </div>
      )}
    </nav>
  )
}
