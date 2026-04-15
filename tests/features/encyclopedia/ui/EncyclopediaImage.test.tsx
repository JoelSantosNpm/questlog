import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EncyclopediaImage } from '@/views/encyclopedia/ui/EncyclopediaImage'
import type { BestiaryItem, MuseumItem } from '@/views/encyclopedia/model/types'
import type { Rarity } from '@prisma/client'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('next/image', () => ({
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    <img src={src} alt={alt} onError={onError} />
  ),
}))

vi.mock('lucide-react', () => ({
  OctagonAlert: () => <svg data-testid='icon-octagon-alert' />,
}))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MONSTER: BestiaryItem = {
  id: 'monster-1',
  name: 'Lobo',
  description: null,
  imageUrl: null,
  portraitImageUrl: null,
  authorId: null,
  isPublished: true,
  price: 0,
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  type: 'Bestia',
  race: 'Cánido',
  characterClass: 'Ninguna',
  challenge: 1,
  maxHp: 11,
  strength: 12,
  dexterity: 15,
  constitution: 12,
  intelligence: 3,
  wisdom: 12,
  charisma: 6,
  ac: 13,
  speed: 40,
  initiativeBonus: 2,
  perception: 13,
  abilities: null,
  section: 'bestiary',
}

const SWORD: MuseumItem = {
  id: 'sword-1',
  name: 'Espada',
  description: null,
  imageUrl: null,
  category: 'Arma',
  weight: 3,
  value: 1000,
  rarity: 'COMMON' as Rarity,
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
  createdAt: new Date(),
  updatedAt: new Date(),
  section: 'museum',
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('EncyclopediaImage', () => {
  describe('Indicador de imagen no disponible', () => {
    it('muestra el indicador cuando imageUrl es null', () => {
      render(<EncyclopediaImage item={MONSTER} section='bestiary' noBackground />)
      expect(screen.getByTitle('URL de avatar no disponible')).toBeInTheDocument()
    })

    it('no muestra el indicador cuando la imagen no ha fallado aún', () => {
      const withUrl: BestiaryItem = { ...MONSTER, imageUrl: 'https://example.com/img.png' }
      render(<EncyclopediaImage item={withUrl} section='bestiary' noBackground />)
      expect(screen.queryByTitle('URL de avatar no disponible')).not.toBeInTheDocument()
    })

    it('muestra el indicador cuando la URL de imageUrl falla al cargarse', () => {
      const withUrl: BestiaryItem = { ...MONSTER, imageUrl: 'https://example.com/broken.png' }
      render(<EncyclopediaImage item={withUrl} section='bestiary' noBackground />)
      fireEvent.error(screen.getByRole('img', { name: 'Lobo' }))
      expect(screen.getByTitle('URL de avatar no disponible')).toBeInTheDocument()
    })

    it('muestra el indicador cuando portraitImageUrl falla al cargarse', () => {
      const withPortrait: BestiaryItem = {
        ...MONSTER,
        portraitImageUrl: 'https://example.com/broken-portrait.png',
      }
      render(<EncyclopediaImage item={withPortrait} section='bestiary' noBackground />)
      fireEvent.error(screen.getByRole('img', { name: 'Lobo' }))
      expect(screen.getByTitle('URL de avatar no disponible')).toBeInTheDocument()
    })

    it('muestra el indicador al segundo fallo cuando se proporcionan imageUrl y portraitImageUrl', () => {
      const withBoth: BestiaryItem = {
        ...MONSTER,
        imageUrl: 'https://example.com/broken.png',
        portraitImageUrl: 'https://example.com/broken-portrait.png',
      }
      render(<EncyclopediaImage item={withBoth} section='bestiary' noBackground />)
      const img = screen.getByRole('img', { name: 'Lobo' })
      // Primer fallo: pasa al segundo fallback (portraitImageUrl), badge ya visible
      fireEvent.error(img)
      expect(screen.getByTitle('URL de avatar no disponible')).toBeInTheDocument()
    })

    it('muestra el indicador para ítems de museo sin imageUrl', () => {
      render(<EncyclopediaImage item={SWORD} section='museum' noBackground />)
      expect(screen.getByTitle('URL de avatar no disponible')).toBeInTheDocument()
    })

    it('muestra el indicador para ítems de museo cuando imageUrl falla', () => {
      const withUrl: MuseumItem = { ...SWORD, imageUrl: 'https://example.com/broken-item.png' }
      render(<EncyclopediaImage item={withUrl} section='museum' noBackground />)
      fireEvent.error(screen.getByRole('img', { name: 'Espada' }))
      expect(screen.getByTitle('URL de avatar no disponible')).toBeInTheDocument()
    })
  })

  describe('Callback onMissingChange', () => {
    it('llama a onMissingChange(true) inmediatamente cuando imageUrl es null', () => {
      const onMissingChange = vi.fn()
      render(
        <EncyclopediaImage
          item={MONSTER}
          section='bestiary'
          noBackground
          onMissingChange={onMissingChange}
        />
      )
      expect(onMissingChange).toHaveBeenCalledWith(true)
    })

    it('no llama a onMissingChange(true) cuando la imagen carga correctamente', () => {
      const onMissingChange = vi.fn()
      const withUrl: BestiaryItem = { ...MONSTER, imageUrl: 'https://example.com/img.png' }
      render(
        <EncyclopediaImage
          item={withUrl}
          section='bestiary'
          noBackground
          onMissingChange={onMissingChange}
        />
      )
      // Con URL válida y sin error, el callback no debe recibir true
      expect(onMissingChange).not.toHaveBeenCalledWith(true)
    })

    it('llama a onMissingChange(true) cuando la URL de un ítem de museo falla', () => {
      const onMissingChange = vi.fn()
      const withUrl: MuseumItem = { ...SWORD, imageUrl: 'https://example.com/broken-item.png' }
      render(
        <EncyclopediaImage
          item={withUrl}
          section='museum'
          noBackground
          onMissingChange={onMissingChange}
        />
      )
      fireEvent.error(screen.getByRole('img', { name: 'Espada' }))
      expect(onMissingChange).toHaveBeenCalledWith(true)
    })
  })
})
