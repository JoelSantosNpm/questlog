'use client'
import { motion } from 'framer-motion'
import { Portal } from './Portal'
import { Campaign } from '@/types/portal'

interface PortalCardProps {
  position: number
  visibleRange?: number
  campaign: Campaign
}

export const PortalCard = ({ position, visibleRange = 3, campaign }: PortalCardProps) => {
  const isActive = position === 0

  // Calculamos la opacidad basada en la posición
  const opacity = Math.abs(position) >= visibleRange ? 0 : 1

  return (
    <motion.div
      initial={false}
      animate={{
        x: position * 380, // Reduced spacing for tighter cluster
        y: Math.abs(position) * 50, // Arch effect: side cards move up
        scale: isActive ? 1.15 : 0.85,
        rotateY: position * -30, // Inward rotation -25
        z: Math.abs(position) * -100, // Depth pushback -100
        opacity,
      }}
      transition={{
        type: 'spring',
        stiffness: 70,
        damping: 20,
      }}
      style={{
        zIndex: isActive ? 50 : 50 - Math.abs(position),
        transformStyle: 'preserve-3d',
      }}
      className='absolute flex h-125 cursor-pointer items-center justify-center perspective-origin-center'
    >
      {campaign.variant === 'new' ? (
        <Portal
          variant='new'
          size='lg'
          isBright={isActive}
          priority={isActive}
          href='/campaigns/new'
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
    </motion.div>
  )
}
