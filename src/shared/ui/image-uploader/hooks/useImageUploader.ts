'use client'

import { uploadAsset } from '@/shared/api/storage-actions'
import { FileValidationSchema } from '@/shared/schemas/storage'
import { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { sileo } from 'sileo'

type StoragePath =
  | 'assets'
  | 'profile'
  | 'characters'
  | 'monsters'
  | 'items'
  | `campaigns/${string}`
  | `characters/${string}`
  | `monsters/${string}`
  | `items/${string}`

interface UseImageUploaderProps {
  onUpload: (url: string) => void
  storagePath: StoragePath
  autoUpload?: boolean
}

export function useImageUploader({ onUpload, storagePath, autoUpload = false }: UseImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const clearStates = () => {
    setFile(null)
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
    setIsSuccess(false)
    onUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const processFile = (selectedFile: File) => {
    clearStates()

    const result = FileValidationSchema.safeParse(selectedFile)

    if (!result.success) {
      sileo.error({
        title: 'Anomalía en el Archivo',
        description: result.error.issues[0].message,
      })
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))

    if (autoUpload) void handleUpload(selectedFile)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) processFile(selectedFile)
  }

  const handleClick = () => {
    if (isUploading || isSuccess) return
    clearStates()
    fileInputRef.current?.click()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const handleUpload = async (fileOverride?: File) => {
    const target = fileOverride ?? file
    if (!target) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', target)
      formData.append('storagePath', storagePath)

      const { publicUrl } = await uploadAsset(formData)

      onUpload(publicUrl)
      setIsSuccess(true)

      if (!autoUpload) {
        sileo.success({
          title: 'Imagen Sellada',
          description: 'La ilustración ha sido guardada en los archivos de la campaña.',
        })
      }
    } catch (err: unknown) {
      console.error('Upload error:', err)
      sileo.error({
        title: 'Fallo al Guardar',
        description: err instanceof Error ? err.message : 'Error desconocido al subir la imagen.',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = (e: MouseEvent) => {
    e.stopPropagation()
    clearStates()
  }

  return {
    file,
    preview,
    isUploading,
    isSuccess,
    fileInputRef,
    handleFileSelect,
    handleClick,
    handleKeyDown,
    handleUpload,
    handleReset,
    processFile,
  }
}
