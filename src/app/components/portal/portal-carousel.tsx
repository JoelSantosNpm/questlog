// Layout del carrusel de portales
"use client";

import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCarousel } from "../../../hooks/ui/use-carousel";
import { campaigns } from "../../data/mock-campaigns";
import { PortalCard } from "./portal-card";

export const PortalCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    visibleItems,
    handleNext,
    handlePrev,
    handleDotClick,
    currentIndicator,
    canGoNext,
    canGoPrev,
  } = useCarousel(campaigns);

  // Focus inicial para permitir navegación por teclado inmediata
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Manejador de teclado para accesibilidad
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && canGoPrev) {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight" && canGoNext) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-stone-950 outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0} // Hacemos que el contenedor sea focusable
      aria-label="Selector de Campañas"
      role="region"
      aria-roledescription="carousel">
      {/* 3D Scene Container */}
      <div
        className="relative flex h-150 w-full items-center justify-center"
        style={{ perspective: "1000px" }}
        role="list">
        <AnimatePresence>
          {visibleItems.map(item => (
            <PortalCard
              key={item.key} // Usamos la key compuesta para permitir duplicados virtuales
              position={item.position}
              campaign={item.item} // .item tras refactorización genérica
              visibleRange={Math.floor((visibleItems.length - 1) / 2)}
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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black opacity-80" />
    </section>
  );
};
