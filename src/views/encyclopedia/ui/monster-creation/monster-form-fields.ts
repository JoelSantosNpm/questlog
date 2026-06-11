import type { Prisma } from '@prisma/client'

export type MonsterFormFields = Pick<
  Prisma.MonsterTemplateCreateInput,
  | 'name'
  | 'type'
  | 'race'
  | 'characterClass'
  | 'description'
  | 'imageUrl'
  | 'portraitImageUrl'
  | 'isPublic'
  | 'maxHp'
  | 'challenge'
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

export const DEFAULT_MONSTER_FORM_VALUES: MonsterFormFields = {
  name: '',
  type: '',
  race: 'Desconocido',
  characterClass: 'Desconocido',
  isPublic: false,
  maxHp: 10,
  challenge: 1,
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
