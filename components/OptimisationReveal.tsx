import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'

interface OptimisationRevealProps {
  percentImprovement: number
  timeSavedSeconds: number
  distanceSavedMeters: number
}

export default function OptimisationReveal({ percentImprovement, timeSavedSeconds }: OptimisationRevealProps) {
  useEffect(() => {
    const duration = 2000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#3a8fd6', '#e8622c', '#2a6e42']
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#3a8fd6', '#e8622c', '#2a6e42']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  const minutesSaved = Math.round(timeSavedSeconds / 60)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className="absolute top-16 md:top-auto md:bottom-8 left-1/2 -translate-x-1/2 z-[1000]
        bg-surface/95 backdrop-blur-xl border border-optimised-badge/30
        rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 flex flex-col items-center gap-2"
    >
      <div className="flex items-center gap-2 text-optimised-badge font-semibold text-lg">
        <Sparkles size={20} className="animate-pulse" />
        <span>Route Optimised!</span>
      </div>
      
      <div className="flex items-center gap-8 text-primary mt-2">
        <div className="text-center">
          <div className="text-4xl font-mono font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">{percentImprovement}%</div>
          <div className="text-[10px] text-secondary uppercase tracking-wider mt-1 font-bold">Shorter route</div>
        </div>
        <div className="w-px h-12 bg-border/50"></div>
        <div className="text-center">
          <div className="text-4xl font-mono font-bold bg-gradient-to-br from-route-line to-blue-300 bg-clip-text text-transparent">{minutesSaved}</div>
          <div className="text-[10px] text-secondary uppercase tracking-wider mt-1 font-bold">Minutes saved</div>
        </div>
      </div>
    </motion.div>
  )
}
