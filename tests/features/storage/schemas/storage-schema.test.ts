import { describe, it, expect } from 'vitest'
import { FileValidationSchema } from '@/shared/schemas/storage'

describe('Storage Feature - FileValidationSchema', () => {
  const createMockFile = (sizeInBytes: number, type: string) => {
    const file = new File(['a'.repeat(sizeInBytes)], 'test.png', { type })
    return file
  }

  it('debe aceptar archivos válidos (< 2MB y tipo imagen)', () => {
    const validFile = createMockFile(1 * 1024 * 1024, 'image/png')
    const result = FileValidationSchema.safeParse(validFile)
    expect(result.success).toBe(true)
  })

  it('debe rechazar archivos que superen los 2MB', () => {
    const heavyFile = createMockFile(3 * 1024 * 1024, 'image/png')
    const result = FileValidationSchema.safeParse(heavyFile)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('supera el tamaño máximo de 2MB')
    }
  })

  it('debe rechazar tipos de archivo no permitidos', () => {
    const invalidFile = createMockFile(1 * 1024 * 1024, 'application/pdf')
    const result = FileValidationSchema.safeParse(invalidFile)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Solo se aceptan archivos .jpg, .jpeg, .png y .webp')
    }
  })

  it('debe aceptar archivos .webp', () => {
    const webpFile = createMockFile(500 * 1024, 'image/webp')
    const result = FileValidationSchema.safeParse(webpFile)
    expect(result.success).toBe(true)
  })
})
