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
}

export const EncyclopediaImage = ({ item, section }: EncyclopediaImageProps) => {
  const [src, setSrc] = useState(() => getEntityImage(item.imageUrl, section))

  return (
    <div className='relative group w-full max-w-sm'>
      <div className='absolute -inset-4 bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all rounded-full' />
      <div className='relative h-[50vh] w-full'>
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
      </div>
    </div>
  )
}
