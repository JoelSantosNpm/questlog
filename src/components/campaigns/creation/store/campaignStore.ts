import { create } from 'zustand'

interface CampaignStore {
  currentStepIndex: number
  isTransitioning: boolean
  setIsTransitioning: (val: boolean) => void
  advanceStep: () => void
  skipStep: () => void
}

export const useCampaignStore = create<CampaignStore>((set) => ({
  currentStepIndex: 0,
  isTransitioning: false,
  setIsTransitioning: (val) => set({ isTransitioning: val }),
  advanceStep: () => set((state) => ({ currentStepIndex: state.currentStepIndex + 1 })),
  skipStep: () => set((state) => ({ currentStepIndex: state.currentStepIndex + 1 })),
}))
