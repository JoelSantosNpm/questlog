'use client'
import { Campaign } from '@/shared/api/campaign'
import { m } from 'framer-motion'
import { Portal } from './Portal'

interface PortalCardProps {
  position: number
  visibleRange?: number
  campaign: Campaign
}

export const PortalCard = ({ position, visibleRange = 3, campaign }: PortalCardProps) => {
  const isActive = position === 0

  // Calculamos la opacidad basada en la posición
  const opacity = Math.abs(position) >= visibleRange ? 0 : 1

  const factorX = 320
  const factorY = 15
  const offsetY = -70
  // (2 = cuadrática, 1 = lineal)
  const exponent = 2
  const absPos = Math.abs(position)

  // magnitud exponencial
  const expMagnitude = Math.pow(absPos, exponent)

  return (
    <m.div
      initial={false}
      animate={{
        // Trayectoria en X: El signo de 'position' mantiene la dirección (izq/der)
        x: position * factorX,
        y: expMagnitude * factorY + offsetY,
        scale: isActive ? 1.1 : 1,
        rotateY: position * -30,
        rotateZ: position * 5,
        z: expMagnitude * 5,
        opacity,
      }}
      transition={{
        type: 'spring',
        stiffness: 70,
        damping: 20,
      }}
      style={{
        // El zIndex sigue siendo lineal para evitar parpadeos extraños
        zIndex: isActive ? 50 : Math.floor(50 - absPos),
        transformStyle: 'preserve-3d',
      }}
      className='absolute flex cursor-pointer items-center justify-center'
    >
      {campaign.variant === 'new' ? (
        <Portal
          variant='new'
          size='lg'
          isBright={isActive}
          priority={isActive}
          href='/campaigns/creation'
        />
      ) : (
        <Portal
          variant='existing'
          size='lg'
          campaignName={campaign.name}
          isBright={isActive}
          priority={isActive}
          href={`/campaigns/${campaign.id}`}
        />
      )}
    </m.div>
  )
}
