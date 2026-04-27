'use client'

import { useMemo, useState } from 'react'
import { MAX_INDEX, getCircularCarousel, type PortalCarouselItem } from './carousel-utils'

export interface CarouselOptions {
  visibleRange?: number
}

/**
 * Lógica de carrusel circular infinito con navegación por índice acumulativo.
 *
 * Gestiona un "ventana deslizante" de `visibleRange` posiciones a cada lado
 * del ítem activo, calculada por `getCircularCarousel`. El índice interno
 * crece sin límite (±MAX_INDEX) para conservar la dirección de las animaciones
 * de Framer Motion; el indicador de dots se deriva como `index mod N`.
 *
 * @param items  Array de datos a mostrar en el carrusel.
 * @param options `visibleRange` — posiciones renderizadas a cada lado (la última es invisible).
 */
export const useCarousel = <T>(items: T[], options?: CarouselOptions) => {
  const [activeIndex, setActiveIndex] = useState(0)

  // Lógica inteligente: Si hay pocos items, reduce el rango visible para evitar duplicados excesivos
  // Si items > 3 -> rango 3 (total 7 items visibles+ocultos)
  // Si items <= 3 -> rango 2 (total 5 items visibles+ocultos)
  const defaultRange = items.length > 3 ? 3 : 2
  const visibleRange = options?.visibleRange ?? defaultRange

  const visibleItems: PortalCarouselItem<T>[] = useMemo(() => {
    return getCircularCarousel(items, activeIndex, visibleRange)
  }, [items, activeIndex, visibleRange])

  const handleNext = () => setActiveIndex((prev) => prev + 1)
  const handlePrev = () => setActiveIndex((prev) => prev - 1)

  // Derivamos el índice real (0..N-1) para los dots
  const currentIndicator = ((activeIndex % items.length) + items.length) % items.length

  const handleDotClick = (targetIndex: number) => {
    const total = items.length
    const diff = targetIndex - currentIndicator

    // Camino más corto en el círculo
    let adjustedDiff = diff
    if (diff > total / 2) adjustedDiff -= total
    if (diff < -total / 2) adjustedDiff += total

    setActiveIndex((prev) => prev + adjustedDiff)
  }

  return {
    activeIndex,
    visibleItems,
    handleNext,
    handlePrev,
    handleDotClick,
    currentIndicator,
    canGoNext: activeIndex < MAX_INDEX,
    canGoPrev: activeIndex > -MAX_INDEX,
  }
}
