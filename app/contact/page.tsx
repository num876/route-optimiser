"use client"

import { useState } from 'react'
import { Mail, MessageSquare, CheckCircle2 } from 'lucide-react'
import PageShell from '@/components/PageShell'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // No backend is wired up: open the user's mail client pre-filled, then confirm.
    const subject = encodeURIComponent(`Route Optimiser enquiry from ${name || 'a visitor'}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)
    window.location.href = `mailto:hello@routeoptimiser.app?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <PageShell
      eyebrow="Contact"
      title="Get in touch"
      description="Questions, feedback, or a feature request? We'd love to hear from you."
    >
      <div className="grid gap-6 md:grid-cols-5">
        {/* Contact details */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-surface/60 border border-border/60 rounded-2xl p-5">
            <div className="w-11 h-11 rounded-xl bg-route-line/10 border border-route-line/20 text-route-line flex items-center justify-center mb-4">
              <Mail size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Email us</h3>
            <a href="mailto:hello@routeoptimiser.app" className="text-sm text-route-line hover:underline break-all">
              hello@routeoptimiser.app
            </a>
          </div>
          <div className="bg-surface/60 border border-border/60 rounded-2xl p-5">
            <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-4">
              <MessageSquare size={22} />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Response time</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">We typically reply within 1–2 business days.</p>
          </div>
        </div>

        {/* Contact form */}
        <div className="md:col-span-3">
          {sent ? (
            <div className="bg-surface/60 border border-border/60 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center gap-3">
              <CheckCircle2 size={40} className="text-green-400" />
              <h3 className="text-xl font-bold text-white">Thanks for reaching out!</h3>
              <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
                Your email draft should have opened. If it didn&apos;t, email us directly at{' '}
                <a href="mailto:hello@routeoptimiser.app" className="text-route-line hover:underline">
                  hello@routeoptimiser.app
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-border text-primary font-medium text-sm hover:bg-border/70 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface/60 border border-border/60 rounded-2xl p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-zinc-300 mb-1.5">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 rounded-xl bg-background border border-border px-4 text-primary placeholder:text-zinc-600 outline-none focus:border-route-line transition-colors"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-zinc-300 mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-xl bg-background border border-border px-4 text-primary placeholder:text-zinc-600 outline-none focus:border-route-line transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-zinc-300 mb-1.5">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl bg-background border border-border px-4 py-3 text-primary placeholder:text-zinc-600 outline-none focus:border-route-line transition-colors resize-y"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-route-line to-blue-600 hover:from-route-line/90 hover:to-blue-600/90 text-white font-bold shadow-lg transition-all active:scale-[0.99]"
              >
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  )
}
