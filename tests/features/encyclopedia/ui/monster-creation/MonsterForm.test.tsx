import { useAuth } from '@clerk/nextjs'
import { useEncyclopediaStore } from '@/views/encyclopedia/model/encyclopediaStore'
import { MonsterForm } from '@/views/encyclopedia/ui/monster-creation/MonsterForm'
import type { MonsterTemplate } from '@prisma/client'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'
import { sileo } from 'sileo'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ─── Hoisted mock references ───────────────────────────────────────────────────

const { mockNotifyAuthRequired, mockMutateAsync, mockUpdateAsync } = vi.hoisted(() => ({
  mockNotifyAuthRequired: vi.fn(),
  mockMutateAsync: vi.fn(),
  mockUpdateAsync: vi.fn(),
}))

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/shared/lib/useNotifyAuthRequired', () => ({
  useNotifyAuthRequired: () => mockNotifyAuthRequired,
}))

vi.mock('@/views/encyclopedia/api/encyclopedia-mutations', () => ({
  useCreateMonster: () => ({ mutateAsync: mockMutateAsync }),
  useUpdateMonster: () => ({ mutateAsync: mockUpdateAsync }),
}))

vi.mock('@/views/encyclopedia/ui/monster-creation/MonsterAvatarPanel', () => ({
  MonsterAvatarPanel: () => <div data-testid="monster-avatar-panel" />,
}))

vi.mock('@/views/encyclopedia/ui/monster-creation/MonsterPortraitUploader', () => ({
  MonsterPortraitUploader: () => <div data-testid="monster-portrait-uploader" />,
}))

vi.mock('@/views/encyclopedia/ui/monster-creation/StatBoxWithControls', () => ({
  StatBoxWithControls: ({ label, fieldKey }: { label: string; fieldKey: string }) => (
    <div data-testid={`stat-${fieldKey}`}>{label}</div>
  ),
}))

vi.mock('@/shared/ui', () => ({
  ToggleButton: ({
    label,
    isActive,
    onToggle,
  }: {
    label: string
    isActive: boolean
    onToggle: () => void
  }) => (
    <button type="button" aria-pressed={isActive} onClick={onToggle}>
      {label}
    </button>
  ),
}))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeMonsterTemplate = (overrides: Partial<MonsterTemplate> = {}): MonsterTemplate => ({
  id: 'tpl-1',
  name: 'Lobo Sombrío',
  description: 'Un lobo que acecha en la oscuridad',
  type: 'Bestia',
  race: 'Bestia',
  characterClass: 'Desconocido',
  imageUrl: null,
  portraitImageUrl: null,
  challenge: 2,
  maxHp: 20,
  strength: 14,
  dexterity: 12,
  constitution: 10,
  intelligence: 3,
  wisdom: 10,
  charisma: 6,
  ac: 12,
  speed: 40,
  initiativeBonus: 1,
  perception: 11,
  abilities: null,
  authorId: 'user-1',
  isPublic: false,
  price: 0,
  version: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(useAuth).mockReturnValue({ userId: null } as never)
  act(() => {
    useEncyclopediaStore.setState({
      selectedItemId: null,
      isCreatingNew: true,
    })
  })
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fillRequiredFields() {
  fireEvent.change(screen.getByPlaceholderText('Nombre del monstruo'), {
    target: { value: 'Wyvern' },
  })
  fireEvent.change(screen.getByPlaceholderText('Tipo'), {
    target: { value: 'Bestia' },
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MonsterForm', () => {
  // ─── Renderizado ─────────────────────────────────────────────────────────────

  describe('Renderizado en modo "create"', () => {
    it('muestra el input de nombre con su placeholder', () => {
      render(<MonsterForm />)
      expect(screen.getByPlaceholderText('Nombre del monstruo')).toBeInTheDocument()
    })

    it('muestra el botón de envío con texto "Crear monstruo"', () => {
      render(<MonsterForm />)
      expect(screen.getByRole('button', { name: 'Crear monstruo' })).toBeInTheDocument()
    })

    it('renderiza los paneles de imágenes', () => {
      render(<MonsterForm />)
      expect(screen.getByTestId('monster-avatar-panel')).toBeInTheDocument()
      expect(screen.getByTestId('monster-portrait-uploader')).toBeInTheDocument()
    })

    it('renderiza las stat boxes de estadísticas principales', () => {
      render(<MonsterForm />)
      expect(screen.getByTestId('stat-ac')).toBeInTheDocument()
      expect(screen.getByTestId('stat-speed')).toBeInTheDocument()
      expect(screen.getByTestId('stat-maxHp')).toBeInTheDocument()
    })

    it('renderiza el toggle de visibilidad pública', () => {
      render(<MonsterForm />)
      expect(screen.getByRole('button', { name: 'Público' })).toBeInTheDocument()
    })
  })

  describe('Renderizado en modo "edit"', () => {
    it('muestra el botón de envío con texto "Guardar cambios"', () => {
      render(<MonsterForm mode="edit" initialData={makeMonsterTemplate()} />)
      expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
    })

    it('rellena el input de nombre con initialData', () => {
      render(<MonsterForm initialData={makeMonsterTemplate({ name: 'Dragón Rojo' })} />)
      expect(screen.getByDisplayValue('Dragón Rojo')).toBeInTheDocument()
    })
  })

  // ─── Toggle de visibilidad pública ───────────────────────────────────────────

  describe('Toggle de visibilidad pública', () => {
    it('comienza con aria-pressed false (isPublic: false por defecto)', () => {
      render(<MonsterForm />)
      expect(screen.getByRole('button', { name: 'Público' })).toHaveAttribute(
        'aria-pressed',
        'false'
      )
    })

    it('cambia aria-pressed a true al hacer click', async () => {
      render(<MonsterForm />)
      fireEvent.click(screen.getByRole('button', { name: 'Público' }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Público' })).toHaveAttribute(
          'aria-pressed',
          'true'
        )
      })
    })
  })

  // ─── Submit sin autenticación ─────────────────────────────────────────────────

  describe('Submit sin autenticación (userId null)', () => {
    it('llama a notifyAuthRequired y no llama a mutateAsync', async () => {
      vi.mocked(useAuth).mockReturnValue({ userId: null } as never)
      const { container } = render(<MonsterForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(mockNotifyAuthRequired).toHaveBeenCalledOnce()
        expect(mockMutateAsync).not.toHaveBeenCalled()
      })
    })

    it('no modifica el estado del store al bloquearse por auth', async () => {
      vi.mocked(useAuth).mockReturnValue({ userId: null } as never)
      const { container } = render(<MonsterForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => expect(mockNotifyAuthRequired).toHaveBeenCalledOnce())

      expect(useEncyclopediaStore.getState().selectedItemId).toBeNull()
      expect(useEncyclopediaStore.getState().isCreatingNew).toBe(true)
    })
  })

  // ─── Submit autenticado — mutación exitosa ────────────────────────────────────

  describe('Submit autenticado — mutación exitosa', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({ userId: 'user_123' } as never)
      mockMutateAsync.mockResolvedValue({ success: true, data: { id: 'monster-42' } })
    })

    it('llama a mutateAsync con los datos del formulario', async () => {
      const { container } = render(<MonsterForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledOnce())

      const callArg = mockMutateAsync.mock.calls[0][0]
      expect(callArg.name).toBe('Wyvern')
      expect(callArg.type).toBe('Bestia')
    })

    it('actualiza el store con el id del monstruo creado', async () => {
      const { container } = render(<MonsterForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(useEncyclopediaStore.getState().selectedItemId).toBe('monster-42')
      })
    })

    it('cierra el modo de creación en el store', async () => {
      const { container } = render(<MonsterForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(useEncyclopediaStore.getState().isCreatingNew).toBe(false)
      })
    })

    it('muestra el toast de éxito', async () => {
      const { container } = render(<MonsterForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(sileo.success).toHaveBeenCalledWith({
          title: 'Monstruo creado',
          description: 'El monstruo ha sido añadido al bestiario',
        })
      })
    })

    it('invoca el callback onSuccess', async () => {
      const mockOnSuccess = vi.fn()
      const { container } = render(<MonsterForm onSuccess={mockOnSuccess} />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => expect(mockOnSuccess).toHaveBeenCalledOnce())
    })
  })

  // ─── Submit autenticado — mutación devuelve failure ───────────────────────────

  describe('Submit autenticado — mutación devuelve failure', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({ userId: 'user_123' } as never)
    })

    it('muestra toast de error cuando result.success es false', async () => {
      mockMutateAsync.mockResolvedValueOnce({ success: false, error: 'DB error' })
      const { container } = render(<MonsterForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(sileo.error).toHaveBeenCalledWith({
          title: 'Error',
          description: 'No se pudo crear el monstruo',
        })
      })
    })

    it('no modifica el store si la mutación falla', async () => {
      mockMutateAsync.mockResolvedValueOnce({ success: false, error: 'DB error' })
      const { container } = render(<MonsterForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => expect(sileo.error).toHaveBeenCalledOnce())

      expect(useEncyclopediaStore.getState().selectedItemId).toBeNull()
      expect(useEncyclopediaStore.getState().isCreatingNew).toBe(true)
    })
  })

  // ─── Submit autenticado — mutación lanza excepción ────────────────────────────

  describe('Submit autenticado — mutación lanza excepción', () => {
    it('muestra toast de error cuando mutateAsync lanza', async () => {
      vi.mocked(useAuth).mockReturnValue({ userId: 'user_123' } as never)
      mockMutateAsync.mockRejectedValueOnce(new Error('Network error'))
      const { container } = render(<MonsterForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(sileo.error).toHaveBeenCalledWith({
          title: 'Error',
          description: 'No se pudo crear el monstruo',
        })
      })
    })
  })

  // ─── Submit en modo "edit" ────────────────────────────────────────────────────

  describe('Submit en modo "edit" — mutación exitosa', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({ userId: 'user_123' } as never)
      mockUpdateAsync.mockResolvedValue({ success: true, data: { id: 'tpl-1' } })
    })

    it('llama a updateMonster con el id y los datos del formulario', async () => {
      const { container } = render(
        <MonsterForm mode="edit" initialData={makeMonsterTemplate({ id: 'tpl-1' })} />
      )

      fireEvent.change(screen.getByPlaceholderText('Nombre del monstruo'), {
        target: { value: 'Wyvern Editado' },
      })
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => expect(mockUpdateAsync).toHaveBeenCalledOnce())

      const [id, data] = mockUpdateAsync.mock.calls[0][0] as [string, unknown]
      expect(id).toBe('tpl-1')
      expect((data as { name: string }).name).toBe('Wyvern Editado')
    })

    it('no llama a createMonster en modo edit', async () => {
      const { container } = render(
        <MonsterForm mode="edit" initialData={makeMonsterTemplate()} />
      )

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => expect(mockUpdateAsync).toHaveBeenCalledOnce())
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })

    it('muestra el toast de éxito de actualización', async () => {
      const { container } = render(
        <MonsterForm mode="edit" initialData={makeMonsterTemplate()} />
      )

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(sileo.success).toHaveBeenCalledWith({
          title: 'Monstruo actualizado',
          description: 'Los cambios han sido guardados en el bestiario',
        })
      })
    })

    it('actualiza el store con el id del monstruo editado', async () => {
      const { container } = render(
        <MonsterForm mode="edit" initialData={makeMonsterTemplate({ id: 'tpl-1' })} />
      )

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(useEncyclopediaStore.getState().selectedItemId).toBe('tpl-1')
      })
    })
  })

  describe('Submit en modo "edit" — mutación devuelve failure', () => {
    it('muestra toast de error de actualización cuando result.success es false', async () => {
      vi.mocked(useAuth).mockReturnValue({ userId: 'user_123' } as never)
      mockUpdateAsync.mockResolvedValueOnce({ success: false, error: 'DB error' })

      const { container } = render(
        <MonsterForm mode="edit" initialData={makeMonsterTemplate()} />
      )

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(sileo.error).toHaveBeenCalledWith({
          title: 'Error',
          description: 'No se pudo actualizar el monstruo',
        })
      })
    })
  })
})
