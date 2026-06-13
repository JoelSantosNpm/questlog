import type { EncyclopediaSection } from '../model/encyclopedia-item'

export const CREATE_BUTTON_KEYS: Record<EncyclopediaSection, string> = {
  bestiary: 'monsterForm.createButton',
  cast: 'characterForm.createButton',
  museum: 'itemForm.createButton',
}

export const CREATE_FAB_LABEL_KEYS: Record<EncyclopediaSection, string> = {
  bestiary: 'mobileDrawer.newMonsterLabel',
  cast: 'mobileDrawer.newCharacterLabel',
  museum: 'mobileDrawer.newItemLabel',
}
