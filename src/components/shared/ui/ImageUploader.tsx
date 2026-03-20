'use client'

import { getSupabaseClient } from '@/lib/supabase'
import { cn } from '@/shared/utils/styles'
import { useAuth } from '@clerk/nextjs'
import { Loader2, Upload, X, Check, CloudUpload } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, useRef, useState } from 'react'

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
  className 
}: ImageUploaderProps) {
  const { getToken, userId } = useAuth()
  
  // Estados
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 1. Selección y Previsualización Local
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validaciones básicas
    if (selectedFile.size > 2 * 1024 * 1024) {
      setError('El archivo supera el tamaño máximo de 2MB')
      return
    }
    if (!selectedFile.type.startsWith('image/')) {
      setError('El archivo no es una imagen válida')
      return
    }

    setError(null)
    setIsSuccess(false)
    setFile(selectedFile)
    
    // Crear preview local instantáneo
    const localPreview = URL.createObjectURL(selectedFile)
    setPreview(localPreview)
  }

  // 2. Subida Real a Supabase (Bajo Demanda)
  const handleUpload = async () => {
    if (!file || !userId) return

    setIsUploading(true)
    setError(null)

    try {
      const supabaseToken = await getToken({ template: 'supabase' })
      if (!supabaseToken) throw new Error('No se pudo obtener el token de autenticación')

      const authenticatedSupabase = getSupabaseClient(supabaseToken)

      const fileExt = file.name.split('.').pop()
      const cleanFileName = file.name.split('.')[0].replace(/[^a-z0-9]/gi, '_').toLowerCase()
      const fileName = `${userId}/${category}/${Date.now()}-${cleanFileName}.${fileExt}`
      
      const { error: uploadError } = await authenticatedSupabase.storage
        .from('questlog-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = authenticatedSupabase.storage
        .from('questlog-assets')
        .getPublicUrl(fileName)

      onUpload(publicUrl)
      setIsSuccess(true)
    } catch (err: unknown) {
      console.error('Upload error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al subir la imagen'
      setError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
    setPreview(null)
    setIsSuccess(false)
    setError(null)
    onUpload('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className='text-xs uppercase tracking-widest font-bold text-neutral-500'>
          {label}
        </label>
      )}

      <div className='relative group'>
        {/* Contenedor de la Imagen / Dropzone */}
        <div
          onClick={() => !isUploading && !isSuccess && fileInputRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-md transition-all overflow-hidden',
            preview 
              ? 'border-amber-900/30 bg-neutral-900/20' 
              : 'border-neutral-800 hover:border-amber-900/60 bg-neutral-950/50 cursor-pointer',
            isSuccess && 'border-emerald-900/50 bg-emerald-950/10',
            isUploading && 'cursor-not-allowed opacity-80',
            error && 'border-red-900/50'
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
                  isUploading ? 'scale-110 blur-sm' : 'scale-100',
                  isSuccess ? 'opacity-80' : 'opacity-100'
                )}
              />
              
              {/* Overlay de Carga */}
              {isUploading && (
                <div className='absolute inset-0 bg-neutral-950/60 flex flex-col items-center justify-center space-y-3 backdrop-blur-sm'>
                  <Loader2 className='w-8 h-8 text-amber-500 animate-spin' />
                  <p className='text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] animate-pulse'>
                    Sellando Archivo...
                  </p>
                </div>
              )}

              {/* Overlay de Éxito */}
              {isSuccess && (
                <div className='absolute inset-0 bg-emerald-950/40 flex flex-col items-center justify-center space-y-2 backdrop-blur-[2px]'>
                  <div className='p-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/20'>
                    <Check className='w-5 h-5 text-white' />
                  </div>
                  <p className='text-[10px] font-bold text-emerald-400 uppercase tracking-widest'>Subida Completada</p>
                </div>
              )}
            </>
          ) : (
            <div className='flex flex-col items-center justify-center p-6 space-y-3'>
              <div className='p-3 bg-neutral-900/80 rounded-full border border-neutral-800 group-hover:border-amber-900/50 transition-colors'>
                <Upload className='w-5 h-5 text-neutral-600 group-hover:text-amber-600 transition-colors' />
              </div>
              <div className='text-center'>
                <p className='text-xs font-bold text-neutral-500 group-hover:text-neutral-300 transition-colors uppercase tracking-widest'>
                  Seleccionar Imagen
                </p>
                <p className='text-[10px] text-neutral-700 uppercase tracking-tighter'>
                  JPG, PNG, WebP (Máx 2MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botones de Acción (Solo si hay preview y no se ha subido aún) */}
        {preview && !isUploading && !isSuccess && (
          <div className='absolute bottom-3 right-3 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2'>
            <button
              type='button'
              onClick={reset}
              className='flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-[10px] font-bold text-neutral-400 hover:text-red-400 hover:border-red-900/30 transition-all uppercase tracking-wider'
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

      {error && (
        <p className='text-[10px] text-red-600 font-bold uppercase tracking-wider'>{error}</p>
      )}

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
