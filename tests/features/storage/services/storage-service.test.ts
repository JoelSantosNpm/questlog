import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StorageService } from '@/shared/api/storage-service'
import { getSupabaseClient } from '@/shared/lib/supabase/client'

// Mock del cliente de Supabase
vi.mock('@/shared/lib/supabase/client', () => ({
  getSupabaseClient: vi.fn(),
}))

describe('Storage Feature - StorageService', () => {
  const mockUpload = vi.fn()
  const mockGetPublicUrl = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock de la cadena de llamadas de Supabase
    const mockSupabase = {
      storage: {
        from: vi.fn().mockReturnValue({
          upload: mockUpload,
          getPublicUrl: mockGetPublicUrl,
        }),
      },
    }

    vi.mocked(getSupabaseClient).mockReturnValue(
      mockSupabase as unknown as ReturnType<typeof getSupabaseClient>
    )
  })

  it('debe subir un archivo y devolver la URL pública', async () => {
    const mockFile = new File(['hello'], 'test-image.png', { type: 'image/png' })
    const mockPublicUrl = 'https://supabase.com/test-image.png'

    mockUpload.mockResolvedValue({ data: { path: 'any' }, error: null })
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: mockPublicUrl } })

    const result = await StorageService.uploadFile({
      file: mockFile,
      userId: 'user_123',
      category: 'campaigns',
      token: 'fake_token',
    })

    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringContaining('user_123/campaigns/'),
      mockFile,
      expect.objectContaining({ upsert: false })
    )
    expect(result).toBe(mockPublicUrl)
  })

  it('debe lanzar un error si la subida falla', async () => {
    const mockFile = new File(['hello'], 'test.png', { type: 'image/png' })
    const mockError = new Error('Supabase Storage Error')

    mockUpload.mockResolvedValue({ data: null, error: mockError })

    await expect(
      StorageService.uploadFile({
        file: mockFile,
        userId: 'user_123',
        category: 'campaigns',
        token: 'token',
      })
    ).rejects.toThrow('Supabase Storage Error')
  })

  it('debe sanitizar el nombre del archivo', async () => {
    const fileNameWithSpaces = 'Mi Imagen De Prueba!!!.png'
    const mockFile = new File(['hello'], fileNameWithSpaces, { type: 'image/png' })

    mockUpload.mockResolvedValue({ data: { path: 'any' }, error: null })
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'url' } })

    await StorageService.uploadFile({
      file: mockFile,
      userId: 'u',
      category: 'c',
      token: 't',
    })

    const calledPath = mockUpload.mock.calls[0][0]
    // Debe reemplazar caracteres especiales por '_' y pasar a minúsculas
    expect(calledPath).toMatch(/mi_imagen_de_prueba___\.png$/)
  })
})
