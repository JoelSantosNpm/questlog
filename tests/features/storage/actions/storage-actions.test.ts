import { uploadAsset } from '@/shared/api/storage-actions'
import { auth } from '@clerk/nextjs/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// --- MOCKS ---

const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()

vi.mock('@/shared/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    storage: {
      from: vi.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })),
    },
  })),
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}))

// --- HELPERS ---

function makeFormData(file: File, storagePath: string): FormData {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('storagePath', storagePath)
  return fd
}

// --- TESTS ---

describe('Storage Feature - uploadAsset Server Action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(auth).mockResolvedValue({ userId: 'user_abc123' } as Awaited<ReturnType<typeof auth>>)
    mockUpload.mockResolvedValue({ error: null })
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn.example.com/img.png' } })
  })

  it('debe lanzar si el usuario no está autenticado', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>)

    const fd = makeFormData(new File(['x'], 'img.png', { type: 'image/png' }), 'assets')

    await expect(uploadAsset(fd)).rejects.toThrow('No autenticado')
  })

  it('debe lanzar si no se envía un File', async () => {
    const fd = new FormData()
    fd.append('file', 'not-a-file')
    fd.append('storagePath', 'assets')

    await expect(uploadAsset(fd)).rejects.toThrow('Archivo inválido')
  })

  it('debe lanzar si storagePath está vacío', async () => {
    const fd = new FormData()
    fd.append('file', new File(['x'], 'img.png', { type: 'image/png' }))
    fd.append('storagePath', '')

    await expect(uploadAsset(fd)).rejects.toThrow('storagePath requerido')
  })

  it('debe construir el filePath con {userId}/{storagePath}/...', async () => {
    const fd = makeFormData(new File(['x'], 'foto.png', { type: 'image/png' }), 'campaigns/camp42')

    await uploadAsset(fd)

    const [calledPath] = mockUpload.mock.calls[0]
    expect(calledPath).toMatch(/^user_abc123\/campaigns\/camp42\/\d+-foto\.png$/)
  })

  it('debe sanitizar el nombre del archivo', async () => {
    const fd = makeFormData(
      new File(['x'], 'Mi Imagen De Prueba!!!.png', { type: 'image/png' }),
      'assets'
    )

    await uploadAsset(fd)

    const [calledPath] = mockUpload.mock.calls[0]
    expect(calledPath).toMatch(/mi_imagen_de_prueba___\.png$/)
  })

  it('debe propagar el error de Supabase', async () => {
    mockUpload.mockResolvedValue({ error: new Error('Bucket not found') })

    const fd = makeFormData(new File(['x'], 'img.png', { type: 'image/png' }), 'assets')

    await expect(uploadAsset(fd)).rejects.toThrow('Bucket not found')
  })

  it('debe devolver { publicUrl } en el caso exitoso', async () => {
    const fd = makeFormData(new File(['x'], 'img.png', { type: 'image/png' }), 'assets')

    const result = await uploadAsset(fd)

    expect(result).toEqual({ publicUrl: 'https://cdn.example.com/img.png' })
  })
})
