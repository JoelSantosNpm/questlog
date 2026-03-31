import { create } from 'zustand'
import type { EncyclopediaItem } from './types'

export type EncyclopediaSection = 'bestiary' | 'cast' | 'museum'

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
    cast: [],
    museum: [],
  },
  setActiveSection: (section) => set({ activeSection: section, selectedItemId: null }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  setItems: (items) => set({ itemsBySection: items }),
}))

// Selectores — evitan re-renders en componentes que no consumen el campo completo
export const useActiveSection = () => useEncyclopediaStore((s) => s.activeSection)
export const useSelectedItemId = () => useEncyclopediaStore((s) => s.selectedItemId)
export const useCurrentItems = () =>
  useEncyclopediaStore((s) => s.itemsBySection[s.activeSection] ?? [])
export const useSelectedItem = () =>
  useEncyclopediaStore((s) => {
    const items = s.itemsBySection[s.activeSection] ?? []
    return items.find((i) => i.id === s.selectedItemId) ?? items[0]
  })
export const useSetActiveSection = () => useEncyclopediaStore((s) => s.setActiveSection)
export const useSetSelectedItemId = () => useEncyclopediaStore((s) => s.setSelectedItemId)
