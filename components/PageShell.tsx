import type { ReactNode } from 'react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

interface PageShellProps {
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
}

export default function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <main className="min-h-screen bg-background font-sans text-primary flex flex-col relative overflow-hidden">
      {/* Abstract background glows, consistent with the landing page */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-route-line/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <SiteNav />

      <section className="flex-1 z-10 relative w-full max-w-3xl mx-auto px-6 pt-8 pb-20 md:pt-12">
        <header className="mb-10 md:mb-14">
          {eyebrow && (
            <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-wider text-route-line mb-3">
              {eyebrow}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-balance text-white mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed text-pretty">
              {description}
            </p>
          )}
        </header>

        <div className="space-y-8">{children}</div>
      </section>

      <SiteFooter />
    </main>
  )
}
