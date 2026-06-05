'use client'

import { useImageUploader } from '@/shared/ui/image-uploader/hooks/useImageUploader'
import { Camera, RefreshCcw, Upload } from 'lucide-react'
import { useFormContext, useWatch } from 'react-hook-form'
import { PortraitFrame } from '../PortraitFrame'
import type { MonsterFormFields } from './MonsterForm'

export function MonsterPortraitUploader() {
  const { setValue, control } = useFormContext<MonsterFormFields>()
  const portraitUrl = useWatch({ control, name: 'portraitImageUrl' }) as string | undefined

  const {
    fileInputRef,
    handleFileSelect,
    handleClick,
    handleUpload,
    preview,
    isUploading,
    isSuccess,
  } = useImageUploader({
    storagePath: 'monsters',
    onUpload: (url) => setValue('portraitImageUrl', url || undefined),
  })

  const previewSrc = portraitUrl ?? preview

  return (
    <div className='relative shrink-0'>
      <button type='button' onClick={handleClick} className='group block'>
        {previewSrc ? (
          <div className='relative'>
            <PortraitFrame src={previewSrc} alt='Portrait preview' variant='monster' />
            <div className='absolute inset-0 rounded-full bg-black/0 transition-colors group-hover:bg-black/40 flex items-center justify-center'>
              <Camera className='size-5 text-white opacity-0 transition-opacity group-hover:opacity-100' />
            </div>
          </div>
        ) : (
          <div className='size-28 rounded-full border-2 border-dashed border-neutral-700 bg-neutral-900/50 flex items-center justify-center transition-colors group-hover:border-amber-600/50'>
            <Camera className='size-8 text-neutral-600 transition-colors group-hover:text-amber-600/70' />
          </div>
        )}
      </button>

      {/* Badge izquierdo — pista siempre visible: añadir o cambiar */}
      <button
        type='button'
        onClick={handleClick}
        className={`absolute -bottom-1 -left-1 flex size-7 items-center justify-center rounded-full border transition-colors ${
          previewSrc
            ? 'border-neutral-600 bg-neutral-800 hover:border-amber-600/50'
            : 'border-amber-800/50 bg-amber-950/60 hover:border-amber-600/50 hover:bg-amber-900/60'
        }`}
      >
        {previewSrc
          ? <RefreshCcw className='size-3 text-neutral-400' />
          : <Upload className='size-3.5 text-amber-500/70' />
        }
      </button>

      {/* Badge derecho — confirmar upload pendiente */}
      {preview && !isSuccess && (
        <button
          type='button'
          onClick={handleUpload}
          disabled={isUploading}
          className='absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-amber-700/80 transition-colors hover:bg-amber-600 disabled:opacity-50'
        >
          <Upload className='size-3.5 text-amber-200' />
        </button>
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
