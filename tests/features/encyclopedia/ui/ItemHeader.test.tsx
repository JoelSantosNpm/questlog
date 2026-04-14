import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ItemHeader } from '@/views/encyclopedia/ui/ItemHeader'
import type { BestiaryItem, CastItem, MuseumItem } from '@/views/encyclopedia/model/types'
import type { Rarity } from '@prisma/client'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

vi.mock('lucide-react', () => ({
  Info: () => <svg data-testid='icon-info' />,
}))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const BASE = {
  id: 'test-id',
  name: 'Bestia Prueba',
  description: 'Una descripción',
  imageUrl: null,
  portraitImageUrl: null,
  authorId: null,
  isPublished: true,
  price: 0,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const MONSTER: BestiaryItem = {
  ...BASE,
  type: 'Dragón',
  race: 'Draconiano',
  characterClass: 'Ninguna',
  challenge: 5,
  maxHp: 60,
  strength: 18,
  dexterity: 10,
  constitution: 16,
  intelligence: 10,
  wisdom: 10,
  charisma: 12,
  ac: 15,
  speed: 30,
  initiativeBonus: 0,
  perception: 12,
  abilities: null,
  section: 'bestiary',
}

const NPC: CastItem = {
  ...BASE,
  name: 'Taberna',
  type: 'Humano',
  race: 'Humano',
  characterClass: 'Posadero',
  maxHp: 12,
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 12,
  ac: 10,
  speed: 30,
  initiativeBonus: 0,
  perception: 10,
  abilities: null,
  section: 'cast',
}

const SWORD: MuseumItem = {
  ...BASE,
  name: 'Espada Legendaria',
  description: 'Una espada mítica',
  category: 'Arma',
  weight: 3,
  value: 5000,
  rarity: 'LEGENDARY' as Rarity,
  isPublic: true,
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0,
  ac: 0,
  speed: 0,
  initiativeBonus: 0,
  perception: 0,
  creatorId: null,
  section: 'museum',
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ItemHeader', () => {
  describe('Encabezado de sección', () => {
    it('muestra "Bestiario" en la sección bestiary', () => {
      render(<ItemHeader item={MONSTER} activeSection='bestiary' />)
      expect(screen.getByText('Bestiario')).toBeInTheDocument()
    })

    it('muestra "Elenco" en la sección cast', () => {
      render(<ItemHeader item={NPC} activeSection='cast' />)
      expect(screen.getByText('Elenco')).toBeInTheDocument()
    })

    it('muestra "Museo" en la sección museum', () => {
      render(<ItemHeader item={SWORD} activeSection='museum' />)
      expect(screen.getByText('Museo')).toBeInTheDocument()
    })
  })

  describe('Nombre del item', () => {
    it('muestra el nombre del monstruo', () => {
      render(<ItemHeader item={MONSTER} activeSection='bestiary' />)
      expect(screen.getByRole('heading', { name: 'Bestia Prueba' })).toBeInTheDocument()
    })

    it('muestra el nombre del NPC', () => {
      render(<ItemHeader item={NPC} activeSection='cast' />)
      expect(screen.getByRole('heading', { name: 'Taberna' })).toBeInTheDocument()
    })
  })

  describe('Subtítulos de categoría', () => {
    it('muestra el tipo del monstruo en bestiary', () => {
      render(<ItemHeader item={MONSTER} activeSection='bestiary' />)
      expect(screen.getByText('• Dragón')).toBeInTheDocument()
    })

    it('no muestra subtítulo de tipo en la sección cast', () => {
      render(<ItemHeader item={NPC} activeSection='cast' />)
      expect(screen.queryByText(/• Humano/)).not.toBeInTheDocument()
    })

    it('muestra la rareza del ítem en museum', () => {
      render(<ItemHeader item={SWORD} activeSection='museum' />)
      expect(screen.getByText('• LEGENDARY')).toBeInTheDocument()
    })

    it('no muestra rareza en la sección bestiary', () => {
      render(<ItemHeader item={MONSTER} activeSection='bestiary' />)
      expect(screen.queryByText(/LEGENDARY|COMMON|RARE/)).not.toBeInTheDocument()
    })
  })

  describe('Retrato (PortraitFrame)', () => {
    it('renderiza el retrato para la sección bestiary', () => {
      render(<ItemHeader item={MONSTER} activeSection='bestiary' />)
      // PortraitFrame renders a next/image → <img>
      expect(screen.getByRole('img', { name: 'Bestia Prueba' })).toBeInTheDocument()
    })

    it('renderiza el retrato para la sección cast', () => {
      render(<ItemHeader item={NPC} activeSection='cast' />)
      expect(screen.getByRole('img', { name: 'Taberna' })).toBeInTheDocument()
    })

    it('no renderiza retrato en la sección museum', () => {
      render(<ItemHeader item={SWORD} activeSection='museum' />)
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('usa portraitImageUrl como src del retrato cuando está disponible', () => {
      const withPortrait: BestiaryItem = {
        ...MONSTER,
        portraitImageUrl: 'https://example.com/portrait.png',
        imageUrl: 'https://example.com/fallback.png',
      }
      render(<ItemHeader item={withPortrait} activeSection='bestiary' />)
      const img = screen.getByRole('img', { name: 'Bestia Prueba' }) as HTMLImageElement
      expect(img.src).toContain('portrait.png')
    })
  })
})
