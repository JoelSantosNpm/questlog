'use client'

import { StorageService } from '@/services/storage-service'
import { cn } from '@/shared/utils/styles'
import { useAuth } from '@clerk/nextjs'
import { CloudUpload, Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from 'react'
import { sileo } from 'sileo'

interface ImageUploaderProps {
  onUpload: (url: string) => void
  category?: 'campaigns' | 'monsters' | 'characters' | 'items' | 'assets'
  label?: string
  className?: string
}

export default function ImageUploader({
  onUpload,
  category = 'assets',
  label,
  className,
}: ImageUploaderProps) {
  const { getToken, userId } = useAuth()

  // Estados
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Limpieza total de estados
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

  // Gestión de memoria
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  // Lógica de validación y preview
  const processFile = useCallback(
    (selectedFile: File) => {
      // 1. LIMPIEZA TOTAL antes de cualquier validación
      clearStates()

      // 2. VALIDACIONES con Toasts de Sileo
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
    },
    [clearStates]
  )

  // Handlers
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

  // Subida Real a Supabase
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
        token,
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

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearStates()
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className='text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500'>
          {label}
        </label>
      )}

      <div className='relative group'>
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          role='button'
          tabIndex={preview ? -1 : 0}
          aria-label={label || 'Subir imagen'}
          className={cn(
            'relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-md transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-900/40',
            preview
              ? 'border-amber-900/30 bg-neutral-900/10'
              : 'border-neutral-800 hover:border-amber-900/60 bg-neutral-950/50 cursor-pointer',
            isDragging && 'border-amber-500 bg-amber-950/20 scale-[0.99]',
            isSuccess &&
              'border-emerald-900/50 bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
            isUploading && 'cursor-not-allowed opacity-80'
          )}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt='Vista previa'
                fill
                className={cn(
                  'object-cover transition-all duration-700',
                  isUploading ? 'scale-110 blur-sm' : 'scale-100'
                )}
              />

              {isUploading && (
                <div className='absolute inset-0 bg-neutral-950/60 flex flex-col items-center justify-center space-y-3 backdrop-blur-sm'>
                  <Loader2 className='w-8 h-8 text-amber-500 animate-spin' />
                  <p className='text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] animate-pulse'>
                    Sellando Archivo...
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className='flex flex-col items-center justify-center p-6 space-y-3'>
              <div className='p-3 bg-neutral-900/80 rounded-full border border-neutral-800 group-hover:border-amber-900/50 transition-colors'>
                <Upload
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isDragging ? 'text-amber-500' : 'text-neutral-600 group-hover:text-amber-600'
                  )}
                />
              </div>
              <div className='text-center'>
                <p className='text-xs font-bold text-neutral-500 group-hover:text-neutral-300 transition-colors uppercase tracking-widest'>
                  {isDragging ? 'Suelta para invocar' : 'Seleccionar Imagen'}
                </p>
                <p className='text-[10px] text-neutral-700 uppercase tracking-tighter'>
                  JPG, PNG, WebP (Máx 2MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        {preview && !isUploading && !isSuccess && (
          <div className='absolute bottom-3 right-3 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2'>
            <button
              type='button'
              onClick={reset}
              className='flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded text-[10px] font-bold text-neutral-400 hover:text-red-400 hover:border-red-900/30 transition-all uppercase tracking-wider'
            >
              <X className='w-3 h-3' /> Descartar
            </button>
            <button
              type='button'
              onClick={handleUpload}
              className='flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 border border-amber-600 rounded text-[10px] font-bold text-white hover:bg-amber-600 transition-all uppercase tracking-widest shadow-lg shadow-amber-900/20'
            >
              <CloudUpload className='w-3 h-3' /> Confirmar Subida
            </button>
          </div>
        )}

        {/* Botón Reset (Solo si ya se subió con éxito) */}
        {isSuccess && (
          <button
            type='button'
            onClick={reset}
            className='absolute top-2 right-2 p-1.5 bg-neutral-950/80 border border-neutral-800 rounded-full text-neutral-500 hover:text-white transition-all shadow-xl z-10'
            title='Quitar imagen'
          >
            <X className='w-3.5 h-3.5' />
          </button>
        )}
      </div>

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept='image/*'
        className='hidden'
      />
    </div>
  )
}
