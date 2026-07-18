"use client"

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Map, Navigation, ArrowRight, Zap, RefreshCw, ChevronDown } from 'lucide-react'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

// Dynamically import the background map to avoid SSR window errors
const BackgroundMap = dynamic(() => import('@/components/BackgroundMap'), { ssr: false })

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background font-sans text-primary selection:bg-route-line/30 flex flex-col relative overflow-hidden">
      
      {/* Live Map Background */}
      <BackgroundMap />
      
      {/* Abstract Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-route-line/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Navigation */}
      <SiteNav />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-8 pb-14 md:pt-16 md:pb-24 z-10 relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center p-6 md:p-12 rounded-3xl md:rounded-[3rem] bg-background/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-route-line/30 text-route-line text-xs md:text-sm font-semibold mb-6 md:mb-8 shadow-[0_0_20px_rgba(58,143,214,0.15)]">
            <Navigation size={14} />
            <span>Multi-Stop Route Planning</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-4 md:mb-6 leading-[1.1] text-balance text-white">
            Master Your Route. <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-route-line via-blue-400 to-green-400 bg-clip-text text-transparent">
              Save Your Time.
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-zinc-300 max-w-2xl mb-8 md:mb-12 leading-relaxed font-medium text-pretty">
            Whether you are running daily deliveries, mapping a sales territory, or planning a road trip, our smart algorithm instantly calculates the fastest path between all your stops.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
            <Link 
              href="/planner"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-route-line to-blue-600 hover:from-route-line/90 hover:to-blue-600/90 text-white font-bold text-base md:text-lg shadow-[0_10px_30px_rgba(58,143,214,0.3)] hover:shadow-[0_15px_40px_rgba(58,143,214,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              Start Planning
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/planner?demo=true"
              className="px-8 py-4 rounded-2xl bg-surface/80 backdrop-blur-md border border-border/80 hover:bg-surface hover:border-border text-primary font-bold text-base md:text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Try Demo Route
            </Link>
          </div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 text-zinc-500"
          aria-hidden="true"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="bg-surface/60 backdrop-blur-2xl border-t border-border/50 py-16 md:py-24 z-10 relative">
        <div className="max-w-7xl mx-auto px-5 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-10 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4 text-balance text-white">
              Engineered for <span className="bg-gradient-to-r from-route-line to-blue-400 bg-clip-text text-transparent">Logistics</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-base md:text-lg text-pretty">Built to handle complex routing with an intuitive, map-first interface.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-background/80 backdrop-blur-lg border border-border/50 p-6 md:p-8 rounded-3xl md:rounded-[2rem] hover:border-route-line/50 transition-all shadow-lg hover:shadow-[0_10px_40px_rgba(58,143,214,0.15)] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-route-line/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              <div className="w-14 h-14 rounded-2xl bg-route-line/10 border border-route-line/20 text-route-line flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner relative z-10">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white relative z-10">Instant Optimization</h3>
              <p className="text-zinc-400 leading-relaxed font-medium relative z-10">
                Add your stops in any order. Our custom 2-opt TSP solver instantly reorders them to find the absolute shortest path.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-background/80 backdrop-blur-lg border border-border/50 p-6 md:p-8 rounded-3xl md:rounded-[2rem] hover:border-blue-500/50 transition-all shadow-lg hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:rotate-180 transition-transform duration-500 shadow-inner relative z-10">
                <RefreshCw size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white relative z-10">Round Trip Planning</h3>
              <p className="text-zinc-400 leading-relaxed font-medium relative z-10">
                Need to return to your depot or starting location? Toggle "Round Trip" to automatically close the loop on your route.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-background/80 backdrop-blur-lg border border-border/50 p-6 md:p-8 rounded-3xl md:rounded-[2rem] hover:border-green-500/50 transition-all shadow-lg hover:shadow-[0_10px_40px_rgba(34,197,94,0.15)] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] -mr-16 -mt-16 transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner relative z-10">
                <Map size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white relative z-10">Interactive Map</h3>
              <p className="text-zinc-400 leading-relaxed font-medium relative z-10">
                Visualize your journey with edge-to-edge Leaflet mapping, numbered waypoints, and animated route lines.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />

    </main>
  )
}
