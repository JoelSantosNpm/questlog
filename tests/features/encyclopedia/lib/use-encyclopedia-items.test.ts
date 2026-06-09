import { useCurrentItems, useSelectedItem } from '@/views/encyclopedia/lib/use-encyclopedia-items'
import { useEncyclopediaStore } from '@/views/encyclopedia/model/encyclopediaStore'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db, toBestiaryItem, toCastItem, toMuseumItem } from '../../../mocks/db'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/views/encyclopedia/api/encyclopedia-hooks', () => ({
  useBestiary: vi.fn(),
  useCharacterTemplates: vi.fn(),
  useMuseumItems: vi.fn(),
}))

import {
  useBestiary,
  useCharacterTemplates,
  useMuseumItems,
} from '@/views/encyclopedia/api/encyclopedia-hooks'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

// Nombres fijos para poder filtrarlos en assertions; el resto de campos los genera faker
const WOLF = toBestiaryItem({ name: 'Lobo' })
const GIANT_SPIDER = toBestiaryItem({ name: 'Araña Gigante' })
const NPC = toCastItem({ name: 'Valerius' })

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  act(() => {
    useEncyclopediaStore.setState({
      activeSection: 'bestiary',
      selectedItemId: null,
      searchQuery: '',
    })
  })

  vi.mocked(useBestiary).mockReturnValue({ data: [WOLF, GIANT_SPIDER] } as unknown as ReturnType<
    typeof useBestiary
  >)
  vi.mocked(useCharacterTemplates).mockReturnValue({ data: [NPC] } as unknown as ReturnType<
    typeof useCharacterTemplates
  >)
  vi.mocked(useMuseumItems).mockReturnValue({ data: [] } as unknown as ReturnType<
    typeof useMuseumItems
  >)
})

afterEach(() => {
  db.monsterTemplate.deleteMany({ where: {} })
  db.characterTemplate.deleteMany({ where: {} })
  db.itemTemplate.deleteMany({ where: {} })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useCurrentItems', () => {
  it('devuelve los items del bestiario cuando la sección activa es bestiary', () => {
    const { result } = renderHook(() => useCurrentItems())
    expect(result.current).toHaveLength(2)
    expect(result.current[0].id).toBe(WOLF.id)
  })

  it('devuelve los items de cast cuando la sección activa es cast', () => {
    act(() => useEncyclopediaStore.getState().setActiveSection('cast'))
    const { result } = renderHook(() => useCurrentItems())
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe(NPC.id)
  })

  it('devuelve array vacío cuando la sección activa no tiene items', () => {
    act(() => useEncyclopediaStore.getState().setActiveSection('museum'))
    const { result } = renderHook(() => useCurrentItems())
    expect(result.current).toHaveLength(0)
  })

  it('filtra por nombre cuando hay una búsqueda activa', () => {
    act(() => useEncyclopediaStore.getState().setSearchQuery('lobo'))
    const { result } = renderHook(() => useCurrentItems())
    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('Lobo')
  })

  it('el filtro es insensible a mayúsculas', () => {
    act(() => useEncyclopediaStore.getState().setSearchQuery('ARAÑA'))
    const { result } = renderHook(() => useCurrentItems())
    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('Araña Gigante')
  })

  it('devuelve todos los items cuando la búsqueda está vacía o solo tiene espacios', () => {
    act(() => useEncyclopediaStore.getState().setSearchQuery('   '))
    const { result } = renderHook(() => useCurrentItems())
    expect(result.current).toHaveLength(2)
  })

  it('devuelve array vacío si ningún item coincide con la búsqueda', () => {
    act(() => useEncyclopediaStore.getState().setSearchQuery('dragón'))
    const { result } = renderHook(() => useCurrentItems())
    expect(result.current).toHaveLength(0)
  })

  it('item generado dinámicamente con faker tiene el section correcto', () => {
    const museumItem = toMuseumItem()
    vi.mocked(useMuseumItems).mockReturnValue({ data: [museumItem] } as unknown as ReturnType<
      typeof useMuseumItems
    >)
    act(() => useEncyclopediaStore.getState().setActiveSection('museum'))
    const { result } = renderHook(() => useCurrentItems())
    expect(result.current).toHaveLength(1)
    expect(result.current[0].section).toBe('museum')
  })
})

describe('useSelectedItem', () => {
  it('devuelve el primer item cuando selectedItemId es null', () => {
    const { result } = renderHook(() => useSelectedItem())
    expect(result.current?.id).toBe(WOLF.id)
  })

  it('devuelve el item correcto cuando selectedItemId está establecido', () => {
    act(() => useEncyclopediaStore.getState().setSelectedItemId(GIANT_SPIDER.id))
    const { result } = renderHook(() => useSelectedItem())
    expect(result.current?.id).toBe(GIANT_SPIDER.id)
  })

  it('devuelve el primer item si el id seleccionado no existe en la lista filtrada', () => {
    act(() => useEncyclopediaStore.getState().setSelectedItemId('id-inexistente'))
    const { result } = renderHook(() => useSelectedItem())
    expect(result.current?.id).toBe(WOLF.id)
  })

  it('devuelve undefined si la sección está vacía', () => {
    act(() => useEncyclopediaStore.getState().setActiveSection('museum'))
    const { result } = renderHook(() => useSelectedItem())
    expect(result.current).toBeUndefined()
  })

  it('devuelve undefined si la búsqueda activa elimina todos los items', () => {
    act(() => useEncyclopediaStore.getState().setSearchQuery('xyz-no-existe'))
    const { result } = renderHook(() => useSelectedItem())
    expect(result.current).toBeUndefined()
  })
})
