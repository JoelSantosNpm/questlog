export const MAX_INDEX = Number.MAX_SAFE_INTEGER - 100 // Margen de seguridad para evitar overflow

export type PortalCarouselItem<T> = {
  key: string
  item: T
  position: number
}

/**
 * Genera un array circular de elementos para un carrusel infinito.
 * @param allItems Array original de datos (genérico)
 * @param activeIndex Índice central actual (puede ser negativo o muy grande)
 * @param visibleRange Cuántos elementos mostrar a cada lado del centro
 * @returns Array de PortalCarouselItem<T>
 */
export const getCircularCarousel = <T>(
  allItems: T[],
  activeIndex: number,
  visibleRange = 3
): PortalCarouselItem<T>[] => {
  const total = allItems.length

  if (total === 0) return []

  const visibleItems: PortalCarouselItem<T>[] = []

  for (let i = -visibleRange; i <= visibleRange; i++) {
    // Usamos el índice "absoluto" infinito como key estable
    const absoluteIndex = activeIndex + i

    // Aritmética modular para obtener el índice real del array de datos
    const dataIndex = ((absoluteIndex % total) + total) % total

    visibleItems.push({
      key: `carousel-item-${absoluteIndex}`,
      item: allItems[dataIndex],
      position: i,
    })
  }

  return visibleItems
}
