import type { Prisma } from '@prisma/client'

export type CharacterFormFields = Pick<
  Prisma.CharacterTemplateCreateInput,
  | 'name'
  | 'race'
  | 'characterClass'
  | 'description'
  | 'imageUrl'
  | 'portraitImageUrl'
  | 'isPublic'
  | 'maxHp'
  | 'ac'
  | 'speed'
  | 'strength'
  | 'dexterity'
  | 'constitution'
  | 'intelligence'
  | 'wisdom'
  | 'charisma'
  | 'initiativeBonus'
  | 'perception'
>

export const DEFAULT_CHARACTER_FORM_VALUES: CharacterFormFields = {
  name: '',
  race: 'Desconocido',
  characterClass: 'Desconocido',
  isPublic: false,
  maxHp: 8,
  ac: 10,
  speed: 30,
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
  initiativeBonus: 0,
  perception: 10,
}
