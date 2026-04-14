'use client'

import { memo, useMemo, useState } from 'react'
import Image from 'next/image'
import { type EncyclopediaSection } from '../model/encyclopediaStore'
import { EncyclopediaItem } from '../model/types'
import { cn } from '@/shared/utils/styles'
import { getEntityFallbacks } from '@/views/encyclopedia/lib/storage'

interface EncyclopediaImageProps {
  item: EncyclopediaItem
  section: EncyclopediaSection
  noBackground?: boolean
  /**
   * Posiciona la imagen absolute dentro del contenedor relativo al fondo.
   * bottomFromTop: distancia del top del fondo al BORDE INFERIOR de la imagen (ej: '73%')
   * height: tamaño de la imagen como % del contenedor — fijo para que
   *   siempre ocupe la misma proporción del fondo independientemente del zoom.
   */
  overlay?: { bottomFromTop: string; height: string }
}

export const EncyclopediaImage = memo(function EncyclopediaImage({
  item,
  section,
  noBackground = false,
  overlay,
}: EncyclopediaImageProps) {
  const portraitImageUrl =
    'portraitImageUrl' in item ? (item.portraitImageUrl as string | null) : null

  const fallbacks = useMemo(
    () => getEntityFallbacks(section, item.imageUrl, portraitImageUrl),
    [section, item.imageUrl, portraitImageUrl]
  )

  const [fallbackIndex, setFallbackIndex] = useState(0)
  const src = fallbacks[fallbackIndex]

  const handleError = () => {
    setFallbackIndex((i) => (i + 1 < fallbacks.length ? i + 1 : i))
  }

  return (
    <div
      className='relative group w-full max-w-sm'
      style={
        overlay
          ? {
              position: 'absolute',
              top: `calc(${overlay.bottomFromTop} - ${overlay.height})`,
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
            onError={handleError}
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
            onError={handleError}
            className={cn(
              'rounded-2xl border border-neutral-800 object-contain shadow-2xl transition-all duration-500 group-hover:scale-[1.02]'
            )}
          />
        )}
      </div>
    </div>
  )
})
