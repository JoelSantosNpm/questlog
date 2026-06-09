import {
  DEFAULT_MONSTER_FORM_VALUES,
  type MonsterFormFields,
} from '@/views/encyclopedia/ui/monster-creation/monster-form-fields'
import { MonsterPortraitUploader } from '@/views/encyclopedia/ui/monster-creation/MonsterPortraitUploader'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ─── Hoisted mock references ───────────────────────────────────────────────────

const { mockUseImageUploader } = vi.hoisted(() => ({
  mockUseImageUploader: vi.fn(),
}))

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/shared/ui/image-uploader/hooks/useImageUploader', () => ({
  useImageUploader: mockUseImageUploader,
}))

vi.mock('@/views/encyclopedia/ui/PortraitFrame', () => ({
  PortraitFrame: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

// ─── Helper ───────────────────────────────────────────────────────────────────

const defaultUploaderState = {
  fileInputRef: { current: null },
  handleFileSelect: vi.fn(),
  handleClick: vi.fn(),
  handleUpload: vi.fn(),
  handleReplace: vi.fn(),
  preview: null as string | null,
  isUploading: false,
  isSuccess: false,
}

function FormWrapper({
  children,
  portraitImageUrl,
}: {
  children: ReactNode
  portraitImageUrl?: string
}) {
  const methods = useForm<MonsterFormFields>({
    defaultValues: { ...DEFAULT_MONSTER_FORM_VALUES, portraitImageUrl },
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  mockUseImageUploader.mockReturnValue({ ...defaultUploaderState })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MonsterPortraitUploader', () => {
  describe('Sin imagen ni preview', () => {
    it('muestra el círculo placeholder (sin imagen)', () => {
      const { container } = render(
        <FormWrapper>
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      // No hay <img> de portrait — sólo el input[type=file] oculto
      expect(screen.queryByAltText('Portrait preview')).not.toBeInTheDocument()
      expect(container.querySelector('input[type="file"]')).toBeInTheDocument()
    })

    it('no muestra el badge de confirmación de subida', () => {
      render(
        <FormWrapper>
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      // El badge de upload sólo aparece cuando hay preview && !isSuccess
      // Con preview:null no hay badge secundario de upload, sólo el badge principal
      // Hay dos botones: el círculo principal y el badge izquierdo
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })
  })

  describe('Con preview local seleccionado (subida en curso)', () => {
    beforeEach(() => {
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        preview: 'blob:portrait-preview',
        isSuccess: false,
      })
    })

    it('muestra el portrait frame con la preview', () => {
      render(
        <FormWrapper>
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      expect(screen.getByAltText('Portrait preview')).toBeInTheDocument()
    })

    it('siempre hay exactamente dos botones (auto-upload, sin badge manual)', () => {
      render(
        <FormWrapper>
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      expect(screen.getAllByRole('button')).toHaveLength(2)
    })

    it('el badge izquierdo está deshabilitado y muestra "..." mientras isUploading', () => {
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        isUploading: true,
      })
      render(
        <FormWrapper>
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons[1]).toBeDisabled()
    })
  })

  describe('Con imagen guardada en el formulario', () => {
    it('muestra el portrait frame con la URL guardada', () => {
      render(
        <FormWrapper portraitImageUrl="https://example.com/portrait.jpg">
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      expect(screen.getByAltText('Portrait preview')).toBeInTheDocument()
    })

    it('no muestra badge de confirmación si no hay preview local pendiente', () => {
      render(
        <FormWrapper portraitImageUrl="https://example.com/portrait.jpg">
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })
  })

  describe('Interacciones', () => {
    it('click en el círculo principal invoca handleClick', () => {
      const handleClick = vi.fn()
      mockUseImageUploader.mockReturnValue({ ...defaultUploaderState, handleClick })
      render(
        <FormWrapper>
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      const buttons = screen.getAllByRole('button')
      fireEvent.click(buttons[0])
      expect(handleClick).toHaveBeenCalled()
    })

    it('configura useImageUploader con autoUpload: true', () => {
      render(
        <FormWrapper>
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      expect(mockUseImageUploader).toHaveBeenCalledWith(
        expect.objectContaining({ autoUpload: true })
      )
    })
  })

  describe('Tras subida exitosa (isSuccess: true)', () => {
    beforeEach(() => {
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        preview: 'blob:portrait-preview',
        isSuccess: true,
      })
    })

    it('click en el círculo principal invoca handleReplace, no handleClick', () => {
      const handleClick = vi.fn()
      const handleReplace = vi.fn()
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        isSuccess: true,
        handleClick,
        handleReplace,
      })
      render(
        <FormWrapper>
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      fireEvent.click(screen.getAllByRole('button')[0])
      expect(handleReplace).toHaveBeenCalled()
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('click en el badge izquierdo invoca handleReplace, no handleClick', () => {
      const handleClick = vi.fn()
      const handleReplace = vi.fn()
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        isSuccess: true,
        handleClick,
        handleReplace,
      })
      render(
        <FormWrapper>
          <MonsterPortraitUploader />
        </FormWrapper>
      )
      fireEvent.click(screen.getAllByRole('button')[1])
      expect(handleReplace).toHaveBeenCalled()
      expect(handleClick).not.toHaveBeenCalled()
    })
  })
})
