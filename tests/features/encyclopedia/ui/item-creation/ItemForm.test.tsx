import { useAuth } from '@clerk/nextjs'
import { useEncyclopediaStore } from '@/views/encyclopedia/model/encyclopediaStore'
import { ItemForm } from '@/views/encyclopedia/ui/item-creation/ItemForm'
import type { ItemTemplate } from '@prisma/client'
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
  useCreateItemTemplate: () => ({ mutateAsync: mockMutateAsync }),
  useUpdateItemTemplate: () => ({ mutateAsync: mockUpdateAsync }),
}))

vi.mock('@/views/encyclopedia/ui/creation/AvatarPanel', () => ({
  AvatarPanel: () => <div data-testid="avatar-panel" />,
}))

vi.mock('@/views/encyclopedia/ui/creation/StatBoxWithControls', () => ({
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

const makeItemTemplate = (overrides: Partial<ItemTemplate> = {}): ItemTemplate => ({
  id: 'tpl-1',
  name: 'Espada Larga +1',
  description: 'Una espada élfica encantada',
  imageUrl: null,
  category: 'Arma',
  weight: 1.5,
  value: 100,
  rarity: 'UNCOMMON',
  isPublic: false,
  strength: 1,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0,
  ac: 0,
  speed: 0,
  initiativeBonus: 0,
  perception: 0,
  creatorId: 'user-1',
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
  fireEvent.change(screen.getByPlaceholderText('Nombre del objeto'), {
    target: { value: 'Daga Sombría' },
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ItemForm', () => {
  // ─── Renderizado ─────────────────────────────────────────────────────────────

  describe('Renderizado en modo "create"', () => {
    it('muestra el input de nombre con su placeholder', () => {
      render(<ItemForm />)
      expect(screen.getByPlaceholderText('Nombre del objeto')).toBeInTheDocument()
    })

    it('muestra el botón de envío con texto "Crear objeto"', () => {
      render(<ItemForm />)
      expect(screen.getByRole('button', { name: 'Crear objeto' })).toBeInTheDocument()
    })

    it('renderiza el panel de imagen (sin retrato)', () => {
      render(<ItemForm />)
      expect(screen.getByTestId('avatar-panel')).toBeInTheDocument()
      expect(screen.queryByTestId('portrait-uploader')).not.toBeInTheDocument()
    })

    it('renderiza las stat boxes de modificadores', () => {
      render(<ItemForm />)
      expect(screen.getByTestId('stat-ac')).toBeInTheDocument()
      expect(screen.getByTestId('stat-speed')).toBeInTheDocument()
      expect(screen.getByTestId('stat-strength')).toBeInTheDocument()
    })

    it('renderiza el toggle de visibilidad pública', () => {
      render(<ItemForm />)
      expect(screen.getByRole('button', { name: 'Público' })).toBeInTheDocument()
    })

    it('muestra los encabezados de Propiedades y Modificadores', () => {
      render(<ItemForm />)
      expect(screen.getByText('Propiedades')).toBeInTheDocument()
      expect(screen.getByText('Modificadores')).toBeInTheDocument()
    })
  })

  describe('Campos de Propiedades', () => {
    it('muestra el campo de categoría con su valor por defecto', () => {
      render(<ItemForm />)
      expect(screen.getByDisplayValue('General')).toBeInTheDocument()
    })

    it('muestra el selector de rareza con todas las opciones', () => {
      render(<ItemForm />)
      const select = screen.getByRole('combobox')
      const options = Array.from(select.querySelectorAll('option')).map((o) => o.textContent)
      expect(options).toEqual(['Basura', 'Común', 'Infrecuente', 'Rara', 'Épica', 'Legendaria', 'Artefacto'])
    })

    it('la rareza por defecto es COMMON', () => {
      render(<ItemForm />)
      expect(screen.getByRole('combobox')).toHaveValue('COMMON')
    })

    it('muestra los campos numéricos de valor y peso con sus valores por defecto', () => {
      render(<ItemForm />)
      const spinbuttons = screen.getAllByRole('spinbutton')
      expect(spinbuttons[0]).toHaveValue(0) // value
      expect(spinbuttons[1]).toHaveValue(0) // weight
    })
  })

  describe('Renderizado en modo "edit"', () => {
    it('muestra el botón de envío con texto "Guardar cambios"', () => {
      render(<ItemForm mode="edit" initialData={makeItemTemplate()} />)
      expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
    })

    it('rellena el input de nombre con initialData', () => {
      render(<ItemForm initialData={makeItemTemplate({ name: 'Escudo de Roble' })} />)
      expect(screen.getByDisplayValue('Escudo de Roble')).toBeInTheDocument()
    })

    it('rellena la rareza con el valor de initialData', () => {
      render(<ItemForm initialData={makeItemTemplate({ rarity: 'RARE' })} />)
      expect(screen.getByRole('combobox')).toHaveValue('RARE')
    })
  })

  // ─── Toggle de visibilidad pública ───────────────────────────────────────────

  describe('Toggle de visibilidad pública', () => {
    it('comienza con aria-pressed false (isPublic: false por defecto)', () => {
      render(<ItemForm />)
      expect(screen.getByRole('button', { name: 'Público' })).toHaveAttribute(
        'aria-pressed',
        'false'
      )
    })

    it('cambia aria-pressed a true al hacer click', async () => {
      render(<ItemForm />)
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
      const { container } = render(<ItemForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(mockNotifyAuthRequired).toHaveBeenCalledOnce()
        expect(mockMutateAsync).not.toHaveBeenCalled()
      })
    })

    it('no modifica el estado del store al bloquearse por auth', async () => {
      vi.mocked(useAuth).mockReturnValue({ userId: null } as never)
      const { container } = render(<ItemForm />)

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
      mockMutateAsync.mockResolvedValue({ success: true, data: { id: 'item-42' } })
    })

    it('llama a mutateAsync con los datos del formulario', async () => {
      const { container } = render(<ItemForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledOnce())

      const callArg = mockMutateAsync.mock.calls[0][0]
      expect(callArg.name).toBe('Daga Sombría')
      expect(callArg.rarity).toBe('COMMON')
    })

    it('actualiza el store con el id del objeto creado', async () => {
      const { container } = render(<ItemForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(useEncyclopediaStore.getState().selectedItemId).toBe('item-42')
      })
    })

    it('cierra el modo de creación en el store', async () => {
      const { container } = render(<ItemForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(useEncyclopediaStore.getState().isCreatingNew).toBe(false)
      })
    })

    it('muestra el toast de éxito', async () => {
      const { container } = render(<ItemForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(sileo.success).toHaveBeenCalledWith({
          title: 'Objeto creado',
          description: 'El objeto ha sido añadido al museo',
        })
      })
    })

    it('invoca el callback onSuccess', async () => {
      const mockOnSuccess = vi.fn()
      const { container } = render(<ItemForm onSuccess={mockOnSuccess} />)

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
      const { container } = render(<ItemForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(sileo.error).toHaveBeenCalledWith({
          title: 'Error',
          description: 'No se pudo crear el objeto',
        })
      })
    })

    it('no modifica el store si la mutación falla', async () => {
      mockMutateAsync.mockResolvedValueOnce({ success: false, error: 'DB error' })
      const { container } = render(<ItemForm />)

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
      const { container } = render(<ItemForm />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(sileo.error).toHaveBeenCalledWith({
          title: 'Error',
          description: 'No se pudo crear el objeto',
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

    it('llama a updateItemTemplate con el id y los datos del formulario', async () => {
      const { container } = render(
        <ItemForm mode="edit" initialData={makeItemTemplate({ id: 'tpl-1' })} />
      )

      fireEvent.change(screen.getByPlaceholderText('Nombre del objeto'), {
        target: { value: 'Espada Editada' },
      })
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => expect(mockUpdateAsync).toHaveBeenCalledOnce())

      const [id, data] = mockUpdateAsync.mock.calls[0][0] as [string, unknown]
      expect(id).toBe('tpl-1')
      expect((data as { name: string }).name).toBe('Espada Editada')
    })

    it('no llama a createItemTemplate en modo edit', async () => {
      const { container } = render(<ItemForm mode="edit" initialData={makeItemTemplate()} />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => expect(mockUpdateAsync).toHaveBeenCalledOnce())
      expect(mockMutateAsync).not.toHaveBeenCalled()
    })

    it('muestra el toast de éxito de actualización', async () => {
      const { container } = render(<ItemForm mode="edit" initialData={makeItemTemplate()} />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(sileo.success).toHaveBeenCalledWith({
          title: 'Objeto actualizado',
          description: 'Los cambios han sido guardados en el museo',
        })
      })
    })

    it('actualiza el store con el id del objeto editado', async () => {
      const { container } = render(
        <ItemForm mode="edit" initialData={makeItemTemplate({ id: 'tpl-1' })} />
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

      const { container } = render(<ItemForm mode="edit" initialData={makeItemTemplate()} />)

      fillRequiredFields()
      fireEvent.submit(container.querySelector('form')!)

      await waitFor(() => {
        expect(sileo.error).toHaveBeenCalledWith({
          title: 'Error',
          description: 'No se pudo actualizar el objeto',
        })
      })
    })
  })
})
