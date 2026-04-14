import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { ListView } from '@/views/encyclopedia/ui/ListView'
import { useEncyclopediaStore } from '@/views/encyclopedia/model/encyclopediaStore'
import type { BestiaryItem } from '@/views/encyclopedia/model/types'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeMonster = (id: string, name: string, description = ''): BestiaryItem => ({
  id,
  name,
  description,
  type: 'Bestia',
  race: 'Desconocido',
  characterClass: 'Ninguna',
  imageUrl: null,
  portraitImageUrl: null,
  challenge: 1,
  maxHp: 10,
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 3,
  wisdom: 10,
  charisma: 6,
  ac: 10,
  speed: 30,
  initiativeBonus: 0,
  perception: 10,
  abilities: null,
  authorId: null,
  isPublished: true,
  price: 0,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  section: 'bestiary',
})

const ITEMS = [
  makeMonster('id-1', 'Lobo', 'Un lobo feroz'),
  makeMonster('id-2', 'Araña Gigante', 'Una araña enorme'),
  makeMonster('id-3', 'Dragón Rojo', 'Un dragón de fuego'),
]

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  act(() => {
    useEncyclopediaStore.setState({
      activeSection: 'bestiary',
      selectedItemId: null,
      itemsBySection: { bestiary: ITEMS, cast: [], museum: [] },
    })
  })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ListView', () => {
  describe('Renderizado inicial', () => {
    it('muestra todos los items', () => {
      render(<ListView items={ITEMS} />)
      expect(screen.getByText('Lobo')).toBeInTheDocument()
      expect(screen.getByText('Araña Gigante')).toBeInTheDocument()
      expect(screen.getByText('Dragón Rojo')).toBeInTheDocument()
    })

    it('muestra la descripción de cada item', () => {
      render(<ListView items={ITEMS} />)
      expect(screen.getByText('Un lobo feroz')).toBeInTheDocument()
    })

    it('muestra el input de búsqueda', () => {
      render(<ListView items={ITEMS} />)
      expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
    })
  })

  describe('Filtrado por búsqueda', () => {
    it('filtra items por nombre', () => {
      render(<ListView items={ITEMS} />)
      fireEvent.change(screen.getByPlaceholderText('Buscar...'), { target: { value: 'lobo' } })
      expect(screen.getByText('Lobo')).toBeInTheDocument()
      expect(screen.queryByText('Araña Gigante')).not.toBeInTheDocument()
      expect(screen.queryByText('Dragón Rojo')).not.toBeInTheDocument()
    })

    it('la búsqueda es insensible a mayúsculas', () => {
      render(<ListView items={ITEMS} />)
      fireEvent.change(screen.getByPlaceholderText('Buscar...'), { target: { value: 'DRAGÓN' } })
      expect(screen.getByText('Dragón Rojo')).toBeInTheDocument()
    })

    it('muestra el mensaje vacío si no hay resultados', () => {
      render(<ListView items={ITEMS} />)
      fireEvent.change(screen.getByPlaceholderText('Buscar...'), { target: { value: 'xyzxyz' } })
      expect(screen.getByText('No se han encontrado registros.')).toBeInTheDocument()
    })

    it('muestra todos los items al borrar la búsqueda', () => {
      render(<ListView items={ITEMS} />)
      const input = screen.getByPlaceholderText('Buscar...')
      fireEvent.change(input, { target: { value: 'lobo' } })
      fireEvent.change(input, { target: { value: '' } })
      expect(screen.getByText('Araña Gigante')).toBeInTheDocument()
    })
  })

  describe('Selección de items', () => {
    it('llama a setSelectedItemId al hacer click en un item', () => {
      render(<ListView items={ITEMS} />)
      fireEvent.click(screen.getByText('Araña Gigante'))
      expect(useEncyclopediaStore.getState().selectedItemId).toBe('id-2')
    })

    it('llama a onSelect si se proporciona', () => {
      const onSelect = vi.fn()
      render(<ListView items={ITEMS} onSelect={onSelect} />)
      fireEvent.click(screen.getByText('Lobo'))
      expect(onSelect).toHaveBeenCalledOnce()
    })

    it('resalta el item cuyo id coincide con selectedItemId', () => {
      act(() => useEncyclopediaStore.getState().setSelectedItemId('id-3'))
      render(<ListView items={ITEMS} />)
      const button = screen.getByText('Dragón Rojo').closest('button')
      expect(button?.className).toMatch(/amber/)
    })

    it('resalta items[0] cuando selectedItemId es null', () => {
      render(<ListView items={ITEMS} />)
      const button = screen.getByText('Lobo').closest('button')
      expect(button?.className).toMatch(/amber/)
    })
  })

  describe('Lista vacía', () => {
    it('no muestra items si el array está vacío', () => {
      render(<ListView items={[]} />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })
})
