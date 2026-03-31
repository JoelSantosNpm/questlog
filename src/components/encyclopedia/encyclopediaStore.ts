import { create } from 'zustand'
import type { EncyclopediaItem } from './types'

export type EncyclopediaSection = 'bestiary' | 'dramatis-personae' | 'museum'

interface EncyclopediaState {
  activeSection: EncyclopediaSection
  selectedItemId: string | null
  itemsBySection: Record<EncyclopediaSection, EncyclopediaItem[]>
  setActiveSection: (section: EncyclopediaSection) => void
  setSelectedItemId: (id: string | null) => void
  setItems: (items: Record<EncyclopediaSection, EncyclopediaItem[]>) => void
}

export const useEncyclopediaStore = create<EncyclopediaState>((set) => ({
  activeSection: 'bestiary',
  selectedItemId: null,
  itemsBySection: {
    bestiary: [],
    'dramatis-personae': [],
    museum: [],
  },
  setActiveSection: (section) => set({ activeSection: section, selectedItemId: null }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  setItems: (items) => set({ itemsBySection: items }),
}))
