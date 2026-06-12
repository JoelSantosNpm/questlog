import { useAuth } from '@clerk/nextjs'
import { useEncyclopediaStore } from '@/views/encyclopedia/model/encyclopediaStore'
import { CharacterCreationView } from '@/views/encyclopedia/ui/character-creation/CharacterCreationView'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import { sileo } from 'sileo'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/views/encyclopedia/ui/character-creation/CharacterForm', () => ({
  CharacterForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <div data-testid="character-form">
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
  act(() => {
    useEncyclopediaStore.setState({ isCreatingNew: true, selectedItemId: null })
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
})
