import { useState, useEffect } from 'react'
import { MapPin, Search, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Suggestion {
  address: string
  lat: number
  lng: number
}

interface StopInputProps {
  onAddStop: (address: string, lat: number, lng: number) => void
  disabled?: boolean
}

export default function StopInput({ onAddStop, disabled }: StopInputProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/geocode?address=${encodeURIComponent(query)}`)
        if (res.ok) {
          const coords = await res.json()
          if (!coords.error && Array.isArray(coords)) {
             setSuggestions(coords)
          } else {
             setSuggestions([])
          }
        } else {
          setSuggestions([])
        }
      } catch (e) {
        setSuggestions([])
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleAdd = (suggestion: Suggestion) => {
    onAddStop(suggestion.address, suggestion.lat, suggestion.lng)
    setQuery('')
    setSuggestions([])
  }

  return (
    <div className="relative z-[1002]">
      <div className={`relative flex items-center bg-background/50 border rounded-xl overflow-hidden transition-all duration-300 ${isFocused ? 'border-route-line shadow-[0_0_15px_rgba(58,143,214,0.15)]' : 'border-border'}`}>
        <div className="pl-4 text-secondary">
          <Search size={18} className={isFocused ? 'text-route-line' : ''} />
        </div>
        
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full bg-transparent border-none text-primary px-3 pt-5 pb-2 focus:outline-none peer"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && suggestions.length > 0) {
                handleAdd(suggestions[0])
              }
            }}
            disabled={disabled}
            placeholder=" "
          />
          <label className={`absolute left-3 transition-all duration-200 pointer-events-none text-secondary ${query.length > 0 || isFocused ? 'text-[10px] top-1.5 opacity-70' : 'text-sm top-3.5 opacity-100'}`}>
            Enter an address...
          </label>
        </div>

        {isSearching && (
          <div className="pr-4 text-route-line">
            <Loader2 size={18} className="animate-spin" />
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {suggestions.length > 0 && query.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden z-[1001]"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-border/50 transition-colors text-primary border-b border-border/50 last:border-b-0"
                onClick={() => handleAdd(suggestion)}
              >
                <div className="bg-route-line/10 p-1.5 rounded-full">
                  <MapPin size={16} className="text-route-line flex-shrink-0" />
                </div>
                <span className="truncate">{suggestion.address}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
