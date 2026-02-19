import { Campaign, PortalCarouselItem } from "@/types/portal";

export const MAX_INDEX = Number.MAX_SAFE_INTEGER - 100; // Margen de seguridad para evitar overflow

export const getCircularCarousel = (
  allCampaigns: Campaign[],
  activeIndex: number,
  visibleRange = 3,
): PortalCarouselItem[] => {
  const total = allCampaigns.length;

  if (total === 0) return [];

  const visibleItems: PortalCarouselItem[] = [];

  for (let i = -visibleRange; i <= visibleRange; i++) {
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
