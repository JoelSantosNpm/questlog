import type { ReactNode } from 'react'

interface StatBoxProps {
  label: string
  value: number | string
  icon?: ReactNode
}

export const StatBox = ({ label, value, icon }: StatBoxProps) => (
  <div className='flex flex-col items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/50 p-3'>
    <span className='text-[10px] font-bold uppercase tracking-widest text-neutral-500'>
      {label}
    </span>
    <div className='mt-1 flex items-center gap-1'>
      {icon && <span className='text-amber-500/60'>{icon}</span>}
      <span className='font-mono text-lg font-bold text-amber-500'>{value}</span>
    </div>
  </div>
)
