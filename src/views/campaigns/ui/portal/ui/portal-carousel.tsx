// Layout del carrusel de portales
'use client'

import { Campaign } from '@/shared/api/campaign'
import { useMediaQuery } from '@/shared/lib/hooks/use-media-query'
import { AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useCarousel } from '../lib/use-carousel'
import { PortalCard } from './portal-card'

interface PortalCarouselProps {
  campaigns: Campaign[]
}

export const PortalCarousel = ({ campaigns }: PortalCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive logic for carousel items - now using useSyncExternalStore
  const isMobile = useMediaQuery('(max-width: 600px)')
  const isTablet = useMediaQuery('(max-width: 1000px)')
  const isLaptop = useMediaQuery('(max-width: 1750px)')

  const getVisibleRange = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    if (isLaptop) return 3
    return 4
  }

  const {
    visibleItems,
    handleNext,
    handlePrev,
    handleDotClick,
    currentIndicator,
    canGoNext,
    canGoPrev,
  } = useCarousel(campaigns, { visibleRange: getVisibleRange() })

  // Focus inicial para permitir navegación por teclado inmediata
  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  // Manejador de teclado para accesibilidad
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && canGoPrev) {
      e.preventDefault()
      handlePrev()
    } else if (e.key === 'ArrowRight' && canGoNext) {
      e.preventDefault()
      handleNext()
    }
  }

  return (
    <section
      ref={containerRef}
      className='relative flex w-full flex-1 flex-col items-center justify-center gap-4 overflow-hidden py-4 outline-none sm:gap-8 sm:py-6'
      style={{ isolation: 'isolate' }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label='Selector de Campañas'
      role='region'
      aria-roledescription='carousel'
    >
      {/* Background */}
      <Image
        src='/suelo.png'
        alt=''
        fill
        priority
        sizes='100vw'
        className='-z-10 object-cover object-center'
        aria-hidden
      />
      {/* Overlay para oscurecer el fondo */}
      <div className='pointer-events-none absolute inset-0 -z-5 bg-black/70' aria-hidden />

      {/* 3D Scene Container - Responsive height */}
      <div
        className='relative flex w-full min-h-[300px] h-[50vh] max-h-[600px] items-center justify-center'
        style={{ perspective: '1000px' }}
        role='list'
      >
        <AnimatePresence>
          {visibleItems.map((item) => (
            <PortalCard
              key={item.key}
              position={item.position}
              campaign={item.item} // .item tras refactorización genérica
              visibleRange={Math.floor((visibleItems.length - 1) / 2)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className='flex flex-col items-center gap-6'>
        {/* Buttons */}
        <div className='flex gap-8'>
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className='group rounded-full border border-stone-700 bg-stone-900/80 p-4 text-amber-500 backdrop-blur-sm transition-all hover:bg-amber-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-stone-900/80 disabled:hover:text-amber-500'
            aria-label='Previous campaign'
          >
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className='group rounded-full border border-stone-700 bg-stone-900/80 p-4 text-amber-500 backdrop-blur-sm transition-all hover:bg-amber-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-stone-900/80 disabled:hover:text-amber-500'
            aria-label='Next campaign'
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Indicator Dots */}
        <div className='flex items-center gap-3'>
          {campaigns.map((campaign, i) => (
            <button
              key={campaign.id}
              onClick={() => handleDotClick(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndicator ? 'w-8 bg-amber-500' : 'w-2 bg-stone-700 hover:bg-stone-600'
              }`}
              aria-label={`Go to campaign ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
