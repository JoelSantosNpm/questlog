'use client'

import { useImageUploader } from '@/shared/ui/image-uploader/hooks/useImageUploader'
import { Camera, RefreshCcw, Upload } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { FieldValues, Path } from 'react-hook-form'
import { useFormContext, useWatch } from 'react-hook-form'
import { PortraitFrame } from '../PortraitFrame'

interface PortraitUploaderProps {
  storagePath: 'monsters' | 'characters'
  variant: 'monster' | 'cast'
  onUpload?: (url: string) => void
}

export function PortraitUploader<
  TFieldValues extends FieldValues & { portraitImageUrl?: string | null },
>({ storagePath, variant, onUpload }: PortraitUploaderProps) {
  const t = useTranslations('Encyclopedia.creation')
  const { setValue, control } = useFormContext<TFieldValues>()
  const portraitUrl = useWatch({ control, name: 'portraitImageUrl' as Path<TFieldValues> }) as
    | string
    | undefined

  const {
    fileInputRef,
    handleFileSelect,
    handleClick,
    handleReplace,
    preview,
    isUploading,
    isSuccess,
  } = useImageUploader({
    storagePath,
    autoUpload: true,
    onUpload: (url) => {
      if (onUpload) {
        onUpload(url)
      } else {
        setValue('portraitImageUrl' as Path<TFieldValues>, (url || undefined) as never)
      }
    },
  })

  const previewSrc = portraitUrl ?? preview

  return (
    <div className='relative shrink-0'>
      <button
        type='button'
        onClick={isSuccess ? handleReplace : handleClick}
        disabled={isUploading}
        className='group block disabled:cursor-not-allowed'
      >
        {previewSrc ? (
          <div className='relative'>
            <PortraitFrame src={previewSrc} alt='Portrait preview' variant={variant} />
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

      <button
        type='button'
        onClick={isSuccess ? handleReplace : handleClick}
        disabled={isUploading}
        className={`absolute -bottom-1 -left-1 flex size-7 items-center justify-center rounded-full border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isSuccess
            ? 'border-neutral-600 bg-neutral-800 hover:border-amber-600/50'
            : 'border-amber-800/50 bg-amber-950/60 hover:border-amber-600/50 hover:bg-amber-900/60'
        }`}
      >
        {isUploading ? (
          <span className='text-[9px] text-amber-400'>...</span>
        ) : isSuccess ? (
          <RefreshCcw className='size-3 text-neutral-400' />
        ) : (
          <Upload className='size-3.5 text-amber-500/70' />
        )}
      </button>

      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept='image/*'
        aria-label={t('imagePortrait')}
        className='hidden'
      />
    </div>
  )
}
