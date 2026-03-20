'use client'

import { StorageService } from '@/services/storage-service'
import { useAuth } from '@clerk/nextjs'
import { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from 'react'
import { sileo } from 'sileo'

interface UseImageUploaderProps {
  onUpload: (url: string) => void
  category: string
}

export function useImageUploader({ onUpload, category }: UseImageUploaderProps) {
  const { getToken, userId } = useAuth()
  
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const clearStates = useCallback(() => {
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
  }, [preview, onUpload])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const processFile = useCallback((selectedFile: File) => {
    clearStates()

    if (selectedFile.size > 2 * 1024 * 1024) {
      sileo.error({
        title: 'Archivo demasiado pesado',
        description: 'La imagen excede el límite de 2MB. Reduce su tamaño.',
      })
      return
    }

    if (!selectedFile.type.startsWith('image/')) {
      sileo.error({
        title: 'Material no apto',
        description: 'El archivo debe ser una imagen (JPG, PNG, WebP).',
      })
      return
    }

    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }, [clearStates])

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) processFile(selectedFile)
  }

  const handleClick = () => {
    if (isUploading || isSuccess) return
    clearStates()
    fileInputRef.current?.click()
  }

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true)
    else if (e.type === 'dragleave') setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) processFile(droppedFile)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const handleUpload = async () => {
    if (!file || !userId) return

    setIsUploading(true)

    try {
      const token = await getToken({ template: 'supabase' })
      if (!token) throw new Error('No se pudo obtener el token de autenticación')

      const publicUrl = await StorageService.uploadFile({
        file,
        userId,
        category,
        token
      })

      onUpload(publicUrl)
      setIsSuccess(true)
      
      sileo.success({
        title: 'Imagen Sellada',
        description: 'La ilustración ha sido guardada en los archivos de la campaña.',
      })
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

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearStates()
  }

  return {
    file,
    preview,
    isUploading,
    isSuccess,
    isDragging,
    fileInputRef,
    handleFileSelect,
    handleClick,
    handleDrag,
    handleDrop,
    handleKeyDown,
    handleUpload,
    handleReset
  }
}
