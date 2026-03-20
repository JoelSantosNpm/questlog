'use client'

import { getSupabaseClient } from '@/lib/supabase'
import { cn } from '@/shared/utils/styles'
import { useAuth } from '@clerk/nextjs'
import { Loader2, Upload, X } from 'lucide-react'
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
  className,
}: ImageUploaderProps) {
  const { getToken, userId } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    // Validaciones
    if (file.size > 2 * 1024 * 1024) {
      setError('El archivo supera el tamaño máximo de 2MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('El archivo no es una imagen válida')
      return
    }

    setError(null)
    setIsUploading(true)

    // Preview local instantáneo
    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    try {
      // 1. Obtener el token de Clerk para Supabase
      const supabaseToken = await getToken({ template: 'supabase' })

      if (!supabaseToken) {
        throw new Error('No se pudo obtener el token de autenticación')
      }

      // 2. Obtener cliente autenticado mediante helper limpio
      const authenticatedSupabase = getSupabaseClient(supabaseToken)

      // 3. Subir el archivo organizado por: userId / category / filename.ext
      const fileExt = file.name.split('.').pop()
      // Saneamos el nombre original quitando espacios y caracteres raros
      const cleanFileName = file.name
        .split('.')[0]
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()
      const fileName = `${userId}/${category}/${Date.now()}-${cleanFileName}.${fileExt}`

      const { error: uploadError } = await authenticatedSupabase.storage
        .from('questlog-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // 4. Obtener URL Pública
      const {
        data: { publicUrl },
      } = authenticatedSupabase.storage.from('questlog-assets').getPublicUrl(fileName)

      onUpload(publicUrl)
    } catch (err: unknown) {
      console.error('Upload error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al subir la imagen'
      setError(errorMessage)
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onUpload('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className='text-xs uppercase tracking-wider font-semibold text-neutral-500'>
          {label}
        </label>
      )}

      <div className='relative'>
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            'group relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-md transition-all cursor-pointer overflow-hidden',
            preview
              ? 'border-amber-900/40 bg-neutral-900/50'
              : 'border-neutral-800 hover:border-amber-900/60 bg-neutral-950/50',
            isUploading && 'cursor-not-allowed opacity-70',
            error && 'border-red-900/50'
          )}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt='Vista previa'
                fill
                className='object-cover transition-transform group-hover:scale-105 duration-500'
              />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]'>
                <p className='text-white text-xs font-bold tracking-widest uppercase'>
                  Cambiar Imagen
                </p>
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center p-6 space-y-3'>
              <div className='p-3 bg-neutral-900/80 rounded-full border border-neutral-800 group-hover:border-amber-900/50 transition-colors shadow-inner'>
                <Upload className='w-5 h-5 text-neutral-600 group-hover:text-amber-600 transition-colors' />
              </div>
              <div className='text-center'>
                <p className='text-xs font-bold text-neutral-500 group-hover:text-neutral-300 transition-colors uppercase tracking-widest'>
                  Añadir Archivo
                </p>
                <p className='text-[10px] text-neutral-700 uppercase tracking-tighter'>
                  Máx 2MB (WebP, PNG, JPG)
                </p>
              </div>
            </div>
          )}

          {isUploading && (
            <div className='absolute inset-0 bg-neutral-950/80 flex flex-col items-center justify-center space-y-3 backdrop-blur-md'>
              <Loader2 className='w-8 h-8 text-amber-600 animate-spin' />
              <p className='text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] animate-pulse'>
                Invocando...
              </p>
            </div>
          )}
        </div>

        {preview && !isUploading && (
          <button
            type='button'
            onClick={removeImage}
            className='absolute top-2 right-2 p-1.5 bg-neutral-950/90 border border-red-900/30 rounded-full text-red-600 hover:bg-red-950 hover:text-red-500 transition-all shadow-xl z-10'
            title='Eliminar imagen'
          >
            <X className='w-3.5 h-3.5' />
          </button>
        )}
      </div>

      {error && (
        <p className='text-[10px] text-red-600 font-bold uppercase tracking-wider animate-shake'>
          {error}
        </p>
      )}

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/*'
        className='hidden'
      />
    </div>
  )
}
