import { create } from 'zustand'
import type { EncyclopediaSection } from './types'

export type { EncyclopediaSection }

interface EncyclopediaUIState {
  activeSection: EncyclopediaSection
  selectedItemId: string | null
  searchQuery: string
  setActiveSection: (section: EncyclopediaSection) => void
  setSelectedItemId: (id: string | null) => void
  setSearchQuery: (query: string) => void
}

export const useEncyclopediaStore = create<EncyclopediaUIState>((set) => ({
  activeSection: 'bestiary',
  selectedItemId: null,
  searchQuery: '',
  setActiveSection: (section) =>
    set({ activeSection: section, selectedItemId: null, searchQuery: '' }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))

// Selectores
export const useActiveSection = () => useEncyclopediaStore((s) => s.activeSection)
export const useSelectedItemId = () => useEncyclopediaStore((s) => s.selectedItemId)
export const useSearchQuery = () => useEncyclopediaStore((s) => s.searchQuery)

export const useSetActiveSection = () => useEncyclopediaStore((s) => s.setActiveSection)
export const useSetSelectedItemId = () => useEncyclopediaStore((s) => s.setSelectedItemId)
export const useSetSearchQuery = () => useEncyclopediaStore((s) => s.setSearchQuery)
