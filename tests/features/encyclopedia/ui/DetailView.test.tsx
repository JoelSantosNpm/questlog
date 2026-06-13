import {
  useDeleteCharacterTemplate,
  useDeleteItemTemplate,
  useDeleteMonster,
} from '@/views/encyclopedia/api/encyclopedia-mutations'
import { useCurrentItems, useSelectedItem } from '@/views/encyclopedia/lib/use-encyclopedia-items'
import { useEncyclopediaStore } from '@/views/encyclopedia/model/encyclopediaStore'
import { DetailView } from '@/views/encyclopedia/ui/DetailView'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import { sileo } from 'sileo'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toBestiaryItem, toCastItem, toMuseumItem } from '../../../mocks/db'

vi.mock('@/views/encyclopedia/lib/use-encyclopedia-items', () => ({
  useCurrentItems: vi.fn(() => []),
  useSelectedItem: vi.fn(() => undefined),
}))

vi.mock('@/views/encyclopedia/api/encyclopedia-mutations', () => ({
  useDeleteMonster: vi.fn(),
  useDeleteCharacterTemplate: vi.fn(),
  useDeleteItemTemplate: vi.fn(),
}))

vi.mock('@/views/encyclopedia/ui/CombatStats', () => ({
  CombatStats: () => <div data-testid="combat-stats" />,
}))
vi.mock('@/views/encyclopedia/ui/ItemProperties', () => ({
  ItemProperties: () => <div data-testid="item-properties" />,
}))
vi.mock('@/views/encyclopedia/ui/EncyclopediaImage', () => ({
  EncyclopediaImage: () => <div data-testid="encyclopedia-image" />,
}))
vi.mock('@/views/encyclopedia/ui/ItemHeader', () => ({
  ItemHeader: () => <div data-testid="item-header" />,
}))

vi.mock('framer-motion', () => ({
  LazyMotion: ({ children }: { children: React.ReactNode }) => children,
  domMax: {},
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  m: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const OWNED_MONSTER = toBestiaryItem({ name: 'Lobo' }, true)
const UNOWNED_MONSTER = toBestiaryItem({ name: 'Oso' }, false)
const OWNED_CHARACTER = toCastItem({ name: 'Valerius' }, true)
const OWNED_ITEM = toMuseumItem({ name: 'Espada' }, true)

const deleteMonsterMock = vi.fn()
const deleteCharacterMock = vi.fn()
const deleteItemMock = vi.fn()

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(useDeleteMonster).mockReturnValue({ mutateAsync: deleteMonsterMock } as never)
  vi.mocked(useDeleteCharacterTemplate).mockReturnValue({ mutateAsync: deleteCharacterMock } as never)
  vi.mocked(useDeleteItemTemplate).mockReturnValue({ mutateAsync: deleteItemMock } as never)
  act(() => {
    useEncyclopediaStore.setState({ activeSection: 'bestiary', selectedItemId: null, isEditing: false })
  })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DetailView', () => {
  describe('Sin item seleccionado', () => {
    it('muestra el mensaje de selección vacía', () => {
      vi.mocked(useSelectedItem).mockReturnValue(undefined)
      vi.mocked(useCurrentItems).mockReturnValue([])
      render(<DetailView />)
      expect(screen.getByText('Selecciona un elemento para ver sus detalles.')).toBeInTheDocument()
    })
  })

  describe('Botones de edición y borrado', () => {
    it('muestra "Editar" y "Eliminar" cuando el item es propio', () => {
      vi.mocked(useSelectedItem).mockReturnValue(OWNED_MONSTER)
      vi.mocked(useCurrentItems).mockReturnValue([OWNED_MONSTER])
      render(<DetailView />)
      expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Eliminar/i })).toBeInTheDocument()
    })

    it('no muestra "Editar" ni "Eliminar" cuando el item no es propio', () => {
      vi.mocked(useSelectedItem).mockReturnValue(UNOWNED_MONSTER)
      vi.mocked(useCurrentItems).mockReturnValue([UNOWNED_MONSTER])
      render(<DetailView />)
      expect(screen.queryByRole('button', { name: /Editar/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Eliminar/i })).not.toBeInTheDocument()
    })
  })

  describe('Botón "Editar"', () => {
    it('activa isEditing al hacer click', () => {
      vi.mocked(useSelectedItem).mockReturnValue(OWNED_MONSTER)
      vi.mocked(useCurrentItems).mockReturnValue([OWNED_MONSTER])
      render(<DetailView />)
      fireEvent.click(screen.getByRole('button', { name: /Editar/i }))
      expect(useEncyclopediaStore.getState().isEditing).toBe(true)
    })
  })

  describe('Flujo de confirmación de borrado', () => {
    beforeEach(() => {
      vi.mocked(useSelectedItem).mockReturnValue(OWNED_MONSTER)
      vi.mocked(useCurrentItems).mockReturnValue([OWNED_MONSTER])
    })

    it('al hacer click en "Eliminar" muestra "Cancelar" y "Confirmar"', () => {
      render(<DetailView />)
      fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }))
      expect(screen.getByRole('button', { name: /Cancelar/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Confirmar/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Editar/i })).not.toBeInTheDocument()
    })

    it('al hacer click en "Cancelar" vuelve a mostrar "Editar" y "Eliminar"', () => {
      render(<DetailView />)
      fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }))
      fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }))
      expect(screen.getByRole('button', { name: /Editar/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Eliminar/i })).toBeInTheDocument()
    })
  })

  describe('Confirmar borrado', () => {
    it('elimina un monstruo y limpia la selección', async () => {
      vi.mocked(useSelectedItem).mockReturnValue(OWNED_MONSTER)
      vi.mocked(useCurrentItems).mockReturnValue([OWNED_MONSTER])
      deleteMonsterMock.mockResolvedValue({ success: true })
      act(() => {
        useEncyclopediaStore.setState({ activeSection: 'bestiary', selectedItemId: OWNED_MONSTER.id })
      })

      render(<DetailView />)
      fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }))
      fireEvent.click(screen.getByRole('button', { name: /Confirmar/i }))

      await waitFor(() => {
        expect(deleteMonsterMock).toHaveBeenCalledWith(OWNED_MONSTER.id)
      })
      expect(useEncyclopediaStore.getState().selectedItemId).toBeNull()
      expect(sileo.success).toHaveBeenCalledWith({
        title: 'Elemento eliminado',
        description: 'El elemento ha sido eliminado de la enciclopedia',
      })
    })

    it('elimina un personaje usando useDeleteCharacterTemplate', async () => {
      vi.mocked(useSelectedItem).mockReturnValue(OWNED_CHARACTER)
      vi.mocked(useCurrentItems).mockReturnValue([OWNED_CHARACTER])
      deleteCharacterMock.mockResolvedValue({ success: true })
      act(() => {
        useEncyclopediaStore.setState({ activeSection: 'cast', selectedItemId: OWNED_CHARACTER.id })
      })

      render(<DetailView />)
      fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }))
      fireEvent.click(screen.getByRole('button', { name: /Confirmar/i }))

      await waitFor(() => {
        expect(deleteCharacterMock).toHaveBeenCalledWith(OWNED_CHARACTER.id)
      })
    })

    it('elimina un objeto usando useDeleteItemTemplate', async () => {
      vi.mocked(useSelectedItem).mockReturnValue(OWNED_ITEM)
      vi.mocked(useCurrentItems).mockReturnValue([OWNED_ITEM])
      deleteItemMock.mockResolvedValue({ success: true })
      act(() => {
        useEncyclopediaStore.setState({ activeSection: 'museum', selectedItemId: OWNED_ITEM.id })
      })

      render(<DetailView />)
      fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }))
      fireEvent.click(screen.getByRole('button', { name: /Confirmar/i }))

      await waitFor(() => {
        expect(deleteItemMock).toHaveBeenCalledWith(OWNED_ITEM.id)
      })
    })

    it('muestra un toast de error y conserva la selección si el borrado falla', async () => {
      vi.mocked(useSelectedItem).mockReturnValue(OWNED_MONSTER)
      vi.mocked(useCurrentItems).mockReturnValue([OWNED_MONSTER])
      deleteMonsterMock.mockResolvedValue({ success: false, error: 'No se pudo eliminar' })
      act(() => {
        useEncyclopediaStore.setState({ activeSection: 'bestiary', selectedItemId: OWNED_MONSTER.id })
      })

      render(<DetailView />)
      fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }))
      fireEvent.click(screen.getByRole('button', { name: /Confirmar/i }))

      await waitFor(() => {
        expect(sileo.error).toHaveBeenCalledWith({
          title: 'Error',
          description: 'No se pudo eliminar el elemento',
        })
      })
      expect(useEncyclopediaStore.getState().selectedItemId).toBe(OWNED_MONSTER.id)
    })

    it('muestra un toast de error si la mutación lanza una excepción', async () => {
      vi.mocked(useSelectedItem).mockReturnValue(OWNED_MONSTER)
      vi.mocked(useCurrentItems).mockReturnValue([OWNED_MONSTER])
      deleteMonsterMock.mockRejectedValue(new Error('network error'))
      act(() => {
        useEncyclopediaStore.setState({ activeSection: 'bestiary', selectedItemId: OWNED_MONSTER.id })
      })

      render(<DetailView />)
      fireEvent.click(screen.getByRole('button', { name: /Eliminar/i }))
      fireEvent.click(screen.getByRole('button', { name: /Confirmar/i }))

      await waitFor(() => {
        expect(sileo.error).toHaveBeenCalledWith({
          title: 'Error',
          description: 'No se pudo eliminar el elemento',
        })
      })
    })
  })
})
