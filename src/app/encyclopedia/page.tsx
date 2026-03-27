'use client'

import React from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useEncyclopediaStore, EncyclopediaSection } from '@/components/encyclopedia/encyclopediaStore'
import { cn } from '@/shared/utils/styles'
import { Skull, Users, Landmark, Search, Info, LucideIcon } from 'lucide-react'

interface BaseItem {
  id: string
  name: string
  description: string
  image: string
  stats?: string
  role?: string
  origin?: string
}

interface BestiaryItem extends BaseItem {
  stats: string
}

interface DramatisPersonaeItem extends BaseItem {
  role: string
}

interface MuseumItem extends BaseItem {
  origin: string
}

type EncyclopediaItem = BestiaryItem | DramatisPersonaeItem | MuseumItem

const MOCK_DATA: Record<EncyclopediaSection, EncyclopediaItem[]> = {
  bestiary: [
    {
      id: '1',
      name: 'Dragón Negro',
      description: 'Un dragón cruel que habita en pantanos fétidos.',
      stats: 'Fuerza 23, CA 19',
      image: '/portal.png',
    },
    {
      id: '2',
      name: 'Beholder',
      description: 'Un horror flotante con múltiples ojos mágicos.',
      stats: 'Fuerza 10, CA 18',
      image: '/portal_natura_oscuro.png',
    },
  ],
  'dramatis-personae': [
    {
      id: '3',
      name: 'Elara Moonwhisper',
      role: 'Archimaga de la Torre de Marfil',
      description: 'Una elfa sabia con siglos de conocimiento.',
      image: '/portal_a_natural.png',
    },
  ],
  museum: [
    {
      id: '4',
      name: 'Cáliz de Almas',
      origin: 'Antiguo Imperio de Nerath',
      description: 'Un artefacto oscuro que consume la esencia vital.',
      image: '/portal.png',
    },
  ],
}

interface SectionConfig {
  id: EncyclopediaSection
  label: string
  icon: LucideIcon
}

export default function EncyclopediaPage() {
  const { activeSection, selectedItemId, setActiveSection, setSelectedItemId } =
    useEncyclopediaStore()

  const currentItems = MOCK_DATA[activeSection]
  const selectedItem =
    currentItems.find((item) => item.id === selectedItemId) || currentItems[0]

  const sections: SectionConfig[] = [
    { id: 'bestiary', label: 'Bestiario', icon: Skull },
    { id: 'dramatis-personae', label: 'Personajes', icon: Users },
    { id: 'museum', label: 'Museo', icon: Landmark },
  ]

  return (
    <div className='flex h-[calc(100vh-64px)] w-full overflow-hidden bg-neutral-950 font-sans'>
      {/* 1. Side Tabs (Rotated 90º) */}
      <aside className='flex w-16 flex-col items-center border-r border-neutral-800/50 bg-neutral-900/20 py-8 gap-12'>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={cn(
              'group relative flex items-center justify-center transition-all cursor-pointer',
              activeSection === section.id
                ? 'text-amber-500'
                : 'text-neutral-500 hover:text-neutral-300'
            )}
          >
            <div className='flex rotate-[-90deg] items-center gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-widest'>
              <section.icon className='h-4 w-4 rotate-[90deg]' />
              {section.label}
            </div>
            {activeSection === section.id && (
              <m.div
                layoutId='activeTab'
                className='absolute -right-[33px] h-12 w-1 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
              />
            )}
          </button>
        ))}
      </aside>

      {/* 2. List View (Filtered) */}
      <section className='flex w-80 flex-col border-r border-neutral-800/50 bg-neutral-950/40 backdrop-blur-sm'>
        <div className='p-4 border-b border-neutral-800/50'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500' />
            <input
              type='text'
              placeholder='Buscar...'
              className='w-full rounded-md border border-neutral-800 bg-neutral-900/50 py-2 pl-10 pr-4 text-sm focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50'
            />
          </div>
        </div>
        <div className='flex-1 overflow-y-auto p-2'>
          <div className='space-y-1'>
            {currentItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={cn(
                  'w-full rounded-lg px-4 py-3 text-left transition-all duration-200 cursor-pointer',
                  selectedItemId === item.id ||
                    (!selectedItemId && item.id === currentItems[0].id)
                    ? 'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20'
                    : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                )}
              >
                <p className='text-sm font-semibold'>{item.name}</p>
                <p className='mt-0.5 truncate text-xs opacity-60'>
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Detail View */}
      <main className='relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-900/20 via-transparent to-transparent'>
        <AnimatePresence mode='wait'>
          <m.div
            key={selectedItem?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className='flex h-full flex-col lg:flex-row'
          >
            {/* Image Section */}
            <div className='flex flex-1 items-center justify-center p-8 lg:p-12'>
              <div className='relative group'>
                <div className='absolute -inset-4 bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all rounded-full' />
                <img
                  src={selectedItem?.image}
                  alt={selectedItem?.name}
                  className='relative max-h-[60vh] rounded-2xl border border-neutral-800 object-contain shadow-2xl'
                />
              </div>
            </div>

            {/* Info Section */}
            <div className='w-full max-w-md border-l border-neutral-800/50 bg-neutral-900/30 p-8 backdrop-blur-md lg:p-12'>
              <header className='mb-8'>
                <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500/60'>
                  <Info className='h-3 w-3' />
                  {activeSection.replace('-', ' ')}
                </div>
                <h2 className='font-medieval mt-2 text-4xl text-neutral-100'>
                  {selectedItem?.name}
                </h2>
              </header>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                    Descripción
                  </h3>
                  <p className='mt-2 leading-relaxed text-neutral-300'>
                    {selectedItem?.description}
                  </p>
                </div>

                {selectedItem?.stats && (
                  <div>
                    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                      Estadísticas
                    </h3>
                    <p className='mt-2 font-mono text-sm text-amber-200/80'>
                      {selectedItem.stats}
                    </p>
                  </div>
                )}

                {selectedItem?.role && (
                  <div>
                    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                      Rol
                    </h3>
                    <p className='mt-2 text-neutral-300'>
                      {selectedItem.role}
                    </p>
                  </div>
                )}

                {selectedItem?.origin && (
                  <div>
                    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                      Origen
                    </h3>
                    <p className='mt-2 text-neutral-300'>
                      {selectedItem.origin}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </m.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
