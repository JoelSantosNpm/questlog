'use client'

import Image from 'next/image'

interface FrameColors {
  /** Gradiente CSS para los anillos exterior e interior */
  ring: string
  /** Color de fondo del halo difuminado (clase Tailwind o CSS) */
  halo: string
  /** Colores del patrón cónico de la sanefa (claro y oscuro) */
  fretwork: [string, string]
}

type PortraitVariant = 'monster' | 'cast' | 'custom'

interface PortraitFrameProps {
  src: string
  alt: string
  size?: number
  variant?: PortraitVariant
  colors?: FrameColors
  /** Posición focal de la imagen dentro del círculo. Por defecto 'top' para retratos. */
  objectPosition?: string
  onError?: () => void
}

const VARIANT_COLORS: Record<Exclude<PortraitVariant, 'custom'>, FrameColors> = {
  monster: {
    ring: 'linear-gradient(135deg, #7f1d1d, #450a0a, #991b1b, #450a0a, #7f1d1d)',
    halo: 'rgba(69,10,10,0.4)',
    fretwork: ['#1c0606', '#2d0a0a'],
  },
  cast: {
    ring: 'linear-gradient(135deg, #1e3a5f, #0c1d3a, #1d4ed8, #0c1d3a, #1e3a5f)',
    halo: 'rgba(12,29,58,0.4)',
    fretwork: ['#060c1c', '#0a1530'],
  },
}

export const PortraitFrame = ({
  src,
  alt,
  size = 112,
  variant = 'monster',
  colors,
  objectPosition = 'top',
  onError,
}: PortraitFrameProps) => {
  const { ring, halo, fretwork } =
    colors ?? VARIANT_COLORS[variant === 'custom' ? 'monster' : variant]

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
                src={src}
                alt={alt}
                fill
                sizes={`${size}px`}
                unoptimized={src.includes('/defaults/')}
                onError={onError}
                className='object-cover'
                style={{ objectPosition }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
