import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useImageUploader } from '@/components/shared/ui/image-uploader/hooks/useImageUploader'
import { StorageService } from '@/services/storage-service'
import { useAuth } from '@clerk/nextjs'
import { sileo } from 'sileo'

// --- MOCKS ---

vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(),
}))

vi.mock('sileo', () => ({
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/services/storage-service', () => ({
  StorageService: {
    uploadFile: vi.fn(),
  },
}))

// Mock de URL methods
global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('Storage Feature - useImageUploader hook', () => {
  const mockOnUpload = vi.fn()
  const category = 'campaigns'

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue({
      userId: 'user_123',
      getToken: vi.fn().mockResolvedValue('fake-token'),
      isLoaded: true,
      isSignedIn: true,
    } as unknown as ReturnType<typeof useAuth>)
  })

  it('debe inicializarse con el estado correcto (idle)', () => {
    const { result } = renderHook(() => useImageUploader({ onUpload: mockOnUpload, category }))

    expect(result.current.file).toBeNull()
    expect(result.current.preview).toBeNull()
    expect(result.current.isUploading).toBe(false)
    expect(result.current.isSuccess).toBe(false)
  })

  it('debe procesar un archivo válido y generar previsualización', () => {
    const { result } = renderHook(() => useImageUploader({ onUpload: mockOnUpload, category }))
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })

    act(() => {
      result.current.processFile(file)
    })

    expect(result.current.file).toBe(file)
    expect(result.current.preview).toBe('blob:mock-url')
    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
  })

  it('debe rechazar archivos inválidos y mostrar error via Sileo', () => {
    const { result } = renderHook(() => useImageUploader({ onUpload: mockOnUpload, category }))
    // Archivo demasiado pesado (10MB)
    const heavyFile = new File(['a'.repeat(10 * 1024 * 1024)], 'heavy.png', { type: 'image/png' })

    act(() => {
      result.current.processFile(heavyFile)
    })

    expect(result.current.file).toBeNull()
    expect(sileo.error).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Anomalía en el Archivo',
      })
    )
  })

  it('debe gestionar el ciclo de subida exitoso', async () => {
    const { result } = renderHook(() => useImageUploader({ onUpload: mockOnUpload, category }))
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })
    const publicUrl = 'https://supabase.com/test.png'

    vi.mocked(StorageService.uploadFile).mockResolvedValue(publicUrl)

    // Primero procesamos el archivo
    act(() => {
      result.current.processFile(file)
    })

    // Ejecutamos la subida
    await act(async () => {
      await result.current.handleUpload()
    })

    expect(result.current.isUploading).toBe(false)
    expect(result.current.isSuccess).toBe(true)
    expect(mockOnUpload).toHaveBeenCalledWith(publicUrl)
    expect(sileo.success).toHaveBeenCalled()
  })

  it('debe gestionar errores en la subida', async () => {
    const { result } = renderHook(() => useImageUploader({ onUpload: mockOnUpload, category }))
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })

    vi.mocked(StorageService.uploadFile).mockRejectedValue(new Error('Fallo de red'))

    act(() => {
      result.current.processFile(file)
    })

    await act(async () => {
      await result.current.handleUpload()
    })

    expect(result.current.isUploading).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(sileo.error).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Fallo al Guardar',
        description: 'Fallo de red',
      })
    )
  })

  it('debe limpiar el estado al llamar a handleReset', () => {
    const { result } = renderHook(() => useImageUploader({ onUpload: mockOnUpload, category }))
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })

    act(() => {
      result.current.processFile(file)
    })

    // Simulamos un reset (pasamos el objeto evento mockeado)
    const mockEvent = {
      stopPropagation: vi.fn(),
    } as unknown as React.MouseEvent<HTMLButtonElement>

    act(() => {
      result.current.handleReset(mockEvent)
    })

    expect(result.current.file).toBeNull()
    expect(result.current.preview).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalled()
    expect(mockOnUpload).toHaveBeenCalledWith('')
  })
})
