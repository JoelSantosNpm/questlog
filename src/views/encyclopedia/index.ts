// Public API — encyclopedia slice
export { EncyclopediaContainer } from './ui/EncyclopediaContainer'
export { EncyclopediaStoreInitializer } from './ui/EncyclopediaStoreInitializer'
export { SideTabs } from './ui/SideTabs'
export { getBestiaryItems, getCharacterTemplates, getMuseumItems } from './api/encyclopedia-queries'
export type {
  EncyclopediaSection,
  EncyclopediaItem,
  BestiaryItem,
  CastItem,
  MuseumItem,
  SectionConfig,
} from './model/encyclopedia'
