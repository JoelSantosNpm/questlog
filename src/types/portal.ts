// Definiciones de tipos para el carrusel de portales

export interface Campaign {
  id: number;
  name: string;
  variant: "existing" | "new";
}

export type PortalCarouselItem<T = Campaign> = {
  key: string;
  item: T;
  position: number;
};
