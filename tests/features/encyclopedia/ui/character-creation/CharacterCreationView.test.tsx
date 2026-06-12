import { useAuth } from '@clerk/nextjs'
import { useSelectedItem } from '@/views/encyclopedia/lib/use-encyclopedia-items'
import { useEncyclopediaStore } from '@/views/encyclopedia/model/encyclopediaStore'
import { CharacterCreationView } from '@/views/encyclopedia/ui/character-creation/CharacterCreationView'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import { sileo } from 'sileo'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toCastItem } from '../../../../mocks/db'

vi.mock('@/views/encyclopedia/lib/use-encyclopedia-items', () => ({
  useSelectedItem: vi.fn(() => undefined),
}))

vi.mock('@/views/encyclopedia/ui/character-creation/CharacterForm', () => ({
  CharacterForm: ({
    mode,
    initialData,
    onSuccess,
  }: {
    mode?: string
    initialData?: { id: string }
    onSuccess?: () => void
  }) => (
    <div data-testid="character-form" data-mode={mode} data-initial-id={initialData?.id}>
      <button type="button" onClick={onSuccess}>
        trigger-success
      </button>
    </div>
  ),
}))

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(useAuth).mockReturnValue({ isLoaded: true, userId: null } as never)
  vi.mocked(useSelectedItem).mockReturnValue(undefined)
  act(() => {
    useEncyclopediaStore.setState({ isCreatingNew: true, isEditing: false, selectedItemId: null })
  })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CharacterCreationView', () => {
  describe('Renderizado', () => {
    it('muestra el botón "Volver"', () => {
      render(<CharacterCreationView />)
      expect(screen.getByRole('button', { name: /Volver/i })).toBeInTheDocument()
    })

    it('muestra el badge "Creando personaje"', () => {
      render(<CharacterCreationView />)
      expect(screen.getByText('Creando personaje')).toBeInTheDocument()
    })

    it('renderiza el CharacterForm', () => {
      render(<CharacterCreationView />)
      expect(screen.getByTestId('character-form')).toBeInTheDocument()
    })
  })

  describe('Botón "Volver"', () => {
    it('llama a setIsCreatingNew(false) al hacer click', async () => {
      render(<CharacterCreationView />)
      fireEvent.click(screen.getByRole('button', { name: /Volver/i }))
      await waitFor(() => {
        expect(useEncyclopediaStore.getState().isCreatingNew).toBe(false)
      })
    })
  })

  describe('Toast de aviso a invitados', () => {
    it('muestra el toast cuando isLoaded=true y userId=null', async () => {
      vi.mocked(useAuth).mockReturnValue({ isLoaded: true, userId: null } as never)
      render(<CharacterCreationView />)
      await waitFor(() => {
        expect(sileo.warning).toHaveBeenCalledWith({
          title: 'No has iniciado sesión',
          description:
            'Puedes explorar el formulario, pero necesitarás iniciar sesión para guardar tu creación.',
        })
      })
    })

    it('no muestra el toast cuando isLoaded=false (aún cargando auth)', () => {
      vi.mocked(useAuth).mockReturnValue({ isLoaded: false, userId: null } as never)
      render(<CharacterCreationView />)
      expect(sileo.warning).not.toHaveBeenCalled()
    })

    it('no muestra el toast cuando el usuario está autenticado', () => {
      vi.mocked(useAuth).mockReturnValue({ isLoaded: true, userId: 'user_123' } as never)
      render(<CharacterCreationView />)
      expect(sileo.warning).not.toHaveBeenCalled()
    })
  })

  describe('Callback onSuccess del formulario', () => {
    it('cierra el modo creación al completarse el formulario', () => {
      vi.mocked(useAuth).mockReturnValue({ isLoaded: true, userId: 'user_123' } as never)
      render(<CharacterCreationView />)
      fireEvent.click(screen.getByRole('button', { name: 'trigger-success' }))
      expect(useEncyclopediaStore.getState().isCreatingNew).toBe(false)
    })
  })

  describe('Modo edición', () => {
    const CHARACTER = toCastItem({ name: 'Valerius Editable' }, true)

    beforeEach(() => {
      vi.mocked(useSelectedItem).mockReturnValue(CHARACTER)
      act(() => {
        useEncyclopediaStore.setState({
          isCreatingNew: false,
          isEditing: true,
          selectedItemId: CHARACTER.id,
        })
      })
    })

    it('muestra el badge "Editando personaje"', () => {
      render(<CharacterCreationView />)
      expect(screen.getByText('Editando personaje')).toBeInTheDocument()
    })

    it('pasa mode="edit" e initialData al CharacterForm', () => {
      render(<CharacterCreationView />)
      const form = screen.getByTestId('character-form')
      expect(form).toHaveAttribute('data-mode', 'edit')
      expect(form).toHaveAttribute('data-initial-id', CHARACTER.id)
    })

    it('el botón "Volver" desactiva isEditing', async () => {
      render(<CharacterCreationView />)
      fireEvent.click(screen.getByRole('button', { name: /Volver/i }))
      await waitFor(() => {
        expect(useEncyclopediaStore.getState().isEditing).toBe(false)
      })
    })

    it('onSuccess desactiva isEditing', () => {
      render(<CharacterCreationView />)
      fireEvent.click(screen.getByRole('button', { name: 'trigger-success' }))
      expect(useEncyclopediaStore.getState().isEditing).toBe(false)
    })
  })
})
