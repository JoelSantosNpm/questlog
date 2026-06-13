import type { Prisma } from '@prisma/client'

export type ItemFormFields = Pick<
  Prisma.ItemTemplateCreateInput,
  | 'name'
  | 'description'
  | 'imageUrl'
  | 'category'
  | 'weight'
  | 'value'
  | 'rarity'
  | 'isPublic'
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma'
  | 'ac'
  | 'speed'
  | 'initiativeBonus'
  | 'perception'
>

export const DEFAULT_ITEM_FORM_VALUES: ItemFormFields = {
  name: '',
  category: 'General',
  weight: 0,
  value: 0,
  rarity: 'COMMON',
  isPublic: false,
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0,
  ac: 0,
  speed: 0,
  initiativeBonus: 0,
  perception: 0,
}
