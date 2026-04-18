// Public API — encyclopedia slice
export { useBestiary, useCharacterTemplates, useMuseumItems } from './api/encyclopedia-hooks'
export { getBestiaryItems, getCharacterTemplates, getMuseumItems } from './api/encyclopedia-queries'
export { prefetchEncyclopediaData } from './api/prefetch'
export { useCurrentItems, useSelectedItem } from './lib/use-encyclopedia-items'
export type {
  BestiaryItem,
  CastItem,
  EncyclopediaItem,
  EncyclopediaSection,
  MuseumItem,
  SectionConfig,
} from './model/types'
export { EncyclopediaContainer } from './ui/EncyclopediaContainer'
export { SideTabs } from './ui/SideTabs'
