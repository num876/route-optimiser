"use client"

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-primary">
      <div className="bg-surface/50 p-8 rounded-2xl border border-border flex flex-col items-center text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
        <p className="text-secondary mb-8 text-sm">
          A critical error occurred in the application.
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-border text-primary font-semibold rounded-lg hover:bg-border/80 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
