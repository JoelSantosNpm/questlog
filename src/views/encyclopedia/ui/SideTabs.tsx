'use client'

import { cn } from '@/shared/utils/styles'
import { m } from 'framer-motion'
import { Landmark, Skull, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useActiveSection, useSetActiveSection } from '../model/encyclopediaStore'
import type { SectionConfig } from '../model/types'

const SECTIONS: SectionConfig[] = [
  { id: 'bestiary', icon: Skull },
  { id: 'cast', icon: Users },
  { id: 'museum', icon: Landmark },
]

export const SideTabs = () => {
  const activeSection = useActiveSection()
  const setActiveSection = useSetActiveSection()
  const t = useTranslations('Encyclopedia.sideTabs')

  return (
    <aside className='flex w-16 h-fit flex-col border-r border-neutral-800/50 bg-neutral-900/20'>
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={cn(
            'group relative flex flex-1 min-h-35 items-center justify-center transition-all cursor-pointer border-b border-neutral-800/30 last:border-b-0',
            activeSection === section.id
              ? 'text-amber-500 bg-amber-500/5'
              : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/20'
          )}
        >
          <div className='flex -rotate-90 items-center gap-3 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em]'>
            <section.icon className='h-4 w-4 rotate-90 mb-1' />
            {t(section.id)}
          </div>
          {activeSection === section.id && (
            <m.div
              layoutId='activeTab'
              className='absolute right-0 top-0 h-full w-0.5 bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]'
            />
          )}
        </button>
      ))}
    </aside>
  )
}
