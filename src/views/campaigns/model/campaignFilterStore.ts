import { create } from 'zustand'

interface CampaignFilterState {
  showPublic: boolean
  showPrivate: boolean
  showOwned: boolean
  showMember: boolean
  togglePublic: () => void
  togglePrivate: () => void
  toggleOwned: () => void
  toggleMember: () => void
  resetPrivateFilters: () => void
}

export const useCampaignFilterStore = create<CampaignFilterState>((set) => ({
  showPublic: false,
  showPrivate: true,
  showOwned: true,
  showMember: true,
  // "Last one standing": no se puede desactivar el único toggle activo de su grupo
  togglePublic: () =>
    set((s) => (s.showPublic && !s.showPrivate ? s : { showPublic: !s.showPublic })),
  togglePrivate: () =>
    set((s) => (s.showPrivate && !s.showPublic ? s : { showPrivate: !s.showPrivate })),
  toggleOwned: () => set((s) => (s.showOwned && !s.showMember ? s : { showOwned: !s.showOwned })),
  toggleMember: () =>
    set((s) => (s.showMember && !s.showOwned ? s : { showMember: !s.showMember })),
  resetPrivateFilters: () =>
    set({ showPrivate: false, showPublic: true, showOwned: true, showMember: true }),
}))

// Selectores
export const useShowCampaignPublic = () => useCampaignFilterStore((s) => s.showPublic)
export const useShowCampaignPrivate = () => useCampaignFilterStore((s) => s.showPrivate)
export const useShowCampaignOwned = () => useCampaignFilterStore((s) => s.showOwned)
export const useShowCampaignMember = () => useCampaignFilterStore((s) => s.showMember)

export const useToggleCampaignPublic = () => useCampaignFilterStore((s) => s.togglePublic)
export const useToggleCampaignPrivate = () => useCampaignFilterStore((s) => s.togglePrivate)
export const useToggleCampaignOwned = () => useCampaignFilterStore((s) => s.toggleOwned)
export const useToggleCampaignMember = () => useCampaignFilterStore((s) => s.toggleMember)
export const useResetCampaignPrivateFilters = () =>
  useCampaignFilterStore((s) => s.resetPrivateFilters)
