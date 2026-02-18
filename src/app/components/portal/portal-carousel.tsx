"use client";

import { useState } from "react";
import { PortalCard } from "./portal-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const campaigns = [
  { id: 1, name: "The Forgotten Caves", variant: "existing" as const },
  { id: 2, name: "Eldarin Kingdom", variant: "existing" as const },
  { id: 3, name: "Volcano Peak", variant: "existing" as const },
  { id: 4, name: "New Campaign", variant: "new" as const },
];

export const PortalCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Start at first existing

  const next = () =>
    setActiveIndex(prev => (prev < campaigns.length - 1 ? prev + 1 : prev));
  const prev = () => setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-stone-950">
      {/* 3D Scene Container */}
      <div
        className="relative flex h-[600px] w-full items-center justify-center"
        style={{ perspective: "1000px" }}>
        <AnimatePresence>
          {campaigns.map((camp, i) => (
            <PortalCard
              key={camp.id}
              index={i}
              activeIndex={activeIndex}
              campaign={camp}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 z-50 flex flex-col items-center gap-6">
        {/* Buttons */}
        <div className="flex gap-8">
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className="group rounded-full border border-stone-700 bg-stone-900/80 p-4 text-amber-500 backdrop-blur-sm transition-all hover:bg-amber-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-stone-900/80 disabled:hover:text-amber-500">
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={next}
            disabled={activeIndex === campaigns.length - 1}
            className="group rounded-full border border-stone-700 bg-stone-900/80 p-4 text-amber-500 backdrop-blur-sm transition-all hover:bg-amber-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-stone-900/80 disabled:hover:text-amber-500">
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="flex items-center gap-3">
          {campaigns.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "w-8 bg-amber-500" : "w-2 bg-stone-700 hover:bg-stone-600"}`}
            />
          ))}
        </div>
      </div>

      {/* Optional: Background Ambience */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black opacity-80" />
    </div>
  );
};
