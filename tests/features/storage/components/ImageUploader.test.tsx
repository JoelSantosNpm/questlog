import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ImageUploader from '@/shared/ui/image-uploader/ImageUploader'
import { StorageService } from '@/shared/api/storage-service'
import { useAuth } from '@clerk/nextjs'

// --- MOCKS ---

// Mock de Clerk
vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(),
}))

// Mock de Sileo
vi.mock('sileo', () => ({
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock del servicio de Storage
vi.mock('@/shared/api/storage-service', () => ({
  StorageService: {
    uploadFile: vi.fn(),
  },
}))

// Mock de URL methods para JSDOM
global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('Storage Feature - ImageUploader UI', () => {
  const mockOnUpload = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue({
      userId: 'user_123',
      getToken: vi.fn().mockResolvedValue('fake-token'),
      isLoaded: true,
      isSignedIn: true,
    } as unknown as ReturnType<typeof useAuth>)
  })

  it('debe renderizar el estado inicial vacío', () => {
    render(<ImageUploader onUpload={mockOnUpload} label='Ilustración' />)

    expect(screen.getByText(/Ilustración/)).toBeInTheDocument()
    expect(screen.getByText(/Seleccionar Imagen/i)).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('debe mostrar una previsualización al seleccionar un archivo', () => {
    render(<ImageUploader onUpload={mockOnUpload} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })

    // Simular selección de archivo
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByAltText('Vista previa')).toBeInTheDocument()
    expect(screen.getByAltText('Vista previa')).toHaveAttribute(
      'src',
      expect.stringContaining('mock-url')
    )
    expect(screen.getByText(/Confirmar/i)).toBeInTheDocument()
    expect(screen.getByText(/Descartar/i)).toBeInTheDocument()
  })

  it('debe permitir descartar la selección', () => {
    render(<ImageUploader onUpload={mockOnUpload} />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })

    fireEvent.change(input, { target: { files: [file] } })

    const discardButton = screen.getByText(/Descartar/i)
    fireEvent.click(discardButton)

    expect(screen.queryByAltText('Vista previa')).not.toBeInTheDocument()
    expect(screen.getByText(/Seleccionar Imagen/i)).toBeInTheDocument()
  })

  it('debe llamar al servicio de subida al confirmar', async () => {
    vi.mocked(StorageService.uploadFile).mockResolvedValue('https://public.url/img.png')

    render(<ImageUploader onUpload={mockOnUpload} category='monsters' />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })

    fireEvent.change(input, { target: { files: [file] } })

    const confirmButton = screen.getByText(/Confirmar/i)
    fireEvent.click(confirmButton)

    // Debería mostrar el estado de "Sellando..."
    expect(screen.getByText(/Sellando/i)).toBeInTheDocument()

    // Esperar a que se complete la promesa
    await vi.waitFor(() => {
      expect(StorageService.uploadFile).toHaveBeenCalledWith(
        expect.objectContaining({
          file,
          userId: 'user_123',
          category: 'monsters',
        })
      )
    })

    expect(mockOnUpload).toHaveBeenCalledWith('https://public.url/img.png')
    expect(screen.getByText(/Imagen Sellada/i)).toBeInTheDocument()
  })
})
