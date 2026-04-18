import { describe, it, expect, beforeEach } from 'vitest'
import { act } from 'react'
import { useEncyclopediaStore } from '@/views/encyclopedia/model/encyclopediaStore'

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  act(() => {
    useEncyclopediaStore.setState({
      activeSection: 'bestiary',
      selectedItemId: null,
      searchQuery: '',
    })
  })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('encyclopediaStore (UI State)', () => {
  describe('setActiveSection', () => {
    it('cambia la sección activa', () => {
      act(() => useEncyclopediaStore.getState().setActiveSection('cast'))
      expect(useEncyclopediaStore.getState().activeSection).toBe('cast')
    })

    it('resetea selectedItemId y searchQuery a valores iniciales al cambiar de sección', () => {
      act(() => {
        useEncyclopediaStore.getState().setSelectedItemId('monster-1')
        useEncyclopediaStore.getState().setSearchQuery('dragón')
        useEncyclopediaStore.getState().setActiveSection('cast')
      })
      expect(useEncyclopediaStore.getState().selectedItemId).toBeNull()
      expect(useEncyclopediaStore.getState().searchQuery).toBe('')
    })
  })

  describe('setSelectedItemId', () => {
    it('establece el ID del item seleccionado', () => {
      act(() => useEncyclopediaStore.getState().setSelectedItemId('item-123'))
      expect(useEncyclopediaStore.getState().selectedItemId).toBe('item-123')
    })
  })

  describe('setSearchQuery', () => {
    it('actualiza la consulta de búsqueda', () => {
      act(() => useEncyclopediaStore.getState().setSearchQuery('lobo'))
      expect(useEncyclopediaStore.getState().searchQuery).toBe('lobo')
    })
  })
})
