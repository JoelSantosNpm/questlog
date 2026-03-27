import { create } from 'zustand'

export type EncyclopediaSection = 'bestiary' | 'dramatis-personae' | 'museum'

interface EncyclopediaState {
  activeSection: EncyclopediaSection
  selectedItemId: string | null
  setActiveSection: (section: EncyclopediaSection) => void
  setSelectedItemId: (id: string | null) => void
}

export const useEncyclopediaStore = create<EncyclopediaState>((set) => ({
  activeSection: 'bestiary',
  selectedItemId: null,
  setActiveSection: (section) => set({ activeSection: section, selectedItemId: null }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
}))
