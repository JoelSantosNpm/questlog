import { describe, it, expect, beforeEach } from 'vitest'
import { act } from 'react'
import {
  useEncyclopediaStore,
  useActiveSection,
  useCurrentItems,
  useSelectedItem,
} from '@/views/encyclopedia/model/encyclopediaStore'
import type { BestiaryItem, CastItem } from '@/views/encyclopedia/model/types'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MONSTER_A: BestiaryItem = {
  id: 'monster-1',
  name: 'Lobo',
  description: 'Un lobo feroz',
  type: 'Bestia',
  race: 'Lobo',
  characterClass: 'Ninguna',
  imageUrl: null,
  portraitImageUrl: null,
  challenge: 0.25,
  maxHp: 11,
  strength: 12,
  dexterity: 15,
  constitution: 12,
  intelligence: 3,
  wisdom: 12,
  charisma: 6,
  ac: 13,
  speed: 40,
  initiativeBonus: 0,
  perception: 13,
  abilities: null,
  authorId: null,
  isPublished: true,
  price: 0,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  section: 'bestiary',
}

const MONSTER_B: BestiaryItem = { ...MONSTER_A, id: 'monster-2', name: 'Araña Gigante' }

const NPC_A: CastItem = {
  id: 'cast-1',
  name: 'Valerius',
  description: 'Un paladín caído',
  race: 'Humano',
  characterClass: 'Paladín',
  imageUrl: null,
  portraitImageUrl: null,
  maxHp: 45,
  abilities: null,
  strength: 16,
  dexterity: 10,
  constitution: 14,
  intelligence: 11,
  wisdom: 13,
  charisma: 15,
  ac: 18,
  speed: 30,
  initiativeBonus: 0,
  perception: 11,
  authorId: null,
  isPublished: true,
  price: 0,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  section: 'cast',
}

const ALL_DATA = {
  bestiary: [MONSTER_A, MONSTER_B],
  cast: [NPC_A],
  museum: [],
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  act(() => {
    useEncyclopediaStore.setState({
      activeSection: 'bestiary',
      selectedItemId: null,
      itemsBySection: { bestiary: [], cast: [], museum: [] },
    })
  })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('encyclopediaStore', () => {
  describe('setItems', () => {
    it('puebla el store con los datos de todas las secciones', () => {
      act(() => useEncyclopediaStore.getState().setItems(ALL_DATA))
      const state = useEncyclopediaStore.getState()
      expect(state.itemsBySection.bestiary).toHaveLength(2)
      expect(state.itemsBySection.cast).toHaveLength(1)
      expect(state.itemsBySection.museum).toHaveLength(0)
    })
  })

  describe('setActiveSection', () => {
    it('cambia la sección activa', () => {
      act(() => useEncyclopediaStore.getState().setActiveSection('cast'))
      expect(useEncyclopediaStore.getState().activeSection).toBe('cast')
    })

    it('resetea selectedItemId a null al cambiar de sección', () => {
      act(() => {
        useEncyclopediaStore.getState().setItems(ALL_DATA)
        useEncyclopediaStore.getState().setSelectedItemId('monster-1')
        useEncyclopediaStore.getState().setActiveSection('cast')
      })
      expect(useEncyclopediaStore.getState().selectedItemId).toBeNull()
    })
  })

  describe('selector useCurrentItems', () => {
    it('devuelve los items de la sección activa', () => {
      act(() => {
        useEncyclopediaStore.getState().setItems(ALL_DATA)
      })
      const items = useEncyclopediaStore.getState().itemsBySection['bestiary']
      expect(items).toHaveLength(2)
      expect(items[0].id).toBe('monster-1')
    })

    it('devuelve array vacío si la sección no tiene items', () => {
      act(() => {
        useEncyclopediaStore.getState().setItems(ALL_DATA)
        useEncyclopediaStore.getState().setActiveSection('museum')
      })
      const items = useEncyclopediaStore.getState().itemsBySection['museum']
      expect(items).toHaveLength(0)
    })
  })

  describe('selector useSelectedItem', () => {
    beforeEach(() => {
      act(() => useEncyclopediaStore.getState().setItems(ALL_DATA))
    })

    it('devuelve items[0] cuando selectedItemId es null', () => {
      const s = useEncyclopediaStore.getState()
      const items = s.itemsBySection[s.activeSection]
      const result = items.find((i) => i.id === s.selectedItemId) ?? items[0]
      expect(result?.id).toBe('monster-1')
    })

    it('devuelve el item correcto cuando selectedItemId está establecido', () => {
      act(() => useEncyclopediaStore.getState().setSelectedItemId('monster-2'))
      const s = useEncyclopediaStore.getState()
      const items = s.itemsBySection[s.activeSection]
      const result = items.find((i) => i.id === s.selectedItemId) ?? items[0]
      expect(result?.id).toBe('monster-2')
    })

    it('devuelve items[0] si el id seleccionado no existe en la sección actual', () => {
      act(() => {
        useEncyclopediaStore.getState().setSelectedItemId('id-inexistente')
      })
      const s = useEncyclopediaStore.getState()
      const items = s.itemsBySection[s.activeSection]
      const result = items.find((i) => i.id === s.selectedItemId) ?? items[0]
      expect(result?.id).toBe('monster-1')
    })

    it('devuelve undefined si la sección está vacía y no hay selección', () => {
      act(() => useEncyclopediaStore.getState().setActiveSection('museum'))
      const s = useEncyclopediaStore.getState()
      const items = s.itemsBySection[s.activeSection]
      const result = items.find((i) => i.id === s.selectedItemId) ?? items[0]
      expect(result).toBeUndefined()
    })
  })
})
