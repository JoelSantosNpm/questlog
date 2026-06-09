import {
  DEFAULT_MONSTER_FORM_VALUES,
  type MonsterFormFields,
} from '@/views/encyclopedia/ui/monster-creation/monster-form-fields'
import { MonsterAvatarPanel } from '@/views/encyclopedia/ui/monster-creation/MonsterAvatarPanel'
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


// ─── Helper ───────────────────────────────────────────────────────────────────

const defaultUploaderState = {
  fileInputRef: { current: null },
  handleFileSelect: vi.fn(),
  handleClick: vi.fn(),
  handleUpload: vi.fn(),
  handleReset: vi.fn(),
  preview: null as string | null,
  isUploading: false,
  isSuccess: false,
}

function FormWrapper({ children, imageUrl }: { children: ReactNode; imageUrl?: string }) {
  const methods = useForm<MonsterFormFields>({
    defaultValues: { ...DEFAULT_MONSTER_FORM_VALUES, imageUrl },
  })
  return <FormProvider {...methods}>{children}</FormProvider>
}

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  mockUseImageUploader.mockReturnValue({ ...defaultUploaderState })
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('MonsterAvatarPanel', () => {
  describe('Estado inicial (sin preview ni imagen guardada)', () => {
    it('muestra el botón de selección de imagen principal', () => {
      render(
        <FormWrapper>
          <MonsterAvatarPanel />
        </FormWrapper>
      )
      expect(screen.getByRole('button', { name: /Imagen principal/i })).toBeInTheDocument()
    })

    it('no muestra el botón "Subir" si no hay preview seleccionado', () => {
      render(
        <FormWrapper>
          <MonsterAvatarPanel />
        </FormWrapper>
      )
      expect(screen.queryByRole('button', { name: /Subir/i })).not.toBeInTheDocument()
    })

    it('renderiza la imagen de fondo del panel', () => {
      render(
        <FormWrapper>
          <MonsterAvatarPanel />
        </FormWrapper>
      )
      expect(screen.getByAltText('')).toBeInTheDocument()
    })
  })

  describe('Con preview local seleccionado (antes de subir)', () => {
    beforeEach(() => {
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        preview: 'blob:preview-url',
        isSuccess: false,
      })
    })

    it('muestra el botón "Subir" cuando hay una preview', () => {
      render(
        <FormWrapper>
          <MonsterAvatarPanel />
        </FormWrapper>
      )
      expect(screen.getByRole('button', { name: /Subir/i })).toBeInTheDocument()
    })

    it('"Subir" está deshabilitado mientras isUploading es true', () => {
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        preview: 'blob:preview-url',
        isUploading: true,
      })
      render(
        <FormWrapper>
          <MonsterAvatarPanel />
        </FormWrapper>
      )
      expect(screen.getByRole('button', { name: /\.\.\./i })).toBeDisabled()
    })

    it('muestra la imagen de preview en el panel', () => {
      render(
        <FormWrapper>
          <MonsterAvatarPanel />
        </FormWrapper>
      )
      expect(screen.getByAltText('preview')).toBeInTheDocument()
    })
  })

  describe('Tras subida exitosa (isSuccess: true)', () => {
    beforeEach(() => {
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        isSuccess: true,
      })
    })

    it('muestra el botón "Cambiar imagen" en lugar del de subida', () => {
      render(
        <FormWrapper>
          <MonsterAvatarPanel />
        </FormWrapper>
      )
      expect(screen.getByRole('button', { name: /Cambiar imagen/i })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Imagen principal/i })).not.toBeInTheDocument()
    })
  })

  describe('Interacciones', () => {
    it('click en "Imagen principal" invoca handleClick', () => {
      const handleClick = vi.fn()
      mockUseImageUploader.mockReturnValue({ ...defaultUploaderState, handleClick })
      render(
        <FormWrapper>
          <MonsterAvatarPanel />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: /Imagen principal/i }))
      expect(handleClick).toHaveBeenCalledOnce()
    })

    it('click en "Subir" invoca handleUpload', () => {
      const handleUpload = vi.fn()
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        preview: 'blob:preview-url',
        handleUpload,
      })
      render(
        <FormWrapper>
          <MonsterAvatarPanel />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: /Subir/i }))
      expect(handleUpload).toHaveBeenCalledOnce()
    })

    it('click en "Cambiar imagen" invoca handleReset', () => {
      const handleReset = vi.fn()
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        isSuccess: true,
        handleReset,
      })
      render(
        <FormWrapper>
          <MonsterAvatarPanel />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: /Cambiar imagen/i }))
      expect(handleReset).toHaveBeenCalledOnce()
    })
  })
})
