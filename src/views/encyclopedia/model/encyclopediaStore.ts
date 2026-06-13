import { create } from 'zustand'
import type { EncyclopediaSection } from './encyclopedia-item'

export type { EncyclopediaSection }

interface EncyclopediaUIState {
  activeSection: EncyclopediaSection
  selectedItemId: string | null
  searchQuery: string
  isCreatingNew: boolean
  isEditing: boolean
  setActiveSection: (section: EncyclopediaSection) => void
  setSelectedItemId: (id: string | null) => void
  setSearchQuery: (query: string) => void
  setIsCreatingNew: (v: boolean) => void
  setIsEditing: (v: boolean) => void
  // Filtros de visibilidad y propiedad
  showPublic: boolean
  showPrivate: boolean
  showMine: boolean
  showShared: boolean
  togglePublic: () => void
  togglePrivate: () => void
  toggleMine: () => void
  toggleShared: () => void
  resetPrivateFilters: () => void
}

export const useEncyclopediaStore = create<EncyclopediaUIState>((set) => ({
  activeSection: 'bestiary',
  selectedItemId: null,
  searchQuery: '',
  isCreatingNew: false,
  isEditing: false,
  setActiveSection: (section) =>
    set({
      activeSection: section,
      selectedItemId: null,
      searchQuery: '',
      isCreatingNew: false,
      isEditing: false,
    }),
  setSelectedItemId: (id) => set({ selectedItemId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsCreatingNew: (v) =>
    set((s) => ({
      isCreatingNew: v,
      isEditing: v ? false : s.isEditing,
      selectedItemId: v ? null : s.selectedItemId,
    })),
  setIsEditing: (v) => set((s) => ({ isEditing: v, isCreatingNew: v ? false : s.isCreatingNew })),
  // Filtros — por defecto: solo públicos, sub-filtros de privados activos para cuando se habiliten
  showPublic: true,
  showPrivate: true,
  showMine: true,
  showShared: true,
  // "Last one standing": no se puede desactivar el último toggle activo de su grupo
  togglePublic: () =>
    set((s) => (s.showPublic && !s.showPrivate ? s : { showPublic: !s.showPublic })),
  togglePrivate: () =>
    set((s) => (s.showPrivate && !s.showPublic ? s : { showPrivate: !s.showPrivate })),
  toggleMine: () => set((s) => (s.showMine && !s.showShared ? s : { showMine: !s.showMine })),
  toggleShared: () => set((s) => (s.showShared && !s.showMine ? s : { showShared: !s.showShared })),
  resetPrivateFilters: () =>
    set({ showPrivate: false, showPublic: true, showMine: true, showShared: true }),
}))

// Selectores — sección y búsqueda
export const useActiveSection = () => useEncyclopediaStore((s) => s.activeSection)
export const useSelectedItemId = () => useEncyclopediaStore((s) => s.selectedItemId)
export const useSearchQuery = () => useEncyclopediaStore((s) => s.searchQuery)

export const useSetActiveSection = () => useEncyclopediaStore((s) => s.setActiveSection)
export const useSetSelectedItemId = () => useEncyclopediaStore((s) => s.setSelectedItemId)
export const useSetSearchQuery = () => useEncyclopediaStore((s) => s.setSearchQuery)

// Selectores — filtros
export const useShowPublic = () => useEncyclopediaStore((s) => s.showPublic)
export const useShowPrivate = () => useEncyclopediaStore((s) => s.showPrivate)
export const useShowMine = () => useEncyclopediaStore((s) => s.showMine)
export const useShowShared = () => useEncyclopediaStore((s) => s.showShared)

export const useTogglePublic = () => useEncyclopediaStore((s) => s.togglePublic)
export const useTogglePrivate = () => useEncyclopediaStore((s) => s.togglePrivate)
export const useToggleMine = () => useEncyclopediaStore((s) => s.toggleMine)
export const useToggleShared = () => useEncyclopediaStore((s) => s.toggleShared)

export const useIsCreatingNew = () => useEncyclopediaStore((s) => s.isCreatingNew)
export const useSetIsCreatingNew = () => useEncyclopediaStore((s) => s.setIsCreatingNew)

export const useIsEditing = () => useEncyclopediaStore((s) => s.isEditing)
export const useSetIsEditing = () => useEncyclopediaStore((s) => s.setIsEditing)
