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
  { id: 3, name: "Volcano Peak", variant: "existing" },
  { id: 4, name: "The Exit", variant: "existing" },
  { id: 5, name: "Scape Room", variant: "existing" },
  { id: 6, name: "The Golden Country", variant: "existing" },
  { id: 7, name: "Unknown Path", variant: "existing" },
  { id: 8, name: "Misty Forest", variant: "existing" },
  { id: 9, name: "Monk's Journey", variant: "existing" },
  { id: 10, name: "New Campaign", variant: "new" },
];

type PortalCarouselItem = { campaign: Campaign; position: number };

const getCircularCarousel = (
  allCampaigns: Campaign[],
  activeIndex: number,
  visibleRange = 3,
): PortalCarouselItem[] => {
  const total = allCampaigns.length;
  const visibleItems: PortalCarouselItem[] = [];

  const maxVisibleRange = Math.floor((total - 1) / 2);

  if (maxVisibleRange < visibleRange)
    return campaigns.map((campaign, index) => ({
      campaign,
      position: index - activeIndex, // Posición relativa al índice activo
    }));

  visibleRange = Math.min(visibleRange, maxVisibleRange);

  for (let i = -visibleRange; i <= visibleRange; i++) {
    // Aritmética modular para que el array sea circular
    const index = (((activeIndex + i) % total) + total) % total; // (activeIndex + i + total) % total;
    visibleItems.push({
      campaign: allCampaigns[index],
      position: i, // pos relativa respecto al centro (0)
    });
  }

  return visibleItems;
};

export const PortalCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Start at first existing

  const visibleItems = useMemo(() => {
    return getCircularCarousel(campaigns, activeIndex);
  }, [campaigns, activeIndex]);

  const next = () => setActiveIndex(prev => (prev + 1) % campaigns.length);
  const prev = () =>
    setActiveIndex(prev => (prev - 1 + campaigns.length) % campaigns.length);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-stone-950">
      {/* 3D Scene Container */}
      <div
        className="relative flex h-[600px] w-full items-center justify-center"
        style={{ perspective: "1000px" }}>
        <AnimatePresence>
          {visibleItems.map(item => (
            <PortalCard
              key={item.campaign.id}
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
            onClick={prev}
            className="group rounded-full border border-stone-700 bg-stone-900/80 p-4 text-amber-500 backdrop-blur-sm transition-all hover:bg-amber-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-stone-900/80 disabled:hover:text-amber-500">
            <ChevronLeft size={32} />
          </button>

          <button
            onClick={next}
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
