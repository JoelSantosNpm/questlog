"use client";

import { useMemo, useState } from "react";
import { PortalCard } from "./portal-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface Campaign {
  id: number;
  name: string;
  variant: "existing" | "new";
}

const campaigns: Campaign[] = [
  { id: 1, name: "The Forgotten Caves", variant: "existing" },
  { id: 2, name: "Eldarin Kingdom", variant: "existing" },
  // { id: 3, name: "Volcano Peak", variant: "existing" },
  // { id: 4, name: "The Exit", variant: "existing" },
  // { id: 5, name: "Scape Room", variant: "existing" },
  // { id: 6, name: "The Golden Country", variant: "existing" },
  // { id: 7, name: "Unknown Path", variant: "existing" },
  // { id: 8, name: "Misty Forest", variant: "existing" },
  // { id: 9, name: "Monk's Journey", variant: "existing" },
  // { id: 10, name: "New Campaign", variant: "new" },
];

type PortalCarouselItem = {
  key: string;
  campaign: Campaign;
  position: number;
};

const MAX_INDEX = Number.MAX_SAFE_INTEGER - 100; // Margen de seguridad para evitar overflow

const getCircularCarousel = (
  allCampaigns: Campaign[],
  activeIndex: number,
  visibleRange = 3,
): PortalCarouselItem[] => {
  const total = allCampaigns.length;

  if (total === 0) return [];

  const itemsToRender = visibleRange;
  const visibleItems: PortalCarouselItem[] = [];

  for (let i = -itemsToRender; i <= itemsToRender; i++) {
    // Usamos el índice "absoluto" infinito como key estable
    const absoluteIndex = activeIndex + i;

    // Aritmética modular para obtener el índice real del array de datos
    const dataIndex = ((absoluteIndex % total) + total) % total;

    visibleItems.push({
      key: `carousel-item-${absoluteIndex}`,
      campaign: allCampaigns[dataIndex],
      position: i,
    });
  }

  return visibleItems;
};

export const PortalCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleItems = useMemo(() => {
    return getCircularCarousel(campaigns, activeIndex, 3);
  }, [activeIndex]);

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

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-stone-950">
      {/* 3D Scene Container */}
      <div
        className="relative flex h-[600px] w-full items-center justify-center"
        style={{ perspective: "1000px" }}>
        <AnimatePresence>
          {visibleItems.map(item => (
            <PortalCard
              key={item.key} // Usamos la key compuesta para permitir duplicados virtuales
              position={item.position}
              campaign={item.campaign}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 z-50 flex flex-col items-center gap-6">
        {/* Buttons */}
        <div className="flex gap-8">
          <button
            onClick={handlePrev}
            disabled={activeIndex <= -MAX_INDEX}
            className="group rounded-full border border-stone-700 bg-stone-900/80 p-4 text-amber-500 backdrop-blur-sm transition-all hover:bg-amber-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-stone-900/80 disabled:hover:text-amber-500"
            aria-label="Previous campaign">
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={handleNext}
            disabled={activeIndex >= MAX_INDEX}
            className="group rounded-full border border-stone-700 bg-stone-900/80 p-4 text-amber-500 backdrop-blur-sm transition-all hover:bg-amber-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-stone-900/80 disabled:hover:text-amber-500"
            aria-label="Next campaign">
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="flex items-center gap-3">
          {campaigns.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndicator
                  ? "w-8 bg-amber-500"
                  : "w-2 bg-stone-700 hover:bg-stone-600"
              }`}
              aria-label={`Go to campaign ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Optional: Background Ambience */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black opacity-80" />
    </div>
  );
};
