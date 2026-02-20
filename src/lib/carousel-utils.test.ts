import { getCircularCarousel } from './carousel-utils'

describe('carousel-utils', () => {
  type TestItem = { id: number; value: string }
  const items: TestItem[] = [
    { id: 1, value: 'A' },
    { id: 2, value: 'B' },
    { id: 3, value: 'C' },
    { id: 4, value: 'D' },
    { id: 5, value: 'E' },
  ]

  describe('getCircularCarousel', () => {
    it('should return correct items for range 1 (3 items total)', () => {
      // activeIndex 0 (A) -> expects [E(-1), A(0), B(1)]
      const result = getCircularCarousel(items, 0, 1)

      expect(result).toHaveLength(3)
      expect(result[0].item.value).toBe('E')
      expect(result[0].position).toBe(-1)

      expect(result[1].item.value).toBe('A')
      expect(result[1].position).toBe(0)

      expect(result[2].item.value).toBe('B')
      expect(result[2].position).toBe(1)
    })

    it('should handle positive wrap-around correctly', () => {
      // activeIndex 4 (E) -> range 1 -> expects [D(-1), E(0), A(1)]
      const result = getCircularCarousel(items, 4, 1)

      expect(result[0].item.value).toBe('D')
      expect(result[1].item.value).toBe('E')
      expect(result[2].item.value).toBe('A') // Wrap to start
    })

    it('should handle negative activeIndex correctly', () => {
      // activeIndex -1 (should correspond to E) -> range 1 -> [D, E, A]
      const result = getCircularCarousel(items, -1, 1)

      expect(result[1].item.value).toBe('E')
    })

    it('should return empty array for empty input', () => {
      const result = getCircularCarousel([], 0, 3)
      expect(result).toEqual([])
    })

    it('should generate stable unique keys', () => {
      const result = getCircularCarousel(items, 0, 1)
      // Keys should depend on absolute index, not data content
      expect(result[0].key).toBe('carousel-item--1')
      expect(result[1].key).toBe('carousel-item-0')
      expect(result[2].key).toBe('carousel-item-1')
    })

    it('should handle large indices safely', () => {
      // Just ensuring it doesn't crash with large numbers
      const result = getCircularCarousel(items, 1000, 1)
      expect(result).toHaveLength(3)
    })
  })
})
