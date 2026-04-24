import { FileValidationSchema } from '@/shared/schemas/storage'
import { describe, expect, it } from 'vitest'

describe('Storage Feature - FileValidationSchema', () => {
  const createMockFile = (sizeInBytes: number, type: string) => {
    const file = new File(['a'.repeat(sizeInBytes)], 'test.png', { type })
    return file
  }

  it('debe aceptar archivos válidos (< 600kB y tipo imagen)', () => {
    const validFile = createMockFile(500 * 1024, 'image/png')
    const result = FileValidationSchema.safeParse(validFile)
    expect(result.success).toBe(true)
  })

  it('debe rechazar archivos que superen los 600kB', () => {
    const heavyFile = createMockFile(700 * 1024, 'image/png')
    const result = FileValidationSchema.safeParse(heavyFile)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('supera el tamaño máximo de 600kB')
    }
  })

  it('debe rechazar tipos de archivo no permitidos', () => {
    const invalidFile = createMockFile(100 * 1024, 'application/pdf') // 100kB: bajo el límite de tamaño
    const result = FileValidationSchema.safeParse(invalidFile)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain(
        'Solo se aceptan archivos .jpg, .jpeg, .png y .webp'
      )
    }
  })

  it('debe aceptar archivos .webp', () => {
    const webpFile = createMockFile(500 * 1024, 'image/webp')
    const result = FileValidationSchema.safeParse(webpFile)
    expect(result.success).toBe(true)
  })
})
