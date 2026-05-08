import { uploadAsset } from '@/shared/api/storage-actions'
import ImageUploader from '@/shared/ui/image-uploader/ImageUploader'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// --- MOCKS ---

vi.mock('@/shared/api/storage-actions', () => ({
  uploadAsset: vi.fn(),
}))

vi.mock('sileo', () => ({
  sileo: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock de URL methods para JSDOM
global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('Storage Feature - ImageUploader UI', () => {
  const mockOnUpload = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
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
    fireEvent.click(screen.getByText(/Descartar/i))

    expect(screen.queryByAltText('Vista previa')).not.toBeInTheDocument()
    expect(screen.getByText(/Seleccionar Imagen/i)).toBeInTheDocument()
  })

  it('debe llamar a uploadAsset con el FormData correcto al confirmar', async () => {
    vi.mocked(uploadAsset).mockResolvedValue({ publicUrl: 'https://public.url/img.png' })

    render(<ImageUploader onUpload={mockOnUpload} storagePath='monsters' />)

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })

    fireEvent.change(input, { target: { files: [file] } })
    fireEvent.click(screen.getByText(/Confirmar/i))

    expect(screen.getByText(/Sellando/i)).toBeInTheDocument()

    await vi.waitFor(() => {
      expect(uploadAsset).toHaveBeenCalledOnce()
      const formData = vi.mocked(uploadAsset).mock.calls[0][0]
      expect(formData.get('file')).toBe(file)
      expect(formData.get('storagePath')).toBe('monsters')
    })

    expect(mockOnUpload).toHaveBeenCalledWith('https://public.url/img.png')
  })
})
