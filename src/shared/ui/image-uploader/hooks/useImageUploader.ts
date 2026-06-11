'use client'

import { uploadAsset } from '@/shared/api/storage-actions'
import { FileValidationSchema } from '@/shared/schemas/storage'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('Common')
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
      const code = result.error.issues[0].message
      sileo.error({
        title: t('imageUploader.validationErrorTitle'),
        description:
          code === 'fileTooLarge'
            ? t('imageUploader.validationFileTooLarge')
            : t('imageUploader.validationInvalidFileType'),
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

    const formData = new FormData()
    formData.append('file', target)
    formData.append('storagePath', storagePath)

    const result = await uploadAsset(formData)

    if ('error' in result) {
      sileo.error({
        title: t('imageUploader.toastErrorTitle'),
        description:
          result.error === 'unauthenticated'
            ? t('auth.requiredDescription')
            : t('imageUploader.toastErrorGeneric'),
      })
    } else {
      onUpload(result.publicUrl)
      setIsSuccess(true)

      if (!autoUpload) {
        sileo.success({
          title: t('imageUploader.toastSuccessTitle'),
          description: t('imageUploader.toastSuccessDesc'),
        })
      }
    }

    setIsUploading(false)
  }

  const handleReset = (e: MouseEvent) => {
    e.stopPropagation()
    clearStates()
  }

  const handleReplace = () => {
    if (isUploading) return
    clearStates()
    fileInputRef.current?.click()
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
    handleReplace,
    processFile,
  }
}
