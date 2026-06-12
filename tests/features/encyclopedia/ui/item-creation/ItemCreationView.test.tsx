import { useAuth } from '@clerk/nextjs'
import { useEncyclopediaStore } from '@/views/encyclopedia/model/encyclopediaStore'
import { ItemCreationView } from '@/views/encyclopedia/ui/item-creation/ItemCreationView'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import { sileo } from 'sileo'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/views/encyclopedia/ui/item-creation/ItemForm', () => ({
  ItemForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <div data-testid="item-form">
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

describe('ItemCreationView', () => {
  describe('Renderizado', () => {
    it('muestra el botón "Volver"', () => {
      render(<ItemCreationView />)
      expect(screen.getByRole('button', { name: /Volver/i })).toBeInTheDocument()
    })

    it('muestra el badge "Creando objeto"', () => {
      render(<ItemCreationView />)
      expect(screen.getByText('Creando objeto')).toBeInTheDocument()
    })

    it('renderiza el ItemForm', () => {
      render(<ItemCreationView />)
      expect(screen.getByTestId('item-form')).toBeInTheDocument()
    })
  })

  describe('Botón "Volver"', () => {
    it('llama a setIsCreatingNew(false) al hacer click', async () => {
      render(<ItemCreationView />)
      fireEvent.click(screen.getByRole('button', { name: /Volver/i }))
      await waitFor(() => {
        expect(useEncyclopediaStore.getState().isCreatingNew).toBe(false)
      })
    })
  })

  describe('Toast de aviso a invitados', () => {
    it('muestra el toast cuando isLoaded=true y userId=null', async () => {
      vi.mocked(useAuth).mockReturnValue({ isLoaded: true, userId: null } as never)
      render(<ItemCreationView />)
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
      render(<ItemCreationView />)
      expect(sileo.warning).not.toHaveBeenCalled()
    })

    it('no muestra el toast cuando el usuario está autenticado', () => {
      vi.mocked(useAuth).mockReturnValue({ isLoaded: true, userId: 'user_123' } as never)
      render(<ItemCreationView />)
      expect(sileo.warning).not.toHaveBeenCalled()
    })
  })

  describe('Callback onSuccess del formulario', () => {
    it('cierra el modo creación al completarse el formulario', () => {
      vi.mocked(useAuth).mockReturnValue({ isLoaded: true, userId: 'user_123' } as never)
      render(<ItemCreationView />)
      fireEvent.click(screen.getByRole('button', { name: 'trigger-success' }))
      expect(useEncyclopediaStore.getState().isCreatingNew).toBe(false)
    })
  })
})
