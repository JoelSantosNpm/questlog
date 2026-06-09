import { useAuth } from '@clerk/nextjs'
import { useEncyclopediaStore } from '@/views/encyclopedia/model/encyclopediaStore'
import { MonsterCreationView } from '@/views/encyclopedia/ui/monster-creation/MonsterCreationView'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import { sileo } from 'sileo'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/views/encyclopedia/ui/monster-creation/MonsterForm', () => ({
  MonsterForm: ({ onSuccess }: { onSuccess?: () => void }) => (
    <div data-testid="monster-form">
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

describe('MonsterCreationView', () => {
  describe('Renderizado', () => {
    it('muestra el botón "Volver"', () => {
      render(<MonsterCreationView />)
      expect(screen.getByRole('button', { name: /Volver/i })).toBeInTheDocument()
    })

    it('muestra el badge "Creando monstruo"', () => {
      render(<MonsterCreationView />)
      expect(screen.getByText('Creando monstruo')).toBeInTheDocument()
    })

    it('renderiza el MonsterForm', () => {
      render(<MonsterCreationView />)
      expect(screen.getByTestId('monster-form')).toBeInTheDocument()
    })
  })

  describe('Botón "Volver"', () => {
    it('llama a setIsCreatingNew(false) al hacer click', () => {
      render(<MonsterCreationView />)
      fireEvent.click(screen.getByRole('button', { name: /Volver/i }))
      expect(useEncyclopediaStore.getState().isCreatingNew).toBe(false)
    })
  })

  describe('Toast de aviso a invitados', () => {
    it('muestra el toast cuando isLoaded=true y userId=null', async () => {
      vi.mocked(useAuth).mockReturnValue({ isLoaded: true, userId: null } as never)
      render(<MonsterCreationView />)
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
      render(<MonsterCreationView />)
      expect(sileo.warning).not.toHaveBeenCalled()
    })

    it('no muestra el toast cuando el usuario está autenticado', () => {
      vi.mocked(useAuth).mockReturnValue({ isLoaded: true, userId: 'user_123' } as never)
      render(<MonsterCreationView />)
      expect(sileo.warning).not.toHaveBeenCalled()
    })
  })

  describe('Callback onSuccess del formulario', () => {
    it('cierra el modo creación al completarse el formulario', () => {
      vi.mocked(useAuth).mockReturnValue({ isLoaded: true, userId: 'user_123' } as never)
      render(<MonsterCreationView />)
      fireEvent.click(screen.getByRole('button', { name: 'trigger-success' }))
      expect(useEncyclopediaStore.getState().isCreatingNew).toBe(false)
    })
  })
})
