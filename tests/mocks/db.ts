/**
 * Base de datos en memoria para tests.
 *
 * Usa @mswjs/data como registry de entidades y @faker-js/faker para
 * generar valores realistas por defecto. Cada llamada a `db.<model>.create()`
 * crea un registro con los campos sobreescribibles — útil para tests
 * aislados donde necesitamos objetos tipados sin boilerplate manual.
 *
 * Uso básico:
 *   const monster = db.monsterTemplate.create({ name: 'Dragón Rojo' })
 *   const hero    = db.characterTemplate.create()
 *
 * Limpieza entre tests:
 *   afterEach(() => {
 *     db.monsterTemplate.deleteMany({ where: {} })
 *     db.characterTemplate.deleteMany({ where: {} })
 *     db.itemTemplate.deleteMany({ where: {} })
 *   })
 *
 * Para obtener items tipados como EncyclopediaItem (con el discriminador `section`):
 *   import { toBestiaryItem, toCastItem, toMuseumItem } from '@/tests/mocks/db'
 */

import type { BestiaryItem, CastItem, MuseumItem } from '@/views/encyclopedia/model/types'
import { faker } from '@faker-js/faker'
import { factory, nullable, primaryKey } from '@mswjs/data'

// ─── Constantes de dominio ────────────────────────────────────────────────────

const MONSTER_TYPES = ['Bestia', 'Humanoide', 'Dragón', 'No-Muerto', 'Aberración', 'Elemental']
const MONSTER_RACES = ['Lobo', 'Ogro', 'Dragón Joven', 'Zombi', 'Gólem de Piedra']
const CHARACTER_RACES = ['Humano', 'Elfo', 'Enano', 'Halfling', 'Gnomo', 'Semiorco']
const CHARACTER_CLASSES = ['Guerrero', 'Mago', 'Pícaro', 'Clérigo', 'Paladín', 'Bardo', 'Druida']
const ITEM_CATEGORIES = ['Arma', 'Armadura', 'Poción', 'Herramienta', 'Joya', 'General']
const RARITIES = ['JUNK', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ARTIFACT'] as const

// Valores de estadística típicos en D&D (1-30 para monstruos, 8-20 para PJs)
const monsterStat = () => faker.number.int({ min: 1, max: 30 })
const characterStat = () => faker.number.int({ min: 8, max: 20 })
const itemModifier = () => faker.number.int({ min: 0, max: 3 })

// ─── Factory ─────────────────────────────────────────────────────────────────

export const db = factory({
  /**
   * Plantilla de monstruo — fuente del Bestiario (BestiaryItem)
   */
  monsterTemplate: {
    id: primaryKey(faker.string.uuid),
    name: () =>
      faker.helpers.arrayElement(['Lobo', 'Araña Gigante', 'Goblin', 'Esqueleto', 'Troll']) +
      ` ${faker.number.int({ min: 1, max: 99 })}`,
    description: () => faker.lorem.sentence(),
    type: () => faker.helpers.arrayElement(MONSTER_TYPES),
    race: () => faker.helpers.arrayElement(MONSTER_RACES),
    characterClass: () => 'Ninguna',
    imageUrl: nullable(() => faker.helpers.maybe(() => faker.image.url()) ?? null),
    portraitImageUrl: nullable(() => null),
    challenge: () => faker.helpers.arrayElement([0.125, 0.25, 0.5, 1, 2, 3, 5, 8, 13, 20]),
    maxHp: () => faker.number.int({ min: 5, max: 300 }),
    strength: monsterStat,
    dexterity: monsterStat,
    constitution: monsterStat,
    intelligence: monsterStat,
    wisdom: monsterStat,
    charisma: monsterStat,
    ac: () => faker.number.int({ min: 8, max: 22 }),
    speed: () => faker.helpers.arrayElement([20, 25, 30, 40, 60]),
    initiativeBonus: () => faker.number.int({ min: -2, max: 5 }),
    perception: () => faker.number.int({ min: 8, max: 20 }),
    abilities: nullable(() => null),
    authorId: nullable(() => null),
    isPublished: () => true,
    price: () => 0,
    version: () => 1,
    createdAt: () => faker.date.past(),
    updatedAt: () => new Date(),
  },

  /**
   * Plantilla de personaje — fuente del Reparto (CastItem)
   */
  characterTemplate: {
    id: primaryKey(faker.string.uuid),
    name: () => faker.person.fullName(),
    description: () => faker.lorem.sentence(),
    imageUrl: nullable(() => null),
    portraitImageUrl: nullable(() => null),
    race: () => faker.helpers.arrayElement(CHARACTER_RACES),
    characterClass: () => faker.helpers.arrayElement(CHARACTER_CLASSES),
    maxHp: () => faker.number.int({ min: 6, max: 120 }),
    abilities: nullable(() => null),
    strength: characterStat,
    dexterity: characterStat,
    constitution: characterStat,
    intelligence: characterStat,
    wisdom: characterStat,
    charisma: characterStat,
    ac: () => faker.number.int({ min: 10, max: 20 }),
    speed: () => 30,
    initiativeBonus: () => faker.number.int({ min: -2, max: 5 }),
    perception: () => faker.number.int({ min: 10, max: 18 }),
    authorId: nullable(() => null),
    isPublished: () => true,
    price: () => 0,
    version: () => 1,
    createdAt: () => faker.date.past(),
    updatedAt: () => new Date(),
  },

  /**
   * Plantilla de ítem — fuente del Museo (MuseumItem)
   */
  itemTemplate: {
    id: primaryKey(faker.string.uuid),
    name: () =>
      `${faker.helpers.arrayElement(['Espada', 'Escudo', 'Poción', 'Anillo', 'Capa'])} ${faker.word.adjective()}`,
    description: () => faker.lorem.sentence(),
    imageUrl: nullable(() => null),
    category: () => faker.helpers.arrayElement(ITEM_CATEGORIES),
    weight: () => parseFloat(faker.number.float({ min: 0, max: 10, fractionDigits: 1 }).toFixed(1)),
    value: () => faker.number.int({ min: 0, max: 10000 }),
    rarity: () => faker.helpers.arrayElement(RARITIES),
    isPublic: () => false,
    // Modificadores (la mayoría son 0 para ítems comunes)
    strength: itemModifier,
    dexterity: itemModifier,
    constitution: itemModifier,
    intelligence: itemModifier,
    wisdom: itemModifier,
    charisma: itemModifier,
    ac: itemModifier,
    speed: () => 0,
    initiativeBonus: () => 0,
    perception: () => 0,
    creatorId: nullable(() => null),
    createdAt: () => faker.date.past(),
    updatedAt: () => new Date(),
  },
})

// ─── Helpers con discriminador de sección ─────────────────────────────────────

type MonsterOverride = Parameters<typeof db.monsterTemplate.create>[0]
type CharacterOverride = Parameters<typeof db.characterTemplate.create>[0]
type ItemOverride = Parameters<typeof db.itemTemplate.create>[0]

/**
 * Crea un BestiaryItem (MonsterTemplate + section: 'bestiary').
 */
export const toBestiaryItem = (override?: MonsterOverride): BestiaryItem => ({
  ...(db.monsterTemplate.create(override ?? {}) as unknown as BestiaryItem),
  section: 'bestiary',
})

/**
 * Crea un CastItem (CharacterTemplate + section: 'cast').
 */
export const toCastItem = (override?: CharacterOverride): CastItem => ({
  ...(db.characterTemplate.create(override ?? {}) as unknown as CastItem),
  section: 'cast',
})

/**
 * Crea un MuseumItem (ItemTemplate + section: 'museum').
 */
export const toMuseumItem = (override?: ItemOverride): MuseumItem => ({
  ...(db.itemTemplate.create(override ?? {}) as unknown as MuseumItem),
  section: 'museum',
})
