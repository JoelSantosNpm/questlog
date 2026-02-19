// Hook personalizado para la lógica del carrusel
"use client";

import { useMemo, useState } from "react";
import { MAX_INDEX, getCircularCarousel } from "../../lib/carousel-utils";
import { Campaign } from "@/types/portal";

export const usePortalCarousel = (campaigns: Campaign[], visibleRange = 3) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleItems = useMemo(() => {
    return getCircularCarousel(campaigns, activeIndex, visibleRange);
  }, [campaigns, activeIndex, visibleRange]);

  const handleNext = () => setActiveIndex(prev => prev + 1);
  const handlePrev = () => setActiveIndex(prev => prev - 1);

  // Derivamos el índice real (0..N-1) para mostrar los puntos indicadores
  const currentIndicator =
    ((activeIndex % campaigns.length) + campaigns.length) % campaigns.length;

  const handleDotClick = (targetIndex: number) => {
    const total = campaigns.length;
    // Calculamos la diferencia entre el punto destino y el punto actual
    const diff = targetIndex - currentIndicator;

    // Lógica para encontrar el camino más corto en el círculo
    let adjustedDiff = diff;
    if (diff > total / 2) adjustedDiff -= total;
    if (diff < -total / 2) adjustedDiff += total;

    setActiveIndex(prev => prev + adjustedDiff);
  };

  return {
    activeIndex,
    visibleItems,
    handleNext,
    handlePrev,
    handleDotClick,
    currentIndicator,
    canGoNext: activeIndex < MAX_INDEX,
    canGoPrev: activeIndex > -MAX_INDEX,
  };
};
