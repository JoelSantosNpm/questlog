// Layout del carrusel de portales
"use client";

import { PortalCard } from "./portal-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { usePortalCarousel } from "../../../hooks/portal/use-portal-carousel";
import { campaigns } from "../../data/mock-campaigns";
import { PortalCarouselItem } from "@/types/portal";

export const PortalCarousel = () => {
  const {
    visibleItems,
    handleNext,
    handlePrev,
    handleDotClick,
    currentIndicator,
    canGoNext,
    canGoPrev,
  } = usePortalCarousel(campaigns, campaigns.length > 3 ? 3 : 2);

  console.log("visibleItems: ", visibleItems);
  console.log("visibleRange: ", Math.floor((visibleItems.length - 1) / 2));

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-stone-950">
      {/* 3D Scene Container */}
      <div
        className="relative flex h-[600px] w-full items-center justify-center"
        style={{ perspective: "1000px" }}>
        <AnimatePresence>
          {visibleItems.map((item: PortalCarouselItem) => (
            <PortalCard
              key={item.key} // Usamos la key compuesta para permitir duplicados virtuales
              position={item.position}
              campaign={item.campaign}
              visibleRange={Math.floor((visibleItems.length - 1) / 2)} // Pasamos el rango visible para controlar la opacidad
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
            disabled={!canGoPrev}
            className="group rounded-full border border-stone-700 bg-stone-900/80 p-4 text-amber-500 backdrop-blur-sm transition-all hover:bg-amber-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-stone-900/80 disabled:hover:text-amber-500"
            aria-label="Previous campaign">
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext}
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
