import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getEntityFallbacks,
  getPortraitFallbacks,
  STORAGE_PATHS,
} from '@/views/encyclopedia/lib/image-fallbacks'

// Fijamos la URL base para que los asserts no dependan de variables de entorno
beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
})

// ─── getEntityFallbacks ───────────────────────────────────────────────────────

describe('getEntityFallbacks', () => {
  describe('URLs válidas', () => {
    it('incluye una URL válida antes del default', () => {
      const result = getEntityFallbacks('bestiary', 'https://example.com/monster.png')
      expect(result[0]).toBe('https://example.com/monster.png')
    })

    it('incluye múltiples URLs válidas en orden antes del default', () => {
      const result = getEntityFallbacks('bestiary', 'https://a.com/1.png', 'https://b.com/2.png')
      expect(result[0]).toBe('https://a.com/1.png')
      expect(result[1]).toBe('https://b.com/2.png')
    })
  })

  describe('Filtrado de URLs inválidas', () => {
    it('filtra URLs null', () => {
      const result = getEntityFallbacks('bestiary', null)
      expect(result).toHaveLength(1) // solo el default
    })

    it('filtra URLs undefined', () => {
      const result = getEntityFallbacks('bestiary', undefined)
      expect(result).toHaveLength(1)
    })

    it('filtra strings vacíos', () => {
      const result = getEntityFallbacks('bestiary', '')
      expect(result).toHaveLength(1)
    })

    it('filtra strings de solo espacios', () => {
      const result = getEntityFallbacks('bestiary', '   ')
      expect(result).toHaveLength(1)
    })

    it('filtra nulls y conserva las URLs válidas', () => {
      const result = getEntityFallbacks('bestiary', null, 'https://valid.com/img.png', undefined)
      expect(result[0]).toBe('https://valid.com/img.png')
      expect(result).toHaveLength(2)
    })
  })

  describe('Default por sección', () => {
    it('usa MONSTER_DEFAULT para bestiary', () => {
      const result = getEntityFallbacks('bestiary')
      expect(result[result.length - 1]).toBe(STORAGE_PATHS.SYSTEM.MONSTER_DEFAULT)
    })

    it('usa NPC_DEFAULT para cast', () => {
      const result = getEntityFallbacks('cast')
      expect(result[result.length - 1]).toBe(STORAGE_PATHS.SYSTEM.NPC_DEFAULT)
    })

    it('usa ITEM_DEFAULT para museum', () => {
      const result = getEntityFallbacks('museum')
      expect(result[result.length - 1]).toBe(STORAGE_PATHS.SYSTEM.ITEM_DEFAULT)
    })

    it('el resultado siempre tiene al menos un elemento (el default)', () => {
      const result = getEntityFallbacks('bestiary', null, undefined, '')
      expect(result.length).toBeGreaterThanOrEqual(1)
    })
  })
})

// ─── getPortraitFallbacks ─────────────────────────────────────────────────────

describe('getPortraitFallbacks', () => {
  describe('Cadena de fallback', () => {
    it('usa portraitImageUrl como primera opción', () => {
      const result = getPortraitFallbacks(
        'bestiary',
        'https://portrait.com/p.png',
        'https://image.com/i.png'
      )
      expect(result[0]).toBe('https://portrait.com/p.png')
    })

    it('usa imageUrl como segunda opción si portraitImageUrl es null', () => {
      const result = getPortraitFallbacks('bestiary', null, 'https://image.com/i.png')
      expect(result[0]).toBe('https://image.com/i.png')
    })

    it('usa el default si ambas URLs son null', () => {
      const result = getPortraitFallbacks('bestiary', null, null)
      expect(result).toHaveLength(1)
      expect(result[0]).toBe(STORAGE_PATHS.SYSTEM.MONSTER_PORTRAIT_DEFAULT)
    })
  })

  describe('Default por sección', () => {
    it('usa MONSTER_PORTRAIT_DEFAULT para bestiary', () => {
      const result = getPortraitFallbacks('bestiary')
      expect(result[result.length - 1]).toBe(STORAGE_PATHS.SYSTEM.MONSTER_PORTRAIT_DEFAULT)
    })

    it('usa NPC_PORTRAIT_DEFAULT para cast', () => {
      const result = getPortraitFallbacks('cast')
      expect(result[result.length - 1]).toBe(STORAGE_PATHS.SYSTEM.NPC_PORTRAIT_DEFAULT)
    })
  })

  describe('Filtrado', () => {
    it('filtra URLs vacías o nulas antes del default', () => {
      const result = getPortraitFallbacks('cast', null, '', undefined)
      expect(result).toHaveLength(1)
    })
  })
})
