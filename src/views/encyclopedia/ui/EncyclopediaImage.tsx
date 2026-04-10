'use client'

import { useState } from 'react'
import Image from 'next/image'
import { type EncyclopediaSection } from '../model/encyclopediaStore'
import { EncyclopediaItem } from '../model/types'
import { cn } from '@/shared/utils/styles'
import { getEntityImage } from '@/shared/lib/storage'

interface EncyclopediaImageProps {
  item: EncyclopediaItem
  section: EncyclopediaSection
  noBackground?: boolean
  /**
   * Cuando se pasa, posiciona la imagen absolute dentro del contenedor.
   * top: distancia desde el top del contenedor (ej: '15%')
   * height: altura de la imagen como % del contenedor (ej: '60%')
   * Ambos % son relativos al contenedor, que con object-cover object-top
   * mapea 1:1 con los % de la imagen de fondo.
   */
  overlay?: { top: string; height: string }
}

export const EncyclopediaImage = ({
  item,
  section,
  noBackground = false,
  overlay,
}: EncyclopediaImageProps) => {
  const [src, setSrc] = useState(() => getEntityImage(item.imageUrl, section))

  return (
    <div
      className='relative group w-full max-w-sm'
      style={
        overlay
          ? {
              position: 'absolute',
              top: overlay.top,
              height: overlay.height,
              left: '50%',
              transform: 'translateX(-50%)',
            }
          : undefined
      }
    >
      <div className='absolute -inset-4 bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all rounded-full' />
      <div className='relative h-full w-full'>
        {noBackground ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={item.name}
            loading='eager'
            fetchPriority='high'
            decoding='async'
            onError={() => setSrc(getEntityImage(null, section))}
            className='absolute inset-0 h-full w-full object-contain transition-all duration-500 group-hover:scale-[1.02]'
          />
        ) : (
          <Image
            src={src}
            alt={item.name}
            fill
            priority
            sizes='(max-width: 768px) 100vw, 400px'
            unoptimized={src.includes('/defaults/')}
            onError={() => setSrc(getEntityImage(null, section))}
            className={cn(
              'rounded-2xl border border-neutral-800 object-contain shadow-2xl transition-all duration-500 group-hover:scale-[1.02]'
            )}
          />
        )}
      </div>
    </div>
  )
}
