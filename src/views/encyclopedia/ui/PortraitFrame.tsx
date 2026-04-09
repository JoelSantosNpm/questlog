'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FrameColors {
  /** Gradiente CSS para los anillos exterior e interior */
  ring: string
  /** Color de fondo del halo difuminado (clase Tailwind o CSS) */
  halo: string
  /** Colores del patrón cónico de la sanefa (claro y oscuro) */
  fretwork: [string, string]
}

interface PortraitFrameProps {
  src: string
  alt: string
  size?: number
  colors?: FrameColors
  onError?: () => void
}

const DEFAULT_COLORS: FrameColors = {
  ring: 'linear-gradient(135deg, #7f1d1d, #450a0a, #991b1b, #450a0a, #7f1d1d)',
  halo: 'rgba(69,10,10,0.4)',
  fretwork: ['#1c0606', '#2d0a0a'],
}

export const PortraitFrame = ({
  src,
  alt,
  size = 112,
  colors = DEFAULT_COLORS,
  onError,
}: PortraitFrameProps) => {
  const [imgSrc, setImgSrc] = useState(src)
  const { ring, halo, fretwork } = colors

  const handleError = () => {
    onError?.()
    setImgSrc(src)
  }

  return (
    <div className='relative'>
      {/* Halo exterior difuminado */}
      <div className='absolute inset-0 rounded-full blur-md' style={{ background: halo }} />
      {/* Anillo exterior */}
      <div className='relative rounded-full p-0.75' style={{ background: ring }}>
        {/* Sanefa */}
        <div
          className='rounded-full p-0.75'
          style={{
            background: `repeating-conic-gradient(${fretwork[0]} 0deg 10deg, ${fretwork[1]} 10deg 20deg)`,
          }}
        >
          {/* Anillo interior */}
          <div className='rounded-full p-0.5' style={{ background: ring }}>
            {/* Imagen */}
            <div
              className='relative overflow-hidden rounded-full'
              style={{ width: size, height: size }}
            >
              <Image
                src={imgSrc}
                alt={alt}
                fill
                sizes={`${size}px`}
                unoptimized={imgSrc.includes('/defaults/')}
                onError={handleError}
                className='object-cover'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
