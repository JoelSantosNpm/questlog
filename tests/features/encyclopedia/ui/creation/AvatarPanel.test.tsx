import {
  DEFAULT_MONSTER_FORM_VALUES,
  type MonsterFormFields,
} from '@/views/encyclopedia/ui/monster-creation/monster-form-fields'
import { AvatarPanel } from '@/views/encyclopedia/ui/creation/AvatarPanel'
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

describe('AvatarPanel', () => {
  describe('Estado inicial (sin preview ni imagen guardada)', () => {
    it('muestra el botón de selección de imagen principal', () => {
      render(
        <FormWrapper>
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      expect(screen.getByRole('button', { name: /Imagen principal/i })).toBeInTheDocument()
    })

    it('no muestra el botón "Subir" si no hay preview seleccionado', () => {
      render(
        <FormWrapper>
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      expect(screen.queryByRole('button', { name: /Subir/i })).not.toBeInTheDocument()
    })

    it('renderiza la imagen de fondo del panel', () => {
      render(
        <FormWrapper>
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      expect(screen.getByAltText('')).toBeInTheDocument()
    })
  })

  describe('Panel de consejos de imagen', () => {
    it('se muestra cuando no hay preview ni imagen guardada', () => {
      render(
        <FormWrapper>
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      expect(screen.getByText('Consejos para la imagen')).toBeInTheDocument()
    })

    it('se oculta cuando hay un preview local', () => {
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        preview: 'blob:preview-url',
      })
      render(
        <FormWrapper>
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      expect(screen.queryByText('Consejos para la imagen')).not.toBeInTheDocument()
    })

    it('se oculta cuando ya hay una imageUrl guardada', () => {
      render(
        <FormWrapper imageUrl='https://example.com/avatar.png'>
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      expect(screen.queryByText('Consejos para la imagen')).not.toBeInTheDocument()
    })
  })

  describe('Con preview local seleccionado (subida en curso)', () => {
    it('muestra la imagen de preview en el panel', () => {
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        preview: 'blob:preview-url',
      })
      render(
        <FormWrapper>
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      expect(screen.getByAltText('preview')).toBeInTheDocument()
    })

    it('el botón está deshabilitado y muestra "..." mientras isUploading es true', () => {
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        isUploading: true,
      })
      render(
        <FormWrapper>
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      expect(screen.getByRole('button', { name: /\.\.\./i })).toBeDisabled()
    })

    it('nunca muestra un botón "Subir" manual (auto-upload)', () => {
      mockUseImageUploader.mockReturnValue({
        ...defaultUploaderState,
        preview: 'blob:preview-url',
      })
      render(
        <FormWrapper>
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      expect(screen.queryByRole('button', { name: /^Subir$/i })).not.toBeInTheDocument()
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
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
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
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: /Imagen principal/i }))
      expect(handleClick).toHaveBeenCalledOnce()
    })

    it('configura useImageUploader con autoUpload: true y el storagePath recibido', () => {
      render(
        <FormWrapper>
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      expect(mockUseImageUploader).toHaveBeenCalledWith(
        expect.objectContaining({ autoUpload: true, storagePath: 'monsters' })
      )
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
          <AvatarPanel<MonsterFormFields> storagePath='monsters' />
        </FormWrapper>
      )
      fireEvent.click(screen.getByRole('button', { name: /Cambiar imagen/i }))
      expect(handleReset).toHaveBeenCalledOnce()
    })
  })
})
