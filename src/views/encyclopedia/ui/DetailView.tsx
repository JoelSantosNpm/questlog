'use client'

import React, { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Info, Shield, Heart, Activity } from 'lucide-react'
import { type EncyclopediaSection } from '../model/encyclopediaStore'
import { EncyclopediaItem } from '../model/encyclopedia'
import Image from 'next/image'
import { cn } from '@/shared/utils/styles'
import { getEntityImage } from '@/shared/lib/storage'

interface DetailViewProps {
  item?: EncyclopediaItem
  activeSection: EncyclopediaSection
}

const EncyclopediaImage: React.FC<{ item: EncyclopediaItem; section: EncyclopediaSection }> = ({
  item,
  section,
}) => {
  const [src, setSrc] = useState(() => getEntityImage(item.imageUrl, section))

  return (
    <div className='relative group w-full max-w-sm'>
      <div className='absolute -inset-4 bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all rounded-full' />
      <div className='relative h-[50vh] w-full'>
        <Image
          src={src}
          alt={item.name}
          fill
          sizes='(max-width: 768px) 100vw, 400px'
          unoptimized={src.includes('/defaults/')}
          onError={() => setSrc(getEntityImage(null, section))}
          className={cn(
            'rounded-2xl border border-neutral-800 object-contain shadow-2xl transition-all duration-500 group-hover:scale-[1.02]'
          )}
        />
      </div>
    </div>
  )
}

const StatBox: React.FC<{ label: string; value: number | string; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
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
            {/* Image Column */}
            <div className='flex flex-1 items-center justify-center p-8 lg:p-12'>
              <EncyclopediaImage key={item.id} item={item} section={activeSection} />
            </div>

            {/* Info Column */}
            <div className='w-full max-w-lg border-l border-neutral-800/50 bg-neutral-900/30 p-8 backdrop-blur-md lg:p-12'>
              <header className='mb-8'>
                <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500/60'>
                  <Info className='h-3 w-3' />
                  {activeSection.replace('-', ' ')}
                  {'rarity' in item && <span>• {item.rarity}</span>}
                </div>
                <h2 className='font-medieval mt-2 text-4xl text-neutral-100'>{item.name}</h2>
              </header>

              <div className='space-y-8'>
                <div>
                  <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                    Descripción
                  </h3>
                  <p className='mt-3 leading-relaxed text-neutral-300'>{'Sin descripción.'}</p>
                </div>

                {/* Stats for Monsters & Characters (checked by common properties in Prisma models) */}
                {'strength' in item && !('rarity' in item) && (
                  <div className='space-y-4'>
                    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                      Atributos
                    </h3>
                    <div className='grid grid-cols-3 gap-3'>
                      <StatBox label='AC' value={item.ac} icon={<Shield className='h-3 w-3' />} />
                      <StatBox
                        label='HP'
                        value={'maxHp' in item ? item.maxHp : 'Instancia'}
                        icon={<Heart className='h-3 w-3' />}
                      />
                      <StatBox
                        label='Speed'
                        value={`${item.speed}ft`}
                        icon={<Activity className='h-3 w-3' />}
                      />
                    </div>
                    <div className='grid grid-cols-6 gap-2'>
                      <StatBox label='STR' value={item.strength} />
                      <StatBox label='DEX' value={item.dexterity} />
                      <StatBox label='CON' value={item.constitution} />
                      <StatBox label='INT' value={item.intelligence} />
                      <StatBox label='WIS' value={item.wisdom} />
                      <StatBox label='CHA' value={item.charisma} />
                    </div>
                  </div>
                )}

                {/* Specifics for Items */}
                {'rarity' in item && (
                  <div className='space-y-4'>
                    <h3 className='text-xs font-bold uppercase tracking-widest text-neutral-500'>
                      Propiedades
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='rounded-lg border border-neutral-800 bg-neutral-900/50 p-4'>
                        <span className='text-[10px] font-bold uppercase text-neutral-500'>
                          Categoría
                        </span>
                        <p className='mt-1 font-medium text-neutral-200'>{item.category}</p>
                      </div>
                      <div className='rounded-lg border border-neutral-800 bg-neutral-900/50 p-4'>
                        <span className='text-[10px] font-bold uppercase text-neutral-500'>
                          Valor
                        </span>
                        <p className='mt-1 font-mono text-amber-500'>{item.value} po</p>
                      </div>
                    </div>
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
