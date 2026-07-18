interface FooterProps {
  onOpenAbout: () => void
}

export default function Footer({ onOpenAbout }: FooterProps) {
  return (
    <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2 text-xs text-secondary">
      <div className="flex justify-between items-center">
        <button 
          onClick={onOpenAbout}
          className="hover:text-primary transition-colors underline underline-offset-2 decoration-border hover:decoration-secondary"
        >
          How it works
        </button>
        <span>
          v1.0.0
        </span>
      </div>
      <div className="text-[10px] text-secondary/60">
        Routing data by <a href="https://openrouteservice.org" target="_blank" rel="noreferrer" className="hover:text-primary">OpenRouteService</a>. 
        Map data &copy; <a href="https://openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="hover:text-primary">OpenStreetMap</a>.
      </div>
    </div>
  )
}
