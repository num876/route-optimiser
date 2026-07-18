import { Stop } from '@/lib/types'
import { MapPin, X, GripVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableStopItem({ stop, index, onRemove, disabled }: { stop: Stop, index: number, onRemove: (id: string) => void, disabled: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 p-3 rounded-xl bg-surface/50 border ${isDragging ? 'border-route-line shadow-[0_0_15px_rgba(58,143,214,0.3)] bg-surface' : 'border-border/50'} group`}
    >
      <div 
        {...attributes} 
        {...listeners}
        aria-label="Drag to reorder stop"
        className={`text-secondary -my-1 -ml-1 flex h-11 w-9 shrink-0 touch-none items-center justify-center rounded-lg hover:text-white transition-colors cursor-grab active:cursor-grabbing ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <GripVertical size={18} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate flex items-center gap-2">
          {index === 0 && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">DEPOT</span>}
          {stop.address}
        </p>
      </div>
      
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(stop.id); }}
        disabled={disabled}
        aria-label={`Remove ${stop.address}`}
        className="text-secondary hover:text-red-400 -my-1 -mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-red-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <X size={18} />
      </button>
    </motion.div>
  )
}

interface StopListProps {
  stops: Stop[]
  onRemoveStop: (id: string) => void
  onReorder: (startIndex: number, endIndex: number) => void
  disabled?: boolean
}

export default function StopList({ stops, onRemoveStop, onReorder, disabled }: StopListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = stops.findIndex((s) => s.id === active.id)
      const newIndex = stops.findIndex((s) => s.id === over.id)
      onReorder(oldIndex, newIndex)
    }
  }

  if (stops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-secondary border-2 border-dashed border-border/50 rounded-xl bg-surface/20">
        <MapPin size={32} className="mb-3 opacity-50" />
        <p className="text-sm font-medium text-white">No stops added yet</p>
        <p className="text-xs mt-1">Search above to build your route</p>
      </div>
    )
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={stops.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {stops.map((stop, index) => (
              <SortableStopItem 
                key={stop.id} 
                stop={stop} 
                index={index} 
                onRemove={onRemoveStop}
                disabled={!!disabled}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  )
}
