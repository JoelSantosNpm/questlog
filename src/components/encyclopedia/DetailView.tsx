'use client'

import React, { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'
import { useEncyclopediaStore, type EncyclopediaSection } from './encyclopediaStore'
import { EncyclopediaItem } from './types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const DEFAULTS_BUCKET_URL = `${SUPABASE_URL}/storage/v1/object/public/defaults`

const PLACEHOLDERS: Record<EncyclopediaSection, string> = {
  bestiary: `${DEFAULTS_BUCKET_URL}/monster-placeholder.png`,
  'dramatis-personae': `${DEFAULTS_BUCKET_URL}/npc-placeholder.png`,
  museum: `${DEFAULTS_BUCKET_URL}/item-placeholder.png`,
}

interface DetailViewProps {
  item?: EncyclopediaItem
  activeSection: EncyclopediaSection
}

const EncyclopediaImage: React.FC<{ item: EncyclopediaItem; section: EncyclopediaSection }> = ({
  item,
  section,
}) => {
  const [hasError, setHasError] = useState(false)
  const isUrlEmpty = !item.image || item.image.trim() === ''
  const finalSrc = isUrlEmpty || hasError ? PLACEHOLDERS[section] : item.image!

  return (
    <div className='relative group'>
      <div className='absolute -inset-4 bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all rounded-full' />
      <img
        src={finalSrc}
        alt={item.name}
        onError={() => setHasError(true)}
        className='relative max-h-[60vh] rounded-2xl border border-neutral-800 object-contain shadow-2xl transition-all duration-500 group-hover:scale-[1.02]'
      />
    </div>
  )
}

export const DetailView: React.FC<DetailViewProps> = ({ item, activeSection }) => {
  return (
    <main className='relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-neutral-900/20 via-transparent to-transparent'>
      <AnimatePresence mode='wait'>
        {item ? (
          <m.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className='flex h-full flex-col lg:flex-row'
          >
            <div className='flex flex-1 items-center justify-center p-8 lg:p-12'>
              <EncyclopediaImage key={item.id} item={item} section={activeSection} />
            </div>

            <div className='w-full max-w-md border-l border-neutral-800/50 bg-neutral-900/30 p-8 backdrop-blur-md lg:p-12'>
              <header className='mb-8'>
                <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500/60'>
                  <Info className='h-3 w-3' />
                  {activeSection.replace('-', ' ')}
                </div>
                <h2 className='font-medieval mt-2 text-4xl text-neutral-100'>{item.name}</h2>
              </header>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                    Descripción
                  </h3>
                  <p className='mt-2 leading-relaxed text-neutral-300'>{item.description}</p>
                </div>

                {item.type === 'bestiary' && (
                  <div>
                    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                      Estadísticas
                    </h3>
                    <p className='mt-2 font-mono text-sm text-amber-200/80'>{item.stats}</p>
                  </div>
                )}

                {item.type === 'dramatis-personae' && (
                  <div>
                    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                      Rol
                    </h3>
                    <p className='mt-2 text-neutral-300'>{item.role}</p>
                  </div>
                )}

                {item.type === 'museum' && (
                  <div>
                    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                      Origen
                    </h3>
                    <p className='mt-2 text-neutral-300'>{item.origin}</p>
                  </div>
                )}
              </div>
            </div>
          </m.div>
        ) : (
          <div className='flex h-full items-center justify-center text-neutral-500 font-medium'>
            Selecciona un elemento para ver sus detalles.
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
