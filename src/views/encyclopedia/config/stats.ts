import type { CharacterTemplate } from '@prisma/client'

/** Claves de tipo `number` de T — para la restricción interna. */
type _NumericKeys<T> = { [K in keyof T]: T[K] extends number ? K : never }[keyof T]

export const STAT_KEYS = [
  'ac',
  'speed',
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
  'initiativeBonus',
  'perception',
] as const satisfies ReadonlyArray<_NumericKeys<CharacterTemplate>>

export type NumericStatKey = (typeof STAT_KEYS)[number]

export type StatConfig = { label: string; title: string; key: NumericStatKey }

export const MAIN_STATS: StatConfig[] = [
  { label: 'CA', title: 'Clase de Armadura', key: 'ac' },
  { label: 'VEL', title: 'Velocidad', key: 'speed' },
]

export const SMALL_STATS: [StatConfig[], StatConfig[]] = [
  [
    { label: 'FUE', title: 'Fuerza', key: 'strength' },
    { label: 'DES', title: 'Destreza', key: 'dexterity' },
    { label: 'CON', title: 'Constitución', key: 'constitution' },
    { label: 'INT', title: 'Inteligencia', key: 'intelligence' },
  ],
  [
    { label: 'SAB', title: 'Sabiduría', key: 'wisdom' },
    { label: 'CAR', title: 'Carisma', key: 'charisma' },
    { label: 'INI', title: 'Bonificador de Iniciativa', key: 'initiativeBonus' },
    { label: 'PER', title: 'Percepción Pasiva', key: 'perception' },
  ],
]

/** Todas las stats en orden canónico (MAIN + fila 1 + fila 2). */
export const ALL_STATS: StatConfig[] = [...MAIN_STATS, ...SMALL_STATS[0], ...SMALL_STATS[1]]

/** Formatea un número con signo explícito (+/-). */
export function signed(n: number): string {
  return n >= 0 ? `+${n}` : String(n)
}
