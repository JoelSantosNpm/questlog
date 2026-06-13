export const RARITY_VALUES = [
  'JUNK',
  'COMMON',
  'UNCOMMON',
  'RARE',
  'EPIC',
  'LEGENDARY',
  'ARTIFACT',
] as const

export type RarityValue = (typeof RARITY_VALUES)[number]

/** Mapea cada valor de Rarity a su clave en `itemProperties.rarities.*` (JUNK -> 'trash'). */
export const RARITY_LABEL_KEYS: Record<RarityValue, string> = {
  JUNK: 'trash',
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  ARTIFACT: 'artifact',
}
