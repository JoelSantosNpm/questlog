'use client'

import { cn } from '@/shared/utils/styles'

interface ToggleButtonProps {
  label: string
  isActive: boolean
  onToggle: () => void
  activeClassName?: string
  className?: string
}

export function ToggleButton({
  label,
  isActive,
  onToggle,
  activeClassName,
  className,
}: ToggleButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 cursor-pointer select-none',
        isActive
          ? (activeClassName ?? 'border-amber-500/40 bg-amber-500/15 text-amber-400')
          : 'border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-600 hover:text-neutral-300',
        className
      )}
    >
      {label}
    </button>
  )
}
